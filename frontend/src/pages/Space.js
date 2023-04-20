import React, { useEffect, useReducer, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAxios } from "../hooks/useAxios";
import {
  Box,
  Backdrop,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  AlertTitle,
} from "@mui/material";
import SpaceHeader from "../components/space/SpaceHeader";
import CodeArea from "../components/space/CodeArea";
import useAuth from "../hooks/useAuth";
import axiosConfig from "../utils/axiosConfig";

const initialState = {
  spaceData: [],
  currentData: null,
  loadingScreen: true,
  spaceName: "",
  editorTheme: "",
  successSnackbar: false,
  failSnackbar: false,
  message: { title: "", data: "" },
};

function reducer(state, action) {
  switch (action.type) {
    case "updateSpaceData":
      return { ...state, spaceData: action.payload };
    case "updateCurrentData":
      return { ...state, currentData: action.payload };
    case "removeLoadingScreen":
      return { ...state, loadingScreen: false };
    case "updateSpaceName":
      return { ...state, spaceName: action.payload };
    case "updateEditorTheme":
      return { ...state, editorTheme: action.payload };
    case "updateSuccess":
      return { ...state, successSnackbar: action.payload };
    case "updateFail":
      return { ...state, failSnackbar: action.payload };
    case "updateMessage":
      return { ...state, message: action.payload };
    default:
      throw new Error();
  }
}

function Space() {
  const { auth } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loadError, setLoadError] = useState(false);
  const location = useLocation();
  const [save, setSave] = useState(false);
  const [savetime, setSavetime] = useState(new Date());

  const { response, error } = useAxios({
    method: "GET",
    url: `/spaces/${location.pathname.split("/")[2]}`,
    headers: { Authorization: `Bearer ${auth.token}` },
  });

  useEffect(() => {
    if (error !== undefined) {
      dispatch({
        type: "updateMessage",
        payload: {
          title: "Cannot connect to server at the moment!",
          data: "Try again later",
        },
      });
      setLoadError(true);
      return;
    }

    if (response === undefined) return;

    dispatch({ type: "updateSpaceName", payload: response.data.spaceName });
    dispatch({ type: "updateSpaceData", payload: response.data.spaceData });
    dispatch({
      type: "updateCurrentData",
      payload: response.data.spaceData[0],
    });
    dispatch({ type: "removeLoadingScreen", payload: false });
  }, [response, error]);

  async function handleSave(spaceData) {
    setSave(true);
    console.log(spaceData);
    try {
      if (state.spaceData.length > 0) {
        await axiosConfig.put(
          `/spaces/${location.pathname.split("/")[2]}`,
          { spaceData: spaceData },
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );
        setSavetime(new Date());
        setSave(false);
      }
    } catch (e) {
      setLoadError(true);
      dispatch({
        type: "updateMessage",
        payload: {
          title: "Cannot save project data at the moment!",
          data: "Try again later!",
        },
      });
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleSave(state.spaceData);
    }, 60000);

    return () => clearInterval(intervalId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.spaceData]);

  return (
    <>
      <Backdrop
        sx={{
          backgroundColor: "background.default",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
        }}
        open={state.loadingScreen}
      >
        <CircularProgress size={100} />
        <Typography
          variant="h1"
          sx={{ color: "text.primary", fontSize: 35, fontWeight: 700, mt: 5 }}
        >
          Loading Project...
        </Typography>
      </Backdrop>

      <Snackbar
        open={loadError}
        onClose={() => setLoadError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
      >
        <Alert variant="filled" severity="error" sx={{ width: "100%" }}>
          <AlertTitle>{state.message.title}</AlertTitle>
          {state.message.data}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          backgroundColor: "background.default",
        }}
      >
        <Box sx={{ flex: "0 0 auto", p: 1 }}>
          <SpaceHeader
            handleSave={handleSave}
            save={save}
            savetime={savetime}
            spaceData={state.spaceData}
          />
        </Box>
        <Box sx={{ flex: "1 1 auto", p: 1 }}>
          <CodeArea
            currentData={state.currentData}
            spaceName={state.spaceName}
            spaceDispatch={dispatch}
            spaceData={state.spaceData}
          />
        </Box>
      </Box>
    </>
  );
}

export default Space;
