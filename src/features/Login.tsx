import {
  Box,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FButton from "../components/FButton/FButton";
import { supabase } from '../../supaconfig'

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryError, setRecoveryError] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setValidationError(true);
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);
    setValidationError(false);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(true)
        console.log(error)
      } else {
        console.log(data)
        navigate('/')
      }
    } catch (err) {
      setError(true)
      console.log(err)
    } finally {
      setLoading(false)
    }
  };

  const handlePasswordReset = async () => {
    if (!recoveryEmail) {
      setRecoveryError(true);
      return;
    }

    setRecoveryLoading(true);
    setRecoveryError(false);
    setRecoverySuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(recoveryEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setRecoveryError(true);
        console.log(error);
      } else {
        setRecoverySuccess(true);
        setRecoveryEmail("");
      }
    } catch (err) {
      setRecoveryError(true);
      console.log(err);
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecoveryMode) {
      handlePasswordReset();
    } else {
      handleLogin();
    }
  };

  const toggleRecoveryMode = () => {
    setIsRecoveryMode(!isRecoveryMode);
    setError(false);
    setValidationError(false);
    setRecoveryError(false);
    setRecoverySuccess(false);
    setEmail("");
    setPassword("");
    setRecoveryEmail("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
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
          {isRecoveryMode ? t('login.recoverPassword') : t('login.enter')}
        </Typography>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {isRecoveryMode ? (
            <TextField
              fullWidth
              type="email"
              variant="outlined"
              placeholder={t('login.email')}
              required
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              error={recoveryError && !recoveryEmail}
              helperText={recoveryError && !recoveryEmail ? t('login.emailRequired') : ""}
            />
          ) : (
            <>
              <TextField
                fullWidth
                type="email"
                variant="outlined"
                placeholder={t('login.email')}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={validationError && !email}
                helperText={validationError && !email ? t('login.emailRequired') : ""}
              />

              <TextField
                fullWidth
                type="password"
                variant="outlined"
                placeholder={t('login.password')}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={validationError && !password}
                helperText={validationError && !password ? t('login.passwordRequired') : ""}
              />
            </>
          )}

          <FButton
            title={isRecoveryMode ? t('login.sendRecoveryEmail') : t('login.enter')}
            fullWidth
            variant="contained"
            onClick={isRecoveryMode ? handlePasswordReset : handleLogin}
            loading={isRecoveryMode ? recoveryLoading : loading}
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

        {/* Error messages */}
        <Typography
          color="error"
          sx={{
            marginTop: 10,
            minHeight: "18px",
            visibility: (error || recoveryError) ? "visible" : "hidden",
            fontSize: "12px",
            color: "red",
            lineHeight: "normal",
            textAlign: "center",
          }}
        >
          {error ? t('login.authError') : ""}
          {recoveryError ? t('login.recoveryError') : ""}
        </Typography>

        {/* Success message for recovery */}
        <Typography
          sx={{
            marginTop: 10,
            minHeight: "18px",
            visibility: recoverySuccess ? "visible" : "hidden",
            fontSize: "12px",
            color: "green",
            lineHeight: "normal",
            textAlign: "center",
          }}
        >
          {recoverySuccess ? t('login.recoverySuccess') : ""}
        </Typography>

        <Box sx={{ textAlign: "center" }}>
          <Typography color="textSecondary">
            <Link
              onClick={toggleRecoveryMode}
              sx={{
                color: "#105498",
                textDecoration: "none",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              {isRecoveryMode ? t('login.backToLogin') : t('login.forgotPassword')}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
