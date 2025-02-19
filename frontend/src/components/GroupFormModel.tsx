import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button, List, ListItem, ListItemText, Checkbox } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreateGroupMutation, useGetallUsersMutation } from "../services/api"; // Fetch users
import { toast } from "react-toastify";
import { User } from "../types";

// 🛠 Yup Schema for Validation
const validation = yup.object({
  name: yup.string().required("Group name is required").min(3, "Minimum 3 characters"),
  description: yup.string().optional(),
  members: yup.array().of(yup.string()).min(1, "Select at least one member"),
});

type GroupFormData = yup.InferType<typeof validation>;

interface GroupFormModalProps {
  open: boolean;
  onClose: () => void;
}

const GroupFormModal: React.FC<GroupFormModalProps> = ({ open, onClose }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<GroupFormData>({
    defaultValues: { name: "", description: "", members: [] },
    resolver: yupResolver(validation),
  });
  const [users, setUsers] = useState<User[]>()
  const [getUsers] = useGetallUsersMutation(); // Fetch all users
  const [createGroup] = useCreateGroupMutation();
  const selectedMembers = watch("members");
  useEffect(() => {
    const fetchuser = async () => {
      try {
        const res = await getUsers().unwrap();
        setUsers(res.data);
      } catch (e) {
        console.log('Error in fetching users', e)
      }
    }
    fetchuser();
  }, [])
  const toggleMemberSelection = (id: string) => {
    setValue(
      "members",
      selectedMembers.includes(id)
        ? selectedMembers.filter((memberId) => memberId !== id)
        : [...selectedMembers, id]
    );
  };

  const onSubmit = async (data: GroupFormData) => {
    try {
        await createGroup(data).unwrap();
      toast.success("Group created successfully!");
      reset();
      onClose();
    } catch (error: any) {
      const validationError = error?.data?.data?.errors?.[0]?.msg;
      toast.error(validationError ?? error?.data?.message ?? "Something went wrong!");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Create a New Group
        </Typography>

        {/* Group Name Field */}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Group Name"
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{ mb: 2 }}
            />
          )}
        />

        {/* Description Field */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Description"
              variant="outlined"
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
          )}
        />

        {/* Select Members */}
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Select Members:
        </Typography>
        <List sx={{ maxHeight: 200, overflow: "auto", border: "1px solid #ddd", borderRadius: 1, mb: 2 }}>
          {users?.map((user) => (
            <ListItem key={user.id} button onClick={() => toggleMemberSelection(user.id)} sx={{ cursor: "pointer", px: '2px' }} component={'div'}>
              <Checkbox checked={selectedMembers.includes(user.id)} />
              <ListItemText primary={user.name} secondary={user.email} />
            </ListItem>
          ))}
        </List>
        {errors.members && <Typography color="error">{errors.members.message}</Typography>}

        {/* Buttons */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
            Create
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default GroupFormModal;
