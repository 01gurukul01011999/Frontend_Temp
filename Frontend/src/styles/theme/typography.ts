import type { TypographyVariantsOptions } from "@mui/material/styles";

export const typography = {
  fontFamily:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
  body1: { fontSize: '0.858rem', fontWeight: 400, lineHeight: 1.5 },
  body2: { fontSize: '0.75075rem', fontWeight: 400, lineHeight: 1.57 },
  button: { fontWeight: 500 },
  caption: { fontSize: '0.6435rem', fontWeight: 400, lineHeight: 1.66 },
  subtitle1: { fontSize: '0.858rem', fontWeight: 500, lineHeight: 1.57 },
  subtitle2: { fontSize: '0.75075rem', fontWeight: 500, lineHeight: 1.57 },
  overline: {
    fontSize: '0.6435rem',
    fontWeight: 500,
    letterSpacing: '0.429px',
    lineHeight: 2.5,
    textTransform: 'uppercase',
  },
  h1: { fontSize: '2.145rem', fontWeight: 500, lineHeight: 1.2 },
  h2: { fontSize: '1.716rem', fontWeight: 500, lineHeight: 1.2 },
  h3: { fontSize: '1.5015rem', fontWeight: 500, lineHeight: 1.2 },
  h4: { fontSize: '1.287rem', fontWeight: 500, lineHeight: 1.2 },
  h5: { fontSize: '1.0725rem', fontWeight: 500, lineHeight: 1.2 },
  h6: { fontSize: '0.858rem', fontWeight: 500, lineHeight: 1.2 },
} satisfies TypographyVariantsOptions;
