import { useEffect, useMemo, useRef, useState, Suspense, lazy } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useGetGroupChatsMutation, useSendGroupMsgMutation } from "../services/api";
import { GroupMessageInterface, User } from "../types";
const GroupDetailsModel = lazy(() => import("./GroupDetailsModel"));

interface PropsInterface {
    currentGroup: { id: string; name?: string, isGroup: Boolean };
    currentUser: { id: string; email: string };
    allUsers: User[]
}

const validationSchema = Yup.object({
    msg: Yup.string()
        .trim()
        .min(1, "Message cannot be empty")
        .max(500, "Message is too long")
        .required("Message is required"),
});

type FormData = typeof validationSchema.__outputType;

const GroupChatBox = ({ currentGroup, currentUser, allUsers }: PropsInterface) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        defaultValues: { msg: "" },
        resolver: yupResolver(validationSchema),
    });
    const [groupMessages, setGroupMessages] = useState<GroupMessageInterface[]>([]);
    const [open, setOpen] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [getGroupChats, { isLoading }] = useGetGroupChatsMutation();
    const [sendGroupMsg, { isError: sendError }] = useSendGroupMsgMutation();
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await getGroupChats({ id: currentGroup.id }).unwrap();
                setGroupMessages(res.data);
            } catch (e) {

            }
        }
        fetchChats();
    }, [currentGroup])
    // Filter & sort messages
    useMemo(() => {
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight * 0.7;
            }
        }, 500);
    }, [currentGroup]);
    const getsendername = (userId: string): string => {
        const user = allUsers.find((u) => {
            return u.id === userId;
        })
        return user.name;
    }

    const sendMessage = async (data: FormData) => {
        try {
            const res = await sendGroupMsg({
                id: currentGroup.id,
                email: currentUser.email,
                msg: data.msg,
            }).unwrap();
            console.log(res)
            if (!sendError) {
                setGroupMessages((prev) => [...prev, res.data]);

            }
            reset();
        } catch (e) {
            console.error("Error sending message:", e);
        }
    };
    const closeModel = () => { setOpen(false) };

    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <GroupDetailsModel currentGroup={currentGroup} currentUser={currentUser} open={open} closeModel={closeModel} />
            </Suspense>

            <motion.div
                key={currentGroup.id}
                initial={{ opacity: 0, y: 20 }} // Initial state (hidden and slightly below)
                animate={{ opacity: 1, y: 0 }} // Animate to visible state
                transition={{ duration: 0.5, ease: "easeOut" }} // Smooth transition
                style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}
            >

                <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
                    <Paper elevation={3} sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
                        {/* Group Name Heading */}
                        <Box sx={{ padding: 2, bgcolor: "primary.main", color: "white", display: 'flex', flexDirection: "row", justifyContent: 'space-between' }}>
                            <Typography variant="h6" >
                                {currentGroup.name}
                            </Typography>

                            {/* Show Members Button */}
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{}}
                                onClick={() => setOpen(true)}
                            >
                                Show Members
                            </Button>

                        </Box>

                        {/* Group Chat Messages */}
                        <Box ref={chatContainerRef} sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
                            {groupMessages.length > 0 ? (
                                groupMessages.map((chat, index) => (
                                    <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: chat.fromId === currentUser.id ? "flex-end" : "flex-start", marginBottom: 1 }}>
                                        {/* Sender Name */}
                                        <Typography sx={{ fontSize: "12px", color: "gray", marginBottom: "2px" }}>{getsendername(chat.fromId)}</Typography>
                                        {/* Message Bubble */}
                                        <Typography sx={{ padding: "8px 12px", borderRadius: 2, bgcolor: chat.fromId === currentUser.id ? "#181616" : "primary.light", color: chat.fromId === currentUser.email ? "black" : "white", maxWidth: "60%" }}>
                                            {chat.message}
                                        </Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography sx={{ textAlign: "center", color: "grey.500" }}>No messages yet.</Typography>
                            )}
                        </Box>

                        {/* Message Input Field */}
                        <Box component={"form"} onSubmit={handleSubmit(sendMessage)} sx={{ display: "flex", padding: 2, borderTop: "1px solid #ddd" }}>
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
        </>
    );
};

export default GroupChatBox;
