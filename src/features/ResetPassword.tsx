import {
  Box,
  Typography,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FButton from "../components/FButton/FButton";
import { supabase } from '../../supaconfig'

const ResetPassword = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Check if we have the necessary tokens from the URL
  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
      setError(true);
      return;
    }

    // Set the session with the tokens from the URL
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }, [searchParams]);

  const handlePasswordReset = async () => {
    if (!password || !confirmPassword) {
      setValidationError(true);
      setError(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(true);
      setValidationError(false);
      return;
    }

    if (password.length < 6) {
      setError(true);
      setValidationError(false);
      return;
    }

    setLoading(true);
    setError(false);
    setValidationError(false);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(true);
        console.log(error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(true);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePasswordReset();
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
          {t('resetPassword.title')}
        </Typography>

        <Typography
          sx={{
            textAlign: "center",
            marginBottom: 3,
            fontSize: "14px",
            color: "#666",
          }}
        >
          {t('resetPassword.subtitle')}
        </Typography>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <TextField
            fullWidth
            type="password"
            variant="outlined"
            placeholder={t('resetPassword.newPassword')}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={validationError && !password}
            helperText={validationError && !password ? t('resetPassword.passwordRequired') : ""}
          />

          <TextField
            fullWidth
            type="password"
            variant="outlined"
            placeholder={t('resetPassword.confirmPassword')}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={validationError && !confirmPassword}
            helperText={validationError && !confirmPassword ? t('resetPassword.confirmPasswordRequired') : ""}
          />

          <FButton
            title={t('resetPassword.title')}
            fullWidth
            variant="contained"
            onClick={handlePasswordReset}
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

        {/* Error messages */}
        <Typography
          color="error"
          sx={{
            marginTop: 10,
            minHeight: "18px",
            visibility: error ? "visible" : "hidden",
            fontSize: "12px",
            color: "red",
            lineHeight: "normal",
            textAlign: "center",
          }}
        >
          {error ? t('resetPassword.error') : ""}
        </Typography>

        {/* Success message */}
        <Typography
          sx={{
            marginTop: 10,
            minHeight: "18px",
            visibility: success ? "visible" : "hidden",
            fontSize: "12px",
            color: "green",
            lineHeight: "normal",
            textAlign: "center",
          }}
        >
          {success ? t('resetPassword.success') : ""}
        </Typography>
      </Box>
    </Box>
  );
};

export default ResetPassword; 