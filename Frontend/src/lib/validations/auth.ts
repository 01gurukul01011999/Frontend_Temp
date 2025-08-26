import { z } from 'zod';

// Phone validation: +91 followed by 10 digits
export const phoneSchema = z
  .string()
  .regex(/^\+91[1-9][0-9]{9}$/, 'Phone must be +91 followed by 10 digits');

// Pincode validation: 6 digits
export const pincodeSchema = z
  .string()
  .regex(/^[0-9]{6}$/, 'Pincode must be 6 digits');

// GST validation: standard GSTIN format
export const gstSchema = z
  .string()
  .regex(
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
    'Invalid GST number format'
  );

// Address schema
export const addressSchema = z.object({
  label: z.string().default('Home'),
  line1: z.string().min(1, 'Address line 1 is required'),
  line2: z.string().optional(),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  pincode: pincodeSchema,
  country: z.string().default('IN'),
  is_default: z.boolean().default(true),
});

// Sign-up schema
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(10, 'Password must be at least 10 characters'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: phoneSchema,
  business_name: z.string().min(1, 'Business name is required'),
  gst_number: gstSchema,
  address: addressSchema,
});

// Sign-in schema
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>;
export type AddressData = z.infer<typeof addressSchema>;
