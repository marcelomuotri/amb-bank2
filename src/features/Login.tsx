import {
  Box,
  Link,
  shouldSkipGeneratingVar,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FButton from "../components/FButton/FButton";
import { theme } from "../framework/theme/theme";
//import { supabase } from '../../supaconfig'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    console.log(email, password);

    // try {
    //   const { data, error } = await supabase.auth.signInWithPassword({
    //     email,
    //     password,
    //   })

    //   if (error) {
    //     setError(error.message)
    //   } else {
    //     navigate('/dashboard')
    //   }
    // } catch (err) {
    //   setError('An unexpected error occurred')
    // } finally {
    //   setLoading(false)
    // }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: 40,
          borderRadius: 1,
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          component="h1"
          sx={{
            textAlign: "center",
            marginBottom: 3,
            fontWeight: 600,
            color: "#333",
          }}
        >
          Ingresar
        </Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Handle login logic here
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <TextField
            fullWidth
            type="email"
            variant="outlined"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            type="password"
            variant="outlined"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <FButton
            title="Ingresar"
            fullWidth
            variant="contained"
            onClick={() => handleLogin()}
            loading={loading}
            sx={{
              padding: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          />
        </form>
        <Typography
          color="error"
          sx={{
            marginTop: 10,
            minHeight: "18px",
            visibility: error ? "visible" : "hidden",
            fontSize: "12px",
            color: "red",
            lineHeight: "normal",
          }}
        >
          {error ? "Error de autenticación" : ""}
        </Typography>
        <Box sx={{ textAlign: "center" }}>
          <Typography color="textSecondary">
            <Link
              href="/register"
              sx={{
                color: "#105498",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
