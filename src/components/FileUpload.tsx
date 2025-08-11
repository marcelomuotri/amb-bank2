import React, { useCallback, useState } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// Types
interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect
}) => {
  const { t } = useTranslation();
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle file drop
  const onDrop = useCallback<NonNullable<DropzoneOptions["onDrop"]>>(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      try {
        // Limpiar error si hay archivos válidos
        setError(null);
        // No modificar el nombre del archivo aquí
        onFileSelect(acceptedFiles);
      } catch (error) {
        console.error("Error processing dropped files:", error);
        setError("Error procesando archivos");
      }
    },
    [onFileSelect]
  );

  // Handle rejected files
  const onDropRejected = useCallback(() => {
    setError("Formato de archivo no permitido. Solo se aceptan: PDF, Excel, CSV, ASPX e imágenes.");
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop,
    onDropRejected,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'text/plain': ['.aspx'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: true
  });

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed",
          borderColor: error ? "error.main" : "primary.main",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 1,
          cursor: "pointer",
          gap: 1.25,
          padding: 5,
          minHeight: "200px", // Altura aumentada
          backgroundColor: error ? "error.50" : "primary.50",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: error ? "error.100" : "primary.100",
            borderColor: error ? "error.dark" : "primary.dark",
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
          ...(isDragActive && {
            borderColor: error ? "error.dark" : "primary.dark",
            backgroundColor: error ? "error.100" : "primary.100",
            transform: "scale(1.02)",
          }),
        }}
        onDragEnter={() => setIsDragActive(true)}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={() => setIsDragActive(false)}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 48, color: error ? "error.main" : "primary.main" }} />
        <Typography sx={{ fontWeight: 600, fontSize: 18, textAlign: "center" }}>
          {t("fileUpload.dragAndDrop")}
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 14, textAlign: "center" }}>
          {t("fileUpload.dragAndDropSubtitle")}
        </Typography>
        <Typography sx={{ fontSize: 12, color: "text.disabled", textAlign: "center" }}>
          {t("fileUpload.supportedFormats")}
        </Typography>
      </Box>
      
      {/* Mensaje de error */}
      {error && (
        <Typography 
          sx={{ 
            color: "error.main", 
            fontSize: 14, 
            mt: 2, 
            textAlign: "center",
            fontWeight: 500
          }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload; 