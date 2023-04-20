import React, { useReducer } from "react";
import {
  Box,
  Typography,
  Button,
  Backdrop,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ListSpaces from "./ListSpaces";
import CreateSpace from "./CreateSpace";
import SearchIcon from "@mui/icons-material/Search";

const initialState = {
  spaceId: "",
  spaceName: "",
  showCreateSpaceBackdrop: false,
  showJoinSpaceBackdrop: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "updateSpaceId":
      return { ...state, spaceId: action.payload };
    case "updateSpaceName":
      return { ...state, spaceName: action.payload };
    case "handleCreateBackdrop":
      return { ...state, showCreateSpaceBackdrop: action.payload };
    case "handleJoinBackdrop":
      return { ...state, showJoinSpaceBackdrop: action.payload };
    default:
      throw new Error();
  }
}

function UserSpaces({
  setMessage,
  setSuccess,
  setError,
  loggedInUser,
  listSpaces,
  originalSpace,
  dashboardDispatch,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  function searchQuery(searchTerm) {
    if (searchTerm !== "") {
      const filteredSpaces = originalSpace.filter((space) => {
        return (
          space.spaceId.includes(searchTerm) ||
          space.spaceName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      dashboardDispatch({ type: "updateListSpaces", payload: filteredSpaces });
    } else {
      dashboardDispatch({ type: "updateListSpaces", payload: originalSpace });
    }
  }

  return (
    <>
      <Backdrop
        sx={{
          zIndex: 2,
          backdropFilter: "blur(5px)",
        }}
        open={state.showCreateSpaceBackdrop}
      >
        <CreateSpace
          spaceId={state.spaceId}
          spaceName={state.spaceName}
          setError={setError}
          setMessage={setMessage}
          loggedInUser={loggedInUser}
          dispatch={dispatch}
          dashboardDispatch={dashboardDispatch}
          showCreateSpaceBackdrop={state.showCreateSpaceBackdrop}
        />
      </Backdrop>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ minWidth: "60vw", minHeight: "70vh", mb: 10 }}>
          <Box
            sx={{
              p: 2,
              pt: 5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: 35,
                  fontWeight: 700,
                  pr: 5,
                  color: "text.primary",
                }}
              >
                Your Projects.
              </Typography>

              <OutlinedInput
                disabled={!listSpaces}
                size="small"
                sx={{ minWidth: "30%" }}
                onChange={(e) => searchQuery(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() =>
                  dispatch({ type: "handleCreateBackdrop", payload: true })
                }
              >
                Create a new project
              </Button>
            </Box>
          </Box>

          <ListSpaces
            setMessage={setMessage}
            setSuccess={setSuccess}
            setError={setError}
            loggedInUser={loggedInUser}
            listSpaces={listSpaces}
            dashboardDispatch={dashboardDispatch}
          />
        </Box>
      </Box>
    </>
  );
}

export default UserSpaces;
