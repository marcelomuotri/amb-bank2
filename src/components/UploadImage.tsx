import React, { useCallback, useEffect, useState, useMemo } from "react";
import { makeStyles } from "tss-react/mui";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { Box, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";

// Constants
const IMAGE_PREVIEW_DIMENSIONS = {
  width: 178,
  height: 105,
} as const;

const DROPZONE_PADDING = 40;
const MOBILE_BREAKPOINT = 300;

// Types
interface UploadImageProps {
  setImage: (file: File) => void;
  image?: string | File;
}

interface ImagePreviewState {
  url: string | null;
  isFile: boolean;
}

const useStyles = makeStyles()((theme) => ({
  columnContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  dropzoneContainer: {
    border: "2px dashed #DEE0E3",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.shape.borderRadius,
    cursor: "pointer",
    gap: 10,
    padding: `${DROPZONE_PADDING}px`,
    [theme.breakpoints.down("sm")]: {
      width: MOBILE_BREAKPOINT,
    },
  },
  imagePreview: {
    width: IMAGE_PREVIEW_DIMENSIONS.width,
    height: IMAGE_PREVIEW_DIMENSIONS.height,
    backgroundColor: theme.palette.grey[300],
    display: "flex",
    justifyContent: "center",
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(2),
  },
  image: {
    maxWidth: IMAGE_PREVIEW_DIMENSIONS.width,
    height: IMAGE_PREVIEW_DIMENSIONS.height,
    borderRadius: theme.shape.borderRadius,
  },
  titleContainer: {
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
    gap: 5,
  },
  titleText: {
    fontWeight: 600,
    color: theme.palette.common.black,
    fontSize: 18,
  },
}));

const UploadImage: React.FC<UploadImageProps> = ({
  setImage,
  image,
}) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const [previewState, setPreviewState] = useState<ImagePreviewState>({
    url: null,
    isFile: false,
  });

  // Memoized function to create unique file name
  const createUniqueFileName = useCallback((originalName: string): string => {
    return `${uuidv4()}-${originalName}`;
  }, []);

  // Memoized function to create unique file
  const createUniqueFile = useCallback((file: File): File => {
    const uniqueFileName = createUniqueFileName(file.name);
    return new File([file], uniqueFileName, { type: file.type });
  }, [createUniqueFileName]);

  // Handle image preview updates
  useEffect(() => {
    let objectUrl: string | null = null;

    try {
      if (image instanceof File) {
        objectUrl = URL.createObjectURL(image);
        setPreviewState({ url: objectUrl, isFile: true });
      } else if (typeof image === "string" && image.trim()) {
        setPreviewState({ url: image, isFile: false });
      } else {
        setPreviewState({ url: null, isFile: false });
      }
    } catch (error) {
      console.error("Error processing image:", error);
      setPreviewState({ url: null, isFile: false });
    }

    // Cleanup function for object URLs
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [image]);

  // Handle file drop
  const onDrop = useCallback<NonNullable<DropzoneOptions["onDrop"]>>(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      try {
        const file = acceptedFiles[0];
        const uniqueFile = createUniqueFile(file);
        setImage(uniqueFile);
        
        // Generate preview URL immediately
        const previewUrl = URL.createObjectURL(uniqueFile);
        setPreviewState({ url: previewUrl, isFile: true });
      } catch (error) {
        console.error("Error processing dropped file:", error);
      }
    },
    [setImage, createUniqueFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Memoized dropzone styles
  const dropzoneStyles = useMemo(() => ({
    border: isDragActive ? "1px dashed rgba(0, 122, 255, 0.86)" : undefined,
  }), [isDragActive]);

  // Memoized container styles
  const containerStyles = useMemo(() => ({
    marginTop: 16,
    width: "100%",
  }), []);

  const renderDropzoneContent = () => {
    const title = t("uploadImage.dragAndDrop");
    const subtitle = t("uploadImage.dragAndDropSubtitle");

    return (
      <Box className={classes.columnContainer}>
        <Box
          className={classes.dropzoneContainer}
          sx={dropzoneStyles}
        >
          <Typography className={classes.titleText}>
            {title}
          </Typography>
          <Typography>{subtitle}</Typography>
        </Box>
      </Box>
    );
  };

  const renderImagePreview = () => {
    if (!previewState.url) return null;

    return (
      <Box className={classes.imagePreview}>
        <img 
          src={previewState.url} 
          alt="preview" 
          className={classes.image}
          onError={() => {
            console.error("Failed to load image preview");
            setPreviewState({ url: null, isFile: false });
          }}
        />
      </Box>
    );
  };

  return (
    <div
      style={containerStyles}
      {...getRootProps()}
      role="button"
      aria-label="Upload Image Dropzone"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        renderDropzoneContent()
      ) : previewState.url ? (
        renderImagePreview()
      ) : (
        renderDropzoneContent()
      )}
    </div>
  );
};

export default UploadImage;
