import { Modal, Box, Typography, Button, IconButton, List, ListItem, ListItemText, Divider } from "@mui/material";
import { motion } from "framer-motion";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import { useCallback, useEffect, useState } from "react";
import { useGetMemebersMutation } from "../services/api";

interface PropsInterface {
    currentGroup: { id: string; name?: string, isGroup: Boolean };
    currentUser: { id: string; email: string };
    open: boolean,
    closeModel: () => void;
}
interface member {
    email: string,
    id: string,
    name: string
}

const GroupDetailsModel = ({ currentGroup, currentUser, open, closeModel }: PropsInterface) => {
    const isAdmin = currentGroup.id === currentUser.id;
    const [getmembers] = useGetMemebersMutation();
    const [Members, setMembers] = useState<member[]>([])
    const onRemoveMember = useCallback((memberId : string) => {
        console.log(memberId);
        // Member removal logic
    }, []);

    const onAddMember = useCallback(() => {
        // Member addition logic
    }, []);
    useEffect(() => {
        const fetchmembers = async () => {
            const res = await getmembers({ id: currentGroup.id });  
            setMembers(res.data.data.members)

        }
        fetchmembers();
    }, [open]);

    return (
        <>
            {/* Modal */}
            <Modal open={open} onClose={closeModel} sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        borderRadius: 2,
                        p: 3,
                    }}
                >
                    {/* Header */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6">{currentGroup.name}</Typography>
                        <IconButton onClick={closeModel}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        { }
                    </Typography>
                    <Typography variant="body1">
                        Members
                    </Typography>
                    {/* Members List */}
                    <List>
                        {
                            Members.length === 0? 'no member in group' : ""
                        }
                        {Members?.map((member) => (
                            <div key={member.id}>
                                <ListItem
                                    secondaryAction={
                                        isAdmin && (
                                            <IconButton edge="end" color="error" onClick={() => onRemoveMember(member.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        )
                                    }
                                >
                                    <ListItemText primary={member.name} secondary={member.email} />
                                </ListItem>
                                <Divider />
                            </div>
                        ))}
                    </List>

                    {/* Add Members Button */}
                    <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={onAddMember}
                    >
                        Add More Members
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default GroupDetailsModel;
