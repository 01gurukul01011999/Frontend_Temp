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
import { authClient } from '@/lib/auth/client';



export function AccountInfo(): React.JSX.Element {
  const [modalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState<{id: string; fname: string; lname: string; email: string; avatar: string; phone: string} | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchUser() {
      const result = await authClient.getUser();
      if (result.data) {
        // Map result.data to expected shape if necessary
        setUser({
          id: result.data.id,
          fname: typeof result.data.fname === 'string' ? result.data.fname : '',
          lname: typeof result.data.lname === 'string' ? result.data.lname : '',
          email: typeof result.data.email === 'string' ? result.data.email : '',
          avatar: typeof result.data.avatar === 'string' ? result.data.avatar : '',
          phone: typeof result.data.phone === 'string' ? result.data.phone : ''
        });
      } else if (result.error) {
        setError(result.error);
        setUser(null);
      } else {
        setUser(null);
      }
    }
    fetchUser();
  }, []);


 
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
