import { Box, Button } from "@mui/material"
import { useState } from "react"
import GroupFormModal from "./GroupFormModel";

const CreateGroup = () => {
  const [groupModel,setgroupModel] = useState(false);
  const onClose = ()=>{
    setgroupModel(!groupModel);
  }
  return (
    <Box>
      <GroupFormModal open= {groupModel} onClose={onClose} />
      <Button onClick={()=>onClose()}>
        Create Group
      </Button>
    </Box>
  )
}

export default CreateGroup;
