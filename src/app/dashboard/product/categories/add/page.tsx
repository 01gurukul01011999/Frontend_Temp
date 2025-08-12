'use client'
import React from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { UserContext } from '@/contexts/user-context';  
import { toast, ToastContainer } from 'react-toastify';
import {useRouter} from 'next/navigation';





function Page(): React.JSX.Element {
  const [image, setImage] = React.useState<File | null>(null);
  const [title, setTitle] = React.useState('');
  const [parent, setParent] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [metaTitle, setMetaTitle] = React.useState('');
  const [metaDescription, setMetaDescription] = React.useState('');
  const [metaKeywords, setMetaKeywords] = React.useState('');
  const [featured, setFeatured] = React.useState('no');
  const [showInFooter, setShowInFooter] = React.useState('no');
  const [status, setStatus] = React.useState('active');
const userContext = React.useContext(UserContext);
 const user = userContext?.user;
const router = useRouter();
  // Placeholder parent categories
  const parentCategories = [
    { value: '', label: 'None' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit =  async (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here
    if (!title || !slug) {
      alert('Title and Slug are required fields.');
      return;
    }
 
 //console.log('user', user);
 
 const formData = {image, title, parent, slug, metaTitle, metaDescription, metaKeywords, featured, showInFooter, status,  userId: user?.id || ''};
  
 
 const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL+'category';

 //console.log('url', apiUrl);
//console.log('formData', formData);
    //Send data to an API endpoint
    const response = await fetch(apiUrl, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json',
     },
     body: JSON.stringify(formData),
      });

    if (response.ok) {
      //alert('Form submitted successfully!');
    

      router.push('/dashboard/product/categories?added=1');
      return;
    } else {
      //alert('Error submitting form.');
      toast.error("some thing went Wrong!");
    }
  };




  return (
    <Box maxWidth={900} mx="auto" mt={4} mb={4}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" mb={2} fontWeight={600} textAlign="center" color="primary.main">
          Add Category
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Stack spacing={3}>
            {/* Image Upload */}
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
              <Button
                variant="contained"
                component="label"
                sx={{ width: 180, height: 180, borderRadius: 2, bgcolor: '#f5f5f5', color: 'primary.main', fontWeight: 500, fontSize: 16, boxShadow: 1 }}
              >
                {image ? (
                  <Image
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    width={180}
                    height={180}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
                  />
                ) : (
                  <>Upload Image</>
                )}
                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
              </Button>
              {image && <Typography variant="body2">{image.name}</Typography>}
            </Box>
            <Divider>Category Info</Divider>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                fullWidth
              />
              <TextField
                select
                label="Parent Category"
                value={parent}
                onChange={e => setParent(e.target.value)}
                fullWidth
              >
                {parentCategories.map(option => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
            </Stack>
            <TextField
              label="Slug"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              required
              fullWidth
            />
            <Divider>Meta Info</Divider>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Meta Title"
                value={metaTitle}
                onChange={e => setMetaTitle(e.target.value)}
                fullWidth
              />
              <TextField
                label="Meta Keywords"
                value={metaKeywords}
                onChange={e => setMetaKeywords(e.target.value)}
                fullWidth
              />
            </Stack>
            <TextField
              label="Meta Description"
              value={metaDescription}
              onChange={e => setMetaDescription(e.target.value)}
              multiline
              minRows={2}
              fullWidth
            />
            <Divider>Options</Divider>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                label="Featured"
                value={featured}
                onChange={e => setFeatured(e.target.value)}
                fullWidth
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </TextField>
              <TextField
                select
                label="Show in Footer"
                value={showInFooter}
                onChange={e => setShowInFooter(e.target.value)}
                fullWidth
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </TextField>
              <TextField
                select
                label="Status"
                value={status}
                onChange={e => setStatus(e.target.value)}
                fullWidth
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Stack>
            <Button type="submit" variant="contained" color="primary" size="large" sx={{ py: 1.5, fontWeight: 600 }}>
              Submit
            </Button>
          </Stack>
        </form>
         <ToastContainer position="top-right" autoClose={3000} />
      </Paper>
    </Box>
  );
}

export default Page;