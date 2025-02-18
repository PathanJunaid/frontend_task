import React from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreateChatMutation } from "../services/api"; // Replace with your API service
import { toast } from "react-toastify";

// Yup Schema for Validation
const validation = yup.object({
  receiverEmail: yup
    .string()
    .email("Invalid email format")
    .required("Receiver email is required"),
  msg: yup.string().required("Message is required"),
});
type ChatFormData = typeof validation.__outputType;

interface ChatFormModalProps {
  open: boolean;
  onClose: () => void;
}

const PersonalChatModel: React.FC<ChatFormModalProps> = ({ open, onClose }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChatFormData>({
    defaultValues: { receiverEmail: "", msg: "" }, // Updated to match new fields
    resolver: yupResolver(validation),  // Use Yup resolver with the correct schema
  });

  const [createChat] = useCreateChatMutation(); // Replace with actual mutation hook
  const onSubmit = async (data: ChatFormData) => {
    try {
      const formData = {
        receiverEmail: data.receiverEmail ?? "",
        msg: data.msg ?? ""
      };
      await createChat(formData).unwrap();
      toast.success("Chat created successfully!");
    } catch (error: any) {
      const validationError = error?.data?.data?.errors?.[0].msg;
      toast.error(
        validationError ?? error?.data?.message ?? "Something went wrong!"
      );
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
        }}
      >
        <Typography variant="h6" gutterBottom>
          Create a New Chat
        </Typography>

        {/* Receiver Email Field */}
        <Controller
          name="receiverEmail"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Receiver Email"
              variant="outlined"
              error={!!errors.receiverEmail}
              helperText={errors.receiverEmail?.message}
              sx={{ mb: 2 }}
            />
          )}
        />

        {/* Message Field */}
        <Controller
          name="msg"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Message"
              variant="outlined"
              multiline
              rows={3}
              error={!!errors.msg}
              helperText={errors.msg?.message}
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

export default PersonalChatModel;
