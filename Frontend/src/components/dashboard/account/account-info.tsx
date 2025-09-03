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
import { useEffect, useState } from 'react';
import { getAvatarUrl } from '@/lib/avatar';
import AvatarUploadModal from '../layout/upload';
import { useUser } from '@/hooks/use-user';

export function AccountInfo(): React.JSX.Element {
  const [modalOpen, setModalOpen] = useState(false);
  const { user, error, isLoading } = useUser();
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>();

  // Resolve avatar storage path (e.g. 'avatars/xxx.png') to a signed URL for display
  // Declared unconditionally so hook order remains stable
  useEffect(() => {
    let mounted = true;
    const resolve = async () => {
      try {
        if (!user) {
          if (mounted) setAvatarSrc(undefined);
          return;
        }

        const candidate = typeof user.avatar_url === 'string' ? user.avatar_url : undefined;
        if (!candidate) {
          if (mounted) setAvatarSrc(undefined);
          return;
        }

        // If it's already a full URL, use as-is
        if (/^https?:\/\//i.test(candidate)) {
          if (mounted) setAvatarSrc(candidate);
          return;
        }

        // Otherwise treat it as a storage path and request a signed URL
        const signed = await getAvatarUrl(candidate, 60 * 60);
        if (mounted) setAvatarSrc(signed || undefined);
      } catch (error_) {
        console.warn('Failed to resolve avatar URL', error_);
        if (mounted) setAvatarSrc(undefined);
      }
    };
    resolve();
    return () => { mounted = false; };
  }, [user]);

  if (error) return <div>{error}</div>;
  if (isLoading || !user) return <div>Loading...</div>;

  const displayName = `${String(user.first_name ?? '')} ${String(user.last_name ?? '')}`.trim() || user.email;

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar
              src={avatarSrc || '/uploads/icon.png'}
              alt={displayName}
              sx={{ height: 80, width: 80 }}
            />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{displayName}</Typography>
            <Typography color="text.secondary" variant="body2">{user.id}</Typography>
            <Typography color="text.secondary" variant="body2">{user.email}</Typography>
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
            // console.log('File uploaded:', _file);
          }}
        />
        <Button fullWidth variant="text" onClick={() => setModalOpen(true)}>Change Avatar</Button>
      </CardActions>
    </Card>
  );
}
