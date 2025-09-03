'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { usePathname } from 'next/navigation';

import { usePopover } from '@/hooks/use-popover';
import { useAuth } from '@/modules/authentication';
import { useUser } from '@/hooks/use-user';

import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const [avatar, setAvatar] = React.useState<string>('');
  const userPopover = usePopover<HTMLDivElement>();
  const { user } = useAuth();
  const { user: contextUser, isLoading } = useUser();
  const pathname = usePathname();

  React.useEffect(() => {
    // Prefer avatar from the richer `contextUser` (profiles) if present,
    // fall back to auth `user`, then to a cached profile in storage, then empty.
    const computeAvatar = () => {
      if (contextUser?.avatar_url) return contextUser.avatar_url;
      if (user?.avatar_url) return user.avatar_url;

      // Try cached profile for instant display
      if (typeof globalThis !== 'undefined' && globalThis.window) {
        try {
          const cached = localStorage.getItem('cached-user-profile') || sessionStorage.getItem('cached-user-profile');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed?.avatar_url) return parsed.avatar_url;
            console.log('User Avatar:', parsed.avatar_url);
          }
        } catch {
          /* ignore JSON parse errors */
        }
      }

      return '';
    };

    const newAvatar = computeAvatar();
    // Only update state when the avatar actually changes to avoid re-render loops
    setAvatar((prev) => (prev === newAvatar ? prev : newAvatar));
    // Depend only on the avatar_url fields (not whole user objects) to avoid
    // re-running the effect when unrelated properties change.
  }, [user?.avatar_url, contextUser?.avatar_url, isLoading]);

  // Get business name with instant cache fallback
  const getBusinessName = () => {
    // First try to get from user context
    if (contextUser?.business_name) {
      return contextUser.business_name;
    }
    
    // If no user context, try to get from cache for instant display
    if (globalThis.window && !isLoading) {
      try {
        const cachedUser = localStorage.getItem('cached-user-profile') || sessionStorage.getItem('cached-user-profile');
        if (cachedUser) {
          const parsedUser = JSON.parse(cachedUser);
          if (parsedUser.business_name) {
            return parsedUser.business_name;
          }
        }
      } catch (error) {
        console.warn('Failed to load cached business name:', error);
      }
    }
    
    // Show loading only if we're actually loading and have no cached data
    if (isLoading) {
      return 'Loading...';
    }
    
    // Final fallback
    return 'Your Business';
  };

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>
            {/* Welcome Message replacing Search Icon */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start',
              minWidth: '300px',
            }}>


              {pathname == '/dashboard' && (
                <>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#1a1a1a',
                      lineHeight: 1.2,
                      fontSize: '1.1rem',
                    }}
                  >
                    Welcome back, {getBusinessName()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666666',
                      fontSize: '0.8rem',
                      lineHeight: 1.2,
                      mt: 0.5,
                    }}
                  >
                    Manage and grow your business with Techpotli
                  </Typography>
                </>
              )}
              
            </Box>
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Tooltip title="Contacts">
              <IconButton>
                <UsersIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <Badge badgeContent={4} color="success" variant="dot">
                <IconButton>
                  <BellIcon />
                </IconButton>
              </Badge>
            </Tooltip>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src={avatar || '/uploads/icon.png'}
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      </Box>
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}
