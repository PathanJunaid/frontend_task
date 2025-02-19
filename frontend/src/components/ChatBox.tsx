import { useEffect, useMemo, useRef, useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import * as Yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from 'framer-motion'

import { useSendMsgMutation } from "../services/api";


interface ChatMessage {
  id: string;
  fromEmail: string;
  toEmail: string;
  message: string;
  Status: string;
  createdAt: string;
}

interface PropsInterface {
  chatData: ChatMessage[]; currentUser: { id: string, isGroup: Boolean };
  setChatData: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}


const validationSchema = Yup.object({
  msg: Yup.string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(500, "Message is too long")
    .required("Message is required"),
});

type FormData = typeof validationSchema.__outputType;

const Filter = (chatData: ChatMessage[], User: string): ChatMessage[] => {
  const userChats = chatData
    .filter((chat) => chat.fromEmail === User || chat.toEmail === User) // Get only user's messages
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    ); // Sort by time (oldest first)
  return userChats;
};


const ChatBox = ({ chatData, currentUser, setChatData }: PropsInterface) => {
  const [FilterChat, setFilterChat] = useState(() =>
    Filter(chatData, currentUser.id)
  );
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      msg: "",
    },
    resolver: yupResolver(validationSchema),
  });
  const [sendMsg, { isLoading }] = useSendMsgMutation();
  useMemo(() => {
    setFilterChat(() => Filter(chatData, currentUser.id));
    setTimeout(() => {
      if (chatContainerRef.current) {
        const chatBox = chatContainerRef.current;
        chatBox.scrollTop = chatBox.scrollHeight * 0.7; // Start at 70% of total height
      }
    }, 500);
  }, [currentUser, chatData]);
  const SendMessage = async (data: FormData) => {
    try {
      const res = await sendMsg({ msg: data.msg, recieverEmail: currentUser.id }).unwrap();
      setChatData((prevChatData: ChatMessage[]) => [...prevChatData, res.data]);
      reset();
    } catch (e) {

    }
  };

  return (
    <motion.div
      key={currentUser.id}
      initial={{ opacity: 0, y: 20 }} // Initial state (hidden and slightly below)
      animate={{ opacity: 1, y: 0 }} // Animate to visible state
      transition={{ duration: 0.5, ease: "easeOut" }} // Smooth transition
      style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}
    >

      <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            height: "100%", // Make Paper take full height
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Heading with User Email */}
          <Typography
            variant="h6"
            sx={{ padding: 2, bgcolor: "primary.main", color: "white" }}
          >
            {currentUser.id}
          </Typography>

          {/* Chat Messages */}
          <Box ref={chatContainerRef} sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
            {FilterChat.length > 0 ? (
              FilterChat.map((chat) => (
                <Box
                  key={chat.id}
                  sx={{
                    display: "flex",
                    justifyContent: chat.fromEmail === currentUser.id ? "flex-start" : "flex-end",
                    marginBottom: 1,
                  }}
                >
                  <Typography
                    sx={{
                      padding: "8px 12px",
                      borderRadius: 2,
                      bgcolor: chat.fromEmail === currentUser.id ? "#181616" : "primary.light",
                      color: chat.fromEmail === currentUser.id ? "white" : "black",
                      maxWidth: "60%",
                    }}
                  >
                    {chat.message}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography sx={{ textAlign: "center", color: "grey.500" }}>
                No messages yet.
              </Typography>
            )}
          </Box>

          {/* Input Field */}
          <Box component={"form"} onSubmit={handleSubmit(SendMessage)} sx={{ display: "flex", padding: 2, borderTop: "1px solid #ddd" }}>
            <motion.div
              animate={errors.msg ? { x: [-10, 10, -10, 0] } : {}}
              transition={{ duration: 0.3 }}
              style={{ flex: 1 }}
            >
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Type a message..."
                {...register("msg")}
                error={!!errors.msg}
                helperText={errors.msg?.message}
              />
            </motion.div>
            <Button type="submit" variant="contained" sx={{ marginLeft: 1 }} disabled={isLoading}>
              Send
            </Button>
          </Box>
        </Paper>
      </Box>
    </motion.div>

  );
};

export default ChatBox;
