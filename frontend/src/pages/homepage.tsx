import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


// import Chats from "../components/Chats";
import { useGetChatsMutation, useGetGroupsMutation } from "../services/api";
import { ChatMessage, Group } from "../types";
import Groups from "../components/Groups";
import CreateGroup from "../components/CreateGroup";
import CreateChat from "../components/CreatePersonalChats";
import ChatUsers from "../components/ChatUsers";

const Home = () => {
  const [selected, setSelected] = useState<string>(null); // Track the selected Typography
  const [getGroups, { isError: groupError }] = useGetGroupsMutation();
  const [getChats, { data, error, isLoading, isError }] = useGetChatsMutation();
  const [groupsData, setGroupsData] = useState<Group[]>([]);
  const [chatData, setChatData] = useState<ChatMessage[]>([]);
  const [Emails, setEmails] = useState<string[]>([]);
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await getGroups().unwrap();
        const res1 = await getChats().unwrap();
        if (!isError && !groupError) {
          setChatData(res1.data);
          setGroupsData(res.data);
          setEmails(
            [
              ...new Set(
                [...res1.data] // Make a shallow copy of the array before sorting
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((message) => message.toEmail)
              )
            ]
          );
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

    fetchGroups();
  }, []);
  const handleClick = (index: string) => {
    setSelected(index); // Set the selected index when a Typography is clicked
  };
  return (
    <>
      <Grid container spacing={3} sx={{ margin: "0px 5px" }}>
        <Grid item xs={2}>
          <CreateChat />
          <ChatUsers handleClick={handleClick} Data={Emails} selected={selected} />
          <CreateGroup />
          <Groups handleClick={handleClick} groupsData={groupsData} selected={selected} />
        </Grid>
        <Grid item xs={6}>
          {/* {selected? <Chats GroupId = {selected}/> : <Typography component={"h6"} sx={{display:'flex', alignItems: 'center', justifyContent: 'center'}}>No group selected</Typography>} */}
          chats
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
