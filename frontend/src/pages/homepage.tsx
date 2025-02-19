import { Divider, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


// import Chats from "../components/Chats";
import { useGetallUsersMutation, useGetChatsMutation, useGetGroupsMutation, useMeMutation } from "../services/api";
import { ChatMessage, Group, User } from "../types";
import Groups from "../components/Groups";
import CreateGroup from "../components/CreateGroup";
import CreateChat from "../components/CreatePersonalChats";
import ChatUsers from "../components/ChatUsers";
import ChatBox from "../components/ChatBox";
import Loader from "../components/Loader";
import GroupChatBox from "../components/GroupChatBox";

const Home = () => {
  const [selected, setSelected] = useState<{ id: string, isGroup: Boolean, name?: string }>({
    id: "",
    isGroup: false,
  }); // Track the selected Typography
  const [getGroups, { isError: groupError }] = useGetGroupsMutation();
  const [getChats, { isError }] = useGetChatsMutation();
  const [getUser, { isLoading }] = useMeMutation();
  const [getallUsers] = useGetallUsersMutation();
  const [groupsData, setGroupsData] = useState<Group[]>([]);
  const [chatData, setChatData] = useState<ChatMessage[]>([]);
  const [Emails, setEmails] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null)
  const [allUsers, setallUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchGroupsandchats = async () => {
      try {
        const res = await getGroups().unwrap();
        const res1 = await getChats().unwrap();
        const userResponse = await getUser().unwrap();
        const allUserResponse = await getallUsers().unwrap();

        setallUsers(allUserResponse.data);
        if (!isError && !groupError) {
          setChatData(res1.data);
          setGroupsData(res.data);
          setUser(userResponse.data);
        }
        else {
          console.error("Unexpected response format:", res);
          toast.error("Unexpected response format from server!");
        }
        if (!isError && !isLoading) {

          setEmails([
            ...new Set(
              res1.data
                .slice() // Creates a shallow copy to avoid modifying the original array
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .flatMap((message) => [message.fromEmail, message.toEmail]) // Get both sender and receiver emails
                .filter((email) => email && email !== userResponse?.data.email) // Exclude admin email & remove null/undefined
            )
          ]);
        } else {
          console.log('user no')
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
    if (index.includes("@")) {
      setSelected({
        id: index,
        isGroup: false
      })
    } else {
      const data = groupsData.find((group) => {
        return group.id === index
      })
      setSelected({
        id: index,
        name: data.name,
        isGroup: true
      })
    }
  };
  return (
    <>
      <Grid container spacing={4} sx={{ margin: '0px', padding: "0px 10px", width: '100%', maxWidth: '100%', justifyContent: 'space-evenly', height: '85vh' }}>
        <Grid item xs={2}>
          {isLoading ? <Loader /> :
            <>
              <CreateChat />
              <ChatUsers handleClick={handleClick} Data={Emails} selected={selected} />
            </>

          }
          <Divider sx={{ height: '1px', bgcolor: "black" }}></Divider>
          <CreateGroup />
          <Groups handleClick={handleClick} groupsData={groupsData} selected={selected} />
        </Grid>
        <Grid item xs={9}>
          {selected.id === "" ? (
            "No Group or User Selected"
          ) : !selected.isGroup ? (
            <ChatBox chatData={chatData} currentUser={selected} setChatData={setChatData} />
          ) : (
            <GroupChatBox currentGroup={selected} currentUser={{ email: user.email, id: user.id }} allUsers={allUsers} />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
