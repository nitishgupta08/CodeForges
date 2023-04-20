import { useEffect, useReducer } from "react";
import { Box } from "@mui/material";
import CodeSettings from "./CodeSettings";
import Editor from "./Editor";
import useAuth from "../../hooks/useAuth";

const initialState = {
  fileData: "",
  fileName: "",
  language: "javascript",
  theme: "aura",
  cursorPosition: "1:1",
  fontSize: 15,
};

function reducer(state, action) {
  switch (action.type) {
    case "updateFileData":
      return { ...state, fileData: action.payload };
    case "updateFileName":
      return { ...state, fileName: action.payload };
    case "updateLanguage":
      return { ...state, language: action.payload };
    case "updateTheme":
      return { ...state, theme: action.payload };
    case "updateCursorPosition":
      return { ...state, cursorPosition: action.payload };
    case "updateFontSize":
      return { ...state, fontSize: action.payload };
    default:
      throw new Error();
  }
}

export default function CodeArea({
  currentData,
  spaceName,
  spaceDispatch,
  spaceData,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { auth } = useAuth();

  useEffect(() => {
    dispatch({ type: "updateTheme", payload: auth.user.theme });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentData) {
      dispatch({ type: "updateFileData", payload: currentData.fileData });
      dispatch({ type: "updateFileName", payload: currentData.fileName });
      dispatch({ type: "updateLanguage", payload: currentData.fileLang });
    }
  }, [currentData]);

  useEffect(() => {
    if (currentData) {
      const updatedArray = spaceData.map((obj) => {
        if (obj._id === currentData._id) {
          return { ...obj, fileData: state.fileData, fileName: state.fileName };
        }
        return obj;
      });

      spaceDispatch({
        type: "updateSpaceData",
        payload: updatedArray,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.fileData]);

  return (
    <Box
      sx={{
        position: "relative",
        height: "calc(100vh - 80px)",
        borderRadius: 2,
        backgroundColor: "grey.900",
      }}
    >
      <Editor
        value={state.fileData}
        editorDispatch={dispatch}
        language={state.language}
        theme={state.theme}
        fontSize={state.fontSize}
      />
      <CodeSettings
        fileName={state.fileName}
        language={state.language}
        cursorPosition={state.cursorPosition}
        dispatch={dispatch}
        theme={state.theme}
        fontSize={state.fontSize}
        spaceName={spaceName}
      />
    </Box>
  );
}
