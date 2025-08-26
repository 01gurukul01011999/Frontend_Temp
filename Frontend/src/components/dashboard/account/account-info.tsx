'use client'
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import  { useEffect, useState } from "react";
import AvatarUploadModal from '../layout/upload';
import { useAuth } from '@/modules/authentication';



export function AccountInfo(): React.JSX.Element {
  const [modalOpen, setModalOpen] = useState(false);
  const { user, error } = useAuth();


 
 if (error) return <div>{error}</div>;
  if (!user) return <div>Loading...</div>;


  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={user.avatar} sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography  variant="h5">{user.fname} {user.lname} </Typography>
            <Typography color="text.secondary" variant="body2">
              {user.id} 
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user.email}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <AvatarUploadModal
         open={modalOpen}
        onClose={() => setModalOpen(false)}
          onUpload={_file => {
   // handle file upload here (e.g., send to API)
            //console.log('File uploaded:', _file);
            }}
/>
<Button fullWidth variant="text" onClick={() => setModalOpen(true)}>Change Avatar</Button>
        
      </CardActions>
    </Card>
  );
}
