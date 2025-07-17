import React, { useCallback, useState } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { Box, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
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

  // Create unique file name
  const createUniqueFile = useCallback((file: File): File => {
    const uniqueFileName = `${uuidv4()}-${file.name}`;
    return new File([file], uniqueFileName, { type: file.type });
  }, []);

  // Handle file drop
  const onDrop = useCallback<NonNullable<DropzoneOptions["onDrop"]>>(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      try {
        const uniqueFiles = acceptedFiles.map(file => createUniqueFile(file));
        onFileSelect(uniqueFiles);
      } catch (error) {
        console.error("Error processing dropped files:", error);
      }
    },
    [onFileSelect, createUniqueFile]
  );

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
    },
    multiple: true
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed",
        borderColor: "primary.main",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 1,
        cursor: "pointer",
        gap: 1.25,
        padding: 5,
        minHeight: "200px", // Altura aumentada
        backgroundColor: "primary.50",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "primary.100",
          borderColor: "primary.dark",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
        ...(isDragActive && {
          borderColor: "primary.dark",
          backgroundColor: "primary.100",
          transform: "scale(1.02)",
        }),
      }}
      onDragEnter={() => setIsDragActive(true)}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={() => setIsDragActive(false)}
    >
      <input {...getInputProps()} />
      <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main" }} />
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
  );
};

export default FileUpload; 