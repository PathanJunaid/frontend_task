import { useEffect, useMemo, useState } from "react";
import { Grid, Box, TextField, Button, Typography, Paper } from "@mui/material";

interface ChatMessage {
  id: string;
  fromEmail: string;
  toEmail: string;
  message: string;
  Status: string;
  createdAt: string;
}
const Filter = (chatData: ChatMessage[], User: string): ChatMessage[] => {
  const userChats = chatData
    .filter((chat) => chat.fromEmail === User || chat.toEmail === User) // Get only user's messages
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    ); // Sort by time (oldest first)
  return userChats;
};
const ChatBox = ({
  chatData,
  currentUser,
}: {
  chatData: ChatMessage[];
  currentUser: string;
}) => {
  const [message, setMessage] = useState("");
  const [FilterChat, setFilterChat] = useState(() =>
    Filter(chatData, currentUser)
  );
  useMemo(() => {
    setFilterChat(() => Filter(chatData, currentUser));
  }, [currentUser]);
  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      fromEmail: currentUser,
      toEmail: "otheruser@example.com", // Replace with actual recipient
      message,
      Status: "sent",
      createdAt: new Date().toISOString(),
    };

    chatData.push(newMessage); // Temporary update (replace with API call)
    setMessage("");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          height: 400,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Heading with User Email */}
        <Typography
          variant="h6"
          sx={{ padding: 2, bgcolor: "primary.main", color: "white" }}
        >
          {currentUser}
        </Typography>

        {/* Chat Messages */}
        <Box sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
          {FilterChat.length > 0 ? (
            FilterChat.map((chat) => (
              <Box
                key={chat.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    chat.fromEmail === currentUser ? "flex-end" : "flex-start",
                  marginBottom: 1,
                }}
              >
                <Typography
                  sx={{
                    padding: "8px 12px",
                    borderRadius: 2,
                    bgcolor:
                      chat.fromEmail === currentUser
                        ? "primary.light"
                        : "grey.300",
                    color: chat.fromEmail === currentUser ? "white" : "black",
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
        <Box sx={{ display: "flex", padding: 2, borderTop: "1px solid #ddd" }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            onClick={handleSendMessage}
            variant="contained"
            sx={{ marginLeft: 1 }}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatBox;
