import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiTab = {
  styleOverrides: {
    root: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: 1.8,
      minWidth: 'auto',
      paddingLeft: 0,
      paddingRight: 0,
      // reduce vertical space to make tabs and subtabs shorter
      paddingTop: '15px',
      paddingBottom: '6px',
      minHeight: 15,
      textTransform: 'none',
      '& + &': { marginLeft: '16px' },
    },
  },
} satisfies Components<Theme>['MuiTab'];
