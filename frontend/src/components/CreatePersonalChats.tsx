import { Box, Button } from "@mui/material";
import { useState } from "react";
import PersonalChatModel from "./PersonalChatModel";

const CreateChat = () => {
  const [chatModal, setChatModal] = useState(false);
  
  const onClose = () => {
    setChatModal(!chatModal);
  };

  return (
    <Box>
      <PersonalChatModel open={chatModal} onClose={onClose} />
      <Button onClick={() => onClose()}>Create Chat</Button>
    </Box>
  );
};

export default CreateChat;
