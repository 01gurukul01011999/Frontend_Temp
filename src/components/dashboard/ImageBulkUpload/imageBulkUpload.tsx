'use client';
import React from "react";
import { useUser } from '@/hooks/use-user';
import { Box, Typography, Button, IconButton, Avatar, Stack , 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper, } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const forbiddenImages = [
  { label: "Watermark image", img: "https://static.meeshosupply.com/supplier-new/invalid-image-1.png" },
  { label: "Fake branded/1st copy", img: "https://static.meeshosupply.com/supplier-new/invalid-image-2.png" },
  { label: "Image with price", img: "https://static.meeshosupply.com/supplier-new/invalid-image-3.png" },
  { label: "Pixelated image", img: "https://static.meeshosupply.com/supplier-new/invalid-image-4.png" },
  { label: "Inverted image", img: "https://static.meeshosupply.com/supplier-new/invalid-image-5.png" },
  { label: "Blur/unclear image", img: "https://static.meeshosupply.com/supplier-new/invalid-image-6.png" },
  { label: "Incomplete image", img: "https://static.meeshosupply.com/supplier-new/invalid-image-7.png" },
];

export default function ImageBulkUpload(): React.JSX.Element {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [uploaded, setUploaded] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<any[]>([]);
  const { user } = useUser();
  //console.log(selectedFiles);

  // Remove image by index
  const handleRemoveImage = (idx: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
    if (uploadedFiles.length > 0) {
      setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
    }
  };

  // Handle file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUploadImages = async () => {
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('images', file));
    // Add uploaderId from user context
    if (user && user.id) {
      formData.append('uploaderId', user.id);
    }
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/bulkImgupload`, {
      method: 'POST',
      body: formData,
      
    });
    console.log('formData', formData);
    // Handle response (e.g., show links, success message)
    const data = await res.json();
    console.log('data', data);
    setUploaded(true);
    if (data.success && Array.isArray(data.files)) {
      setUploadedFiles(data.files);
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#fff', flexDirection: 'row', gap: 2, mt: 1, mr: -3, ml: -3 }}>
      {/* Column 1: Left */}
      <Box p={3} sx={{ width: '80%', flexBasis: '80%' }}>
        <Box
          bgcolor="#f0f4ff"
          p={2}
          borderRadius={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box>
            <Typography fontWeight="bold">
              Introducing pre-filled templates for faster bulk uploads
            </Typography>
            <Typography variant="body2">
              Add product front images and get prefilled catalog template
            </Typography>
          </Box>
          <Button variant="outlined" color="primary">
            Get Started
          </Button>
        </Box>
        <Button
          variant="text"
          component="label"
          color="primary"
          sx={{ width: '100%' }}
        >
          <Box
            border="1px dashed #a08af7"
            bgcolor="#f6f8fd"
            height={200}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            borderRadius={2}
            my={0}
            width='100%'
          >
            <CloudUploadIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography fontWeight="bold" mt={1}>Add Images</Typography>
            <Typography variant="caption">You can drop images here</Typography>
            <input
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Box>
        </Button>
        {/* Show selected images preview */}
        {selectedFiles.length > 0 && (
          <Box mt={2}>
            <Typography fontWeight="medium" mb={1}>Selected Images:</Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 2,
                p: 1,
                bgcolor: '#fafafa',
                borderRadius: 2,
              }}
            >
              {selectedFiles.map((file, idx) => {
                console.log(uploadedFiles);
                const isUploaded = uploadedFiles.some(
                  (img) => img.original_name === file.name || img.name === file.name
                );
                return (
                  <Box key={idx} sx={{ position: 'relative', display: 'inline-block'}}>
                    <Avatar
                      src={URL.createObjectURL(file)}
                      variant="rounded"
                      sx={{ width: 90, height: 90, border: '1px solid #A6A6A6', borderRadius: 0.5 }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -12,
                        right: -12,
                        background: '#fff',
                        boxShadow: 1,
                        zIndex: 2,
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        border: '1px solid #eee',
                        transition: 'background 0.2s',
                        '&:hover': {
                          background: '#ffeaea',
                        },
                      }}
                      onClick={() => handleRemoveImage(idx)}
                    >
                      <CloseIcon sx={{ fontSize: 20, color: '#d32f2f' }} />
                    </IconButton>
                    {isUploaded && (
                      <CheckCircleIcon
                        sx={{
                          position: 'absolute',
                          right: 4,
                          bottom: 4,
                          color: '#4caf50',
                          fontSize: 28,
                          zIndex: 1,
                          background: '#fff',
                          borderRadius: '50%',
                          boxShadow: 1,
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUploadImages}
                disabled={selectedFiles.length === 0}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Get Links
              </Button>
            </Box>
            {uploadedFiles && (
              <Box mt={5}>
        <Typography variant="h6" mb={2}>Image Links</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Image</strong></TableCell>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Link</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {uploadedFiles.map((img, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Avatar variant="rounded" src={'/uploads/'+img.img_name } />
                  </TableCell>
                  <TableCell>{img.img_name || img.name || `Image ${idx + 1}`}</TableCell>
                  <TableCell>
                    {'https://techpotli.com/uploads/'+img.img_name}
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" color="primary" sx={{ mr: 1 }}
                      onClick={() => navigator.clipboard.writeText('https://techpotli.com/uploads/'+img.img_name)}>
                      Copy Link
                    </Button>
                    <Button size="small" variant="outlined" color="secondary" onClick={() => handleRemoveImage(idx)}>
                      Remove Image
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>)}
          </Box>
        )}
      </Box>
      {/* Column 2: Right */}
      <Box sx={{ width: '30%', p: 3, bgcolor: '#fff', flexBasis: '30%', borderLeft: '1px solid #e0e0e0' }}>
        <Typography variant="subtitle1" color="error" fontWeight="medium" mb={2}>
          ⛔ Image types which are not allowed:
        </Typography>
        <Box>
          {forbiddenImages.map((img, idx) => (
            <Stack direction="row" alignItems="center" spacing={2} key={idx} mb={1}>
              <Avatar src={img.img} variant="rounded" sx={{ width: 56, height: 56, borderRadius: 1 }} />
              <Typography variant="body2">{img.label}</Typography>
            </Stack>
          ))}
        </Box>
        </Box>
      </Box>
  )}
