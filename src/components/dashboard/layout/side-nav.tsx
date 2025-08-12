'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { Logo } from '@/components/core/logo';
import { BellIcon } from '@phosphor-icons/react/dist/ssr/Bell'; 
import { HeadsetIcon } from '@phosphor-icons/react/dist/ssr/Headset';// Assuming you are using lucide-react for icons

import { navItems } from './config';
import { navIcons } from './nav-icons';
import { UserContext } from '@/contexts/user-context';
import { StorefrontIcon } from '@phosphor-icons/react/dist/ssr/Storefront'; // Assuming you are using lucide-react for icons

export function SideNav(): React.JSX.Element {
  const pathname = usePathname();
  const userContext = React.useContext(UserContext);
  const user = userContext?.user;

  // State to track open/close for dropdowns by key
  const [openDropdowns, setOpenDropdowns] = React.useState<Record<string, boolean>>({});

  const handleToggle = (key: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Define button links
  const noticesHref = '/dashboard/notices';
  const supportHref = '/dashboard/support';

  // Determine active state
  const isNoticesActive = pathname === noticesHref;
  const isSupportActive = pathname === supportHref;

  return (
    <Box
      sx={{
        '--SideNav-background': 'var(--mui-palette-neutral-950)',
        '--SideNav-color': 'var(--mui-palette-common-white)',
        '--NavItem-color': 'var(--mui-palette-neutral-300)',
        '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
        '--NavItem-active-background': 'var(--mui-palette-primary-main)',
        '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
        '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
        '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
        bgcolor: 'var(--SideNav-background)',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        left: 0,
        maxWidth: '100%',
        position: 'fixed',
        top: 0,
        width: 'var(--SideNav-width)', // Shrink the width from var(--SideNav-width) to 200px
        zIndex: 'var(--SideNav-zIndex)',
        overflowY: 'auto', // Enable vertical scroll
        scrollbarWidth: 'thin', // For Firefox
        '&::-webkit-scrollbar': { width: 8, background: 'rgba(255,255,255,0.04)' },
        '&::-webkit-scrollbar-thumb': { background: 'var(--mui-palette-neutral-700)', borderRadius: 4 },
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        
      
 {/* User Name Box */}
        {user && (
          <Box component="nav"
            sx={{
             
             ml: -2,
              borderRadius: '10px',
              px: 0,
              py: 0,
              fontSize: '0.7rem',
              boxShadow: 1,
              mt: 0,
              mb: 0,
              width: '175px',
              whiteSpace: 'normal',
              textOverflow: 'ellipsis',
              display: 'flex',
              alignItems: 'center',
              gap:1,
            }}
          >
            {/* Home Icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 0 }}>
              <StorefrontIcon size={32} />
            </Box>
            <Box>
              {(user.fname ?? '') + ' ' + (user.lname ?? '')} <br />
              {(user.roll ?? '').toString()}
            </Box>
          </Box>
          
        )}
  {/* Two Action Buttons below user box */}
        <Box sx={{ display: 'flex', gap: 0, justifyContent: 'center', ml: -3.8, mt: -1, mb: -3, width: '196px', overflow: 'hidden' }}>
          <Button
            component={Link}
            href={noticesHref}
            sx={{
           
              width: '50%',
              borderRadius: 0,
              borderColor: 'var(--mui-palette-neutral-700)',
              bgcolor: isNoticesActive ? 'var(--NavItem-active-background)' : 'var(--SideNav-background)',
              color: isNoticesActive ? 'var(--NavItem-active-color)' : 'var(--NavItem-color)',
              '&:hover': {
                bgcolor: isNoticesActive ? 'var(--NavItem-active-background)' : 'rgba(255,255,255,0.04)',
              },
            }}
            variant="outlined"
            size="small"
            startIcon={<BellIcon size={20} weight="regular" />}
          >
            Notices
          </Button>
          <Button
            component={Link}
            href={supportHref}
            sx={{
              width: '50%',
              borderRadius: 0,
              borderColor: 'var(--mui-palette-neutral-700)',
              bgcolor: isSupportActive ? 'var(--NavItem-active-background)' : 'var(--SideNav-background)',
              color: isSupportActive ? 'var(--NavItem-active-color)' : 'var(--NavItem-color)',
              '&:hover': {
                bgcolor: isSupportActive ? 'var(--NavItem-active-background)' : 'rgba(255,255,255,0.04)',
              },
            }}
            variant="outlined"
            size="small"
            startIcon={<HeadsetIcon size={20} weight="regular" />}
          >
            Support
          </Button>
        </Box>
      </Stack>
        
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
        {renderNavItems({ pathname, items: navItems, openDropdowns, handleToggle })}
      </Box>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      <Stack spacing={2} sx={{ p: '12px' }}>
      <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-flex' }}>
          <Logo color="light" height={32} width={122} /><br/>
         
        </Box>
      </Stack>
    </Box>
  );
}
function renderNavItems({
  items = [],
  pathname,
  openDropdowns,
  handleToggle,
  parentKey = '',
}: {
  items?: NavItemConfig[];
  pathname: string;
  openDropdowns: Record<string, boolean>;
  handleToggle: (key: string) => void;
  parentKey?: string;
}): React.JSX.Element {
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const { key, children: childItems, ...item } = curr;
    const hasChildren = !!childItems && childItems.length > 0;
     const dropdownKey = parentKey ? `${parentKey}.${key}` : key;
    const open = openDropdowns[dropdownKey] || false;
    // Check if any child is active
    let childActive = false;
    if (hasChildren && childItems) {
      childActive = childItems.some(child => isNavItemActive({
        ...child,
        pathname
      }));
    }
    acc.push(
      <React.Fragment key={key}>
        <NavItem
        key={dropdownKey} {...item}
        pathname={pathname}
        hasChildren={hasChildren}
        open={open}
        onToggle={ hasChildren ? () => handleToggle(dropdownKey) : undefined}
        childActive={childActive}
        children={hasChildren
          ? [
            <Collapse in={open} timeout="auto" unmountOnExit key="collapse">
              <Box sx={{ pl: 3 /* Indent submenu */, borderLeft: '2px solid var(--mui-palette-neutral-800)', ml: 2 }}>
                   
                {renderNavItems({ items: childItems, pathname, openDropdowns, handleToggle })}
              </Box>
            </Collapse>
          ]
          : undefined}        />
      </React.Fragment>
    );
    return acc;
  }, []);

  return (
    <Stack component="ul" spacing={-1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
      
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
  hasChildren?: boolean;
  open?: boolean;
  onToggle?: () => void;
}

function NavItem({ disabled,   external,    href,   icon,  matcher,   pathname,   title,   hasChildren,   open,   onToggle,   children,   childActive,
}: NavItemProps & { childActive?: boolean }): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname }) || childActive;
  const Icon = icon ? navIcons[icon] : null;

  return (
    <li>
      <Box
     


        {...(href
          ? {
              component: external ? 'a' : RouterLink,
              href,
              target: external ? '_blank' : undefined,
              rel: external ? 'noreferrer' : undefined,
            }
          : { role: 'button', onClick: hasChildren ? onToggle : undefined })}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: 'var(--NavItem-color)',
          cursor: hasChildren ? 'pointer' : 'pointer',
          display: 'flex',
          flex: '0 0 auto',
          gap: 1,
          p: '4px 6px',
          position: 'relative',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          ...(disabled && {
            bgcolor: 'var(--NavItem-disabled-background)',
            color: 'var(--NavItem-disabled-color)',
            cursor: 'not-allowed',
          }),
          ...(active && {
            bgcolor: childActive ? 'rgba(0, 123, 255, 0.08)' : 'var(--NavItem-active-background)',
            color: 'var(--NavItem-active-color)',
          }),
        }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
          {Icon ? (
            <Icon
              fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
              fontSize="var(--icon-fontSize-md)"
              weight={active ? 'fill' : undefined}
            />
          ) : null}
        </Box>
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography
            component="span"
            sx={{ color: 'inherit', fontSize: '0.78rem', fontWeight: 500, lineHeight: '24px' }}
          >
            {title}
          </Typography>
        </Box>
        {hasChildren &&
          (open ? (
            <ExpandLess sx={{ ml: 1 }} />
          ) : (
            <ExpandMore sx={{ ml: 1 }} />
          ))}
      </Box>
      {children}
    </li>
  );
}


