import { Box, CircularProgress } from "@mui/material";

export const CircularLoadingIndicator = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <CircularProgress />
  </Box>
);
