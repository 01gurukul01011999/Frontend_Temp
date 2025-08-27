import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { SignOutIcon } from '@phosphor-icons/react/dist/ssr/SignOut';
import { UserIcon } from '@phosphor-icons/react/dist/ssr/User';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useAuth } from '@/modules/authentication';
import { authService } from '@/lib/supabase/auth-service';

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

export function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
  const { user, signOut } = useAuth();

  const router = useRouter();
  const [profile, setProfile] = React.useState<any | null>(null);
  const [profileError, setProfileError] = React.useState<any | null>(null);
//console.log('UserPopover render, user:', user, 'profile:', profile, 'profileError:', profileError);
  React.useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        const { profile: p, error } = await authService.getUserProfile(user.id);
        if (!mounted) return;
        setProfile(p ?? null);
        setProfileError(error ?? null);
      } catch (err) {
        if (!mounted) return;
        setProfileError(err);
      }
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, [user]);

  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      await signOut();
      // After signOut, AuthGuard will handle the redirect
    } catch (error) {
      logger.error('Sign out error', error);
    }
  }, [signOut]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '240px' } } }}
    >
      <Box sx={{ p: '16px 20px ' }}>
        <Typography variant="subtitle1">
          {`${profile?.first_name } ${profile?.last_name}`}
        </Typography>
        <Typography color="text.secondary" variant="body2">
           {user?.email || 'User'} 
        </Typography>
      </Box>
      <Divider />
      <MenuList disablePadding sx={{ p: '8px', '& .MuiMenuItem-root': { borderRadius: 1 } }}>
        <MenuItem component={RouterLink} href={paths.dashboard.settings} onClick={onClose}>
          <ListItemIcon>
            <GearSixIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem component={RouterLink} href={paths.dashboard.account} onClick={onClose}>
          <ListItemIcon>
            <UserIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <SignOutIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </MenuList>
    </Popover>
  );
}
