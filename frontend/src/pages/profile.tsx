import { Box, CircularProgress, Typography } from "@mui/material";
import UserProfile from "../components/UserProfile";
import { useMeMutation } from "../services/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Profile = () => {
  const [getUser,{isLoading, isError}]  = useMeMutation();
  const [user, setUser] = useState({});
  useEffect(()=>{
    const fetchUser = async () => {
      const res = await getUser().unwrap();
      if(!isError){
        setUser(res.data);
      }else{
        toast.error('Unable to fetch user data');
      }
    }
    fetchUser();
  },[])


  if (isLoading) {
    return (
      <Box
        width="100vw"
        padding={5}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        width="100vw"
        padding={5}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography textAlign="center">Profile not found!</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <UserProfile data={user} />
    </Box>
  );
};

export default Profile;
