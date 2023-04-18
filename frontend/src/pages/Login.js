import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  TextField,
  Alert,
  AlertTitle,
  Snackbar,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import Footer from "../components/Footer";
import axiosConfig from "../utils/axiosConfig";
import useAuth from "../hooks/useAuth";
import isEmail from "validator/lib/isEmail";
import LoadingButton from "@mui/lab/LoadingButton";

const LOGIN_URL = "/users/login";
function Login() {
  const { setAuth } = useAuth();
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState(false);
  const [message, setMessage] = useState({ title: "", data: "" });
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isEmail(user.email) && user.password) {
      return setDisabled(false);
    }
    setDisabled(true);
  }, [user]);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosConfig.post(LOGIN_URL, user);
      if (res.status === 200) {
        setAuth(res.data);
        navigate("/dashboard", {
          replace: true,
        });
      }
    } catch (err) {
      if (err?.response?.status === 400) {
        setMessage({ title: "Error!", data: err.response.data.error });
      } else {
        setMessage({ title: "Error!", data: "No server response" });
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = async (e) => {
    if (e.code === "Enter") {
      await login(e);
    }
  };

  return (
    <>
      <Snackbar
        open={error}
        onClose={() => setError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
      >
        <Alert variant="filled" severity="error" sx={{ width: "100%" }}>
          <AlertTitle>{message.title}</AlertTitle>
          {message.data}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          backgroundColor: "background.default",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            minWidth: "30vw",
            backgroundColor: "grey.900",
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            p: 3,
            boxShadow: "0px 0px 5px 5px #42a5f5",
          }}
        >
          <Typography
            variant="h1"
            sx={{ fontSize: 50, fontWeight: 700, mb: 3, color: "text.primary" }}
          >
            CodeForges.
          </Typography>

          <TextField
            autoFocus
            error={user.email === "" ? false : !isEmail(user.email)}
            name="email"
            placeholder="skywalker@deathstar.com"
            sx={{ width: "100%", mb: 1 }}
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            onKeyUp={!disabled ? handleKey : null}
          />

          <TextField
            type="password"
            name="password"
            placeholder="******"
            sx={{ width: "100%" }}
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            onKeyUp={!disabled ? handleKey : null}
          />
          <Box
            sx={{
              mt: 2,
              mb: 5,
            }}
          >
            <LoadingButton
              loading={loading}
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={login}
              sx={{
                height: "45px",
              }}
              disabled={disabled}
            >
              Login
            </LoadingButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: 20,
                fontWeight: 700,
                mr: 2,
                color: "text.primary",
              }}
            >
              New?
            </Typography>
            <Box>
              <Button
                variant="text"
                sx={{ height: "45px", textDecoration: "underline" }}
                // startIcon={<PersonAddIcon />}
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
}

export default Login;
