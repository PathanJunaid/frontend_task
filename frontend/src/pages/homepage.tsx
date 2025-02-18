import { Grid, Typography } from "@mui/material";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";


// import Chats from "../components/Chats";
import { useGetGroupsMutation } from "../services/api";
import { Group } from "../types";
import Sidebar from "../components/Sidebar";

interface ItemProps {
  children: ReactNode,
}
const Item: React.FC<ItemProps> = ({ children }) => {
  return <div>{children}</div>;
};


const Home = () => {
  const [selected, setSelected] = useState<number | null>(null); // Track the selected Typography
  const [getGroups] = useGetGroupsMutation();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await getGroups().unwrap();
        console.log(res?.data)
        if (Array.isArray(res)) {
          setGroups(res); // If response is an array, directly set it
        } else if (res?.data && Array.isArray(res.data)) {
          setGroups(res.data); // Handle case where data is nested inside res.data
        } else {
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
  const handleClick = (index: number) => {
    setSelected(index); // Set the selected index when a Typography is clicked
  };
  return (
    <>
      <Grid container spacing={3} sx={{ margin: "0px 5px" }}>
        <Grid item xs={2}>
          <Sidebar/>
          <Item>
            {groups.map((group, index) => (
              <Typography
                key={index}
                variant="h6"
                onClick={() => handleClick(index)}
                style={{
                  cursor: 'pointer',
                  color: selected === index ? '#007bff' : '#000',
                  transition: 'color 0.3s, font-weight 0.3s, background-color 0.3s, border 0.3s',
                  border: selected === index ? '2px solid #007bff' : '2px solid transparent',
                  backgroundColor: selected === index ? '#e6f2ff' : 'transparent',
                  padding: '8px 12px',
                  borderRadius: '5px',
                  display: 'block',  // Ensure each Typography is on a new line
                  marginBottom: '10px', // Add spacing between items
                  whiteSpace: 'nowrap',   // Prevents text from wrapping
                  overflow: 'hidden',     // Hides overflow content
                  textOverflow: 'ellipsis',
                }}
              >
                {group.name}
              </Typography>

            ))}
          </Item>
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
