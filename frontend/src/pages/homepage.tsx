import { Divider, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


// import Chats from "../components/Chats";
import { useGetChatsMutation, useGetGroupsMutation } from "../services/api";
import { ChatMessage, Group } from "../types";
import Groups from "../components/Groups";
import CreateGroup from "../components/CreateGroup";
import CreateChat from "../components/CreatePersonalChats";
import ChatUsers from "../components/ChatUsers";
import ChatBox from "../components/ChatBox";

const Home = () => {
  const [selected, setSelected] = useState<string>(null); // Track the selected Typography
  const [getGroups, { isError: groupError }] = useGetGroupsMutation();
  const [getChats, { data, error, isLoading, isError }] = useGetChatsMutation();
  const [groupsData, setGroupsData] = useState<Group[]>([]);
  const [chatData, setChatData] = useState<ChatMessage[]>([]);
  const [Emails, setEmails] = useState<string[]>([]);
  useEffect(() => {
    const fetchGroupsandchats = async () => {
      try {
        const res = await getGroups().unwrap();
        const res1 = await getChats().unwrap();
        if (!isError && !groupError) {
          setChatData(res1.data);
          setGroupsData(res.data);
          const adminEmail = "Sam@gmail.com";
          setEmails([
            ...new Set(
              res1.data
                .slice() // Creates a shallow copy to avoid modifying the original array
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .flatMap((message) => [message.fromEmail, message.toEmail]) // Get both sender and receiver emails
                .filter((email) => email && email !== adminEmail) // Exclude admin email & remove null/undefined
            )
          ]);
        }
        else {
          console.error("Unexpected response format:", res);
          toast.error("Unexpected response format from server!");
        }
      } catch (error: any) {
        const validationError = error?.data?.data?.errors?.[0]?.msg;
        console.log(error)
        toast.error(validationError ?? error?.data?.message ?? "Something went wrong!");
      }
    };

    fetchGroupsandchats();
  }, []);
  const handleClick = (index: string) => {
    setSelected(index); // Set the selected index when a Typography is clicked
  };
  return (
    <>
      <Grid container spacing={4} sx={{margin: '0px', padding: "0px 10px", width: '100%', maxWidth: '100%', justifyContent: 'space-evenly', height: '85vh' }}>
        <Grid item xs={2}>
          <CreateChat />
          <ChatUsers handleClick={handleClick} Data={Emails} selected={selected} />
          <Divider sx={{height: '1px',bgcolor: "black"}}></Divider>
          <CreateGroup />
          <Groups handleClick={handleClick} groupsData={groupsData} selected={selected} />
        </Grid>
        <Grid item xs={9}>
          {/* {selected? <Chats GroupId = {selected}/> : <Typography component={"h6"} sx={{display:'flex', alignItems: 'center', justifyContent: 'center'}}>No group selected</Typography>} */}
          {
            selected?
            <ChatBox chatData={chatData} currentUser={selected} /> : 'No chats selected'
          }
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
