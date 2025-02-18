import React from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreateGroupMutation } from "../services/api";
import { toast } from "react-toastify";

interface GroupFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (groupData: GroupFormData) => void;
}

// 🛠 Yup Schema for Validation
const validation = yup.object({
  name: yup.string().required("Group name is required").min(3, "Minimum 3 characters"),
  description: yup.string().optional(),
});
type GroupFormData = typeof validation.__outputType;
const GroupFormModal: React.FC<GroupFormModalProps> = ({ open, onClose }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupFormData>({
    defaultValues: { name: "", description: "" }, // Ensure these match GroupFormData
    resolver: yupResolver(validation),  // Use Yup resolver with the correct schema
  });

  const [createGroup] = useCreateGroupMutation();
  const onSubmit = async(data : GroupFormData)=>{
    try {
          await createGroup(data).unwrap();
          toast.success("User logged in successfully!");
        } catch (error: any) {
          const validationError = error?.data?.data?.errors?.[0].msg;
          toast.error(
            validationError ?? error?.data?.message ?? "Something went wrong!"
          );
        }
  }
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
