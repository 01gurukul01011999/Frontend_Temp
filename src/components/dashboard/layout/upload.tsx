"use client";

import React, { useRef, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import { authClient } from '@/lib/auth/client';
import { User } from '@/types/user';
import { toast } from 'react-toastify';

interface AvatarUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

export default function AvatarUploadModal({
  open,
  onClose,
}: AvatarUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // const handleUpload = () => {
  //   if (selectedFile) {
  //     onUpload(selectedFile);
  //     setSelectedFile(null);
  //     onClose();
  //   }
  // };

     const [userd, setUser] = React.useState <User | null>(null);
    const clinet = userd || { avatar: '' , id: ''};
    //console.log('clinet', clinet);
    React.useEffect(() => {
      authClient.getUser().then((result) => {
        setUser(result.data ?? null);
        //console.log('user', result.data?.name);
      });
    }, []);

 
    const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("avatar", selectedFile);
    formData.append("userId", clinet.id);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-avatar`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(data.message || "Avatar uploaded!");
      // Optionally refresh after a short delay
      setTimeout(() => globalThis.location.reload(), 1200);
    } else {
      toast.error(data.message || "Upload failed");
    }
  };



  return (
    <Modal open={open} onClose={onClose}>
         <form onSubmit={handleUpload}>
      <Box
        sx={{
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          width: 350,
          mx: "auto",
          mt: "15%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative", // Add this for absolute positioning
        }}
      >
        {/* Close (X) icon */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" mb={2}>
          Upload Avatar
        </Typography>
      <input type="hidden" id="cid" name="id" value={clinet.id} />
        <input
            ref={inputRef}
            id="fileInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
          // Ensure the input value is controlled
        />
        <Button
          variant="outlined"
          onClick={() => inputRef.current?.click()}
          sx={{ mb: 2 }}
        >
          Choose File
        </Button>
        {selectedFile && (
          <Typography variant="body2" mb={2}>
            {selectedFile.name}
          </Typography>
        )}
        <Button
          variant="contained"
          type="submit"
          disabled={!selectedFile}
        >
          Upload
        </Button>
      </Box>
      </form>
    </Modal>
  );
}
