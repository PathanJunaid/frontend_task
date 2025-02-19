import { Typography } from "@mui/material"
import React, { ReactNode } from "react";

import { Group } from "../types";

interface ItemProps {
    children: ReactNode,
}
const Item: React.FC<ItemProps> = ({ children }) => {
    return <div>{children}</div>;
};
// Define the prop types for the Groups component
interface GroupsProps {
    handleClick: (index: string) => void; // Type for the handleClick function
    groupsData: Group[]; // Type for the groupsData, which is an array of Group objects
    selected: {id: string, isGroup: Boolean}
}

const Groups: React.FC<GroupsProps> = ({ handleClick, groupsData, selected }) => {
    return (
        <Item>
            {groupsData.map((group) => (
                <Typography
                    key={group.id}
                    variant="h6"
                    onClick={() => handleClick(group.id)}
                    style={{
                        cursor: 'pointer',
                        color: selected.id === group.id ? '#007bff' : '#000',
                        transition: 'color 0.3s, font-weight 0.3s, background-color 0.3s, border 0.3s',
                        border: selected.id === group.id ? '2px solid #007bff' : '2px solid transparent',
                        backgroundColor: selected.id === group.id ? '#e6f2ff' : 'transparent',
                        padding: '4px 8px', // Reduced padding
                        borderRadius: '5px',
                        display: 'block',  // Ensure each Typography is on a new line
                        marginBottom: '6px', // Reduced margin
                        whiteSpace: 'nowrap',  // Prevents text from wrapping
                        overflow: 'hidden',    // Hides overflow content
                        textOverflow: 'ellipsis',
                        fontSize: '1rem',  // Reduced font size (smaller than the default)
                    }}
                >
                    {group.name}
                </Typography>


            ))}
        </Item>
    )
}

export default Groups
