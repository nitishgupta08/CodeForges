import React from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";

function SpaceHeader({ handleSave, save, savetime, spaceData }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        pl: 1,
        pr: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
        <Typography
          variant="h1"
          sx={{ color: "text.primary", fontSize: 35, fontWeight: 700 }}
        >
          CodeForges.
        </Typography>
        {save ? (
          <Box
            sx={{
              display: "flex",
              color: "text.primary",
              alignItems: "center",
              opacity: 0.7,
              ml: 3,
            }}
          >
            <Typography sx={{ mr: 1, fontSize: 15 }}>
              Autosave in progress
            </Typography>
            <CircularProgress size={15} color="inherit" />
          </Box>
        ) : (
          <Typography
            sx={{ fontSize: 15, color: "text.primary", opacity: 0.7, ml: 3 }}
          >
            Last saved on{" "}
            {savetime.toLocaleTimeString("en-US", {
              hour12: true,
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => handleSave(spaceData)} color="text.primary">
          <SaveIcon />
        </IconButton>
        <Button
          variant="contained"
          sx={{ ml: 1 }}
          onClick={() => {
            navigate("/dashboard");
          }}
        >
          Leave Project
        </Button>
      </Box>
    </Box>
  );
}

export default SpaceHeader;
