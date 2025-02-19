import { Box, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "", // Full-screen height
      }}
    >
      <CircularProgress size={30} />
    </Box>
  );
};

export default Loader;
