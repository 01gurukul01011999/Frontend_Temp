# 🔐 Supabase Authentication Integration

This document outlines the complete Supabase authentication integration for the Seller Panel application.

## 📋 **Overview**

The application has been migrated from custom JWT authentication to Supabase Auth, providing:
- **Secure authentication** with email/password
- **Session management** via HTTP-only cookies
- **Row Level Security (RLS)** for database protection
- **Automatic token refresh** and session handling
- **Type-safe database operations** with TypeScript

## 🏗️ **Architecture**

### **Frontend (Next.js)**
```
src/
├── lib/
│   ├── supabase/
│   │   ├── browser.ts          # Client-side Supabase client
│   │   ├── server.ts           # Server-side Supabase client
│   │   ├── types.ts            # Database type definitions
│   │   └── auth-service.ts     # Authentication service layer
│   └── auth/                   # Legacy auth (to be removed)
├── contexts/
│   └── user-context.tsx        # Updated to use Supabase
├── components/
│   └── auth/                   # Auth components (updated)
├── modules/
│   └── authentication/         # Modern auth components
└── middleware.ts               # Route protection middleware
```

### **Backend (Express)**
```
src/
├── lib/
│   └── supabase-admin.js       # Admin client (service role)
└── modules/
    └── authentication/         # Legacy JWT auth (to be removed)
```

## 🚀 **Setup Instructions**

### **1. Environment Variables**

Create `.env.local` in the frontend directory:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Create `.env` in the backend directory:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### **2. Database Schema**

Run this SQL in your Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address TEXT,
  state TEXT,
  city TEXT,
  pincode TEXT,
  business_name TEXT,
  gst_number TEXT,
  avatar_url TEXT,
  account_status TEXT DEFAULT 'pending' CHECK (account_status IN ('pending', 'completed', 'suspended')),
  role TEXT DEFAULT 'seller' CHECK (role IN ('seller', 'admin', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name, account_status, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    'pending',
    'seller'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### **3. Install Dependencies**

**Frontend:**
```bash
cd Frontend_Temp/Frontend
npm install @supabase/supabase-js @supabase/ssr
```

**Backend:**
```bash
cd Frontend_Temp/Backend
npm install @supabase/supabase-js
```

## 🔧 **Usage Examples**

### **Frontend Authentication**

#### **Sign Up**
```typescript
import { authService } from '@/lib/supabase/auth-service';

const { error } = await authService.signUp({
  email: 'user@example.com',
  password: 'securepassword',
  firstName: 'John',
  lastName: 'Doe',
  phone: '1234567890',
  businessName: 'My Business',
  // ... other fields
});

if (error) {
  console.error('Sign up failed:', error);
}
```

#### **Sign In**
```typescript
import { authService } from '@/lib/supabase/auth-service';

const { error, user } = await authService.signIn({
  email: 'user@example.com',
  password: 'securepassword',
});

if (error) {
  console.error('Sign in failed:', error);
} else {
  console.log('User signed in:', user);
}
```

#### **Get Current User**
```typescript
import { useUser } from '@/hooks/use-user';

function MyComponent() {
  const { user, isLoading, error } = useUser();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Not authenticated</div>;
  
  return <div>Welcome, {user.first_name}!</div>;
}
```

### **Backend Admin Operations**

```javascript
import { adminUtils } from '../lib/supabase-admin.js';

// Get user profile
const { profile, error } = await adminUtils.getUserProfileByEmail('user@example.com');

// Update user profile
const { profile: updatedProfile } = await adminUtils.updateUserProfile(userId, {
  account_status: 'completed',
  business_name: 'Updated Business Name'
});
```

## 🛡️ **Security Features**

### **Row Level Security (RLS)**
- Users can only access their own profile data
- Admin operations bypass RLS using service role key
- Automatic user isolation and data protection

### **Session Management**
- HTTP-only cookies prevent XSS attacks
- Automatic token refresh
- Secure session storage

### **Environment Variable Security**
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Safe for client-side (limited permissions)
- `SUPABASE_SERVICE_ROLE_KEY`: Server-only, full database access

## 🔄 **Migration from JWT**

### **What's Changed**
1. **Authentication**: Custom JWT → Supabase Auth
2. **Session Storage**: localStorage → HTTP-only cookies
3. **User Context**: Updated to use Supabase sessions
4. **Route Protection**: Middleware-based with Supabase validation
5. **Database Access**: Direct queries with RLS policies

### **What's Kept**
1. **Form Validation**: Zod schemas remain unchanged
2. **UI Components**: All auth forms and layouts preserved
3. **Business Logic**: Non-auth related functionality unchanged
4. **Type Safety**: Enhanced with Supabase-generated types

## 🧪 **Testing**

### **Frontend Testing**
```bash
cd Frontend_Temp/Frontend
npm run dev
```

Test authentication flow:
1. Navigate to `/auth/sign-up`
2. Create a new account
3. Verify redirect to sign-in
4. Sign in with credentials
5. Verify redirect to dashboard

### **Backend Testing**
```bash
cd Frontend_Temp/Backend
npm run dev
```

Test admin operations:
1. Verify Supabase admin client connection
2. Test user profile operations
3. Verify RLS policies work correctly

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. Environment Variables Not Loading**
- Ensure `.env.local` exists in frontend root
- Restart development server after changes
- Verify variable names match exactly

#### **2. RLS Policy Errors**
- Check if RLS is enabled on profiles table
- Verify policy syntax and conditions
- Test with service role key to bypass RLS

#### **3. Session Not Persisting**
- Check cookie settings in browser
- Verify Supabase URL and keys
- Check middleware configuration

#### **4. Type Errors**
- Run `npm run typecheck` to identify issues
- Update types if database schema changes
- Ensure Supabase types are generated

### **Debug Mode**

Enable debug logging in development:
```typescript
// In supabase-browser.ts
export const createSupabaseBrowserClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        debug: process.env.NODE_ENV === 'development'
      }
    }
  );
```

## 📚 **Additional Resources**

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

## 🔮 **Future Enhancements**

1. **OAuth Integration**: Google, GitHub, Discord
2. **Multi-factor Authentication**: TOTP, SMS
3. **Advanced RLS Policies**: Role-based access control
4. **Real-time Subscriptions**: Live data updates
5. **Edge Functions**: Serverless backend logic

---

**Note**: This integration maintains backward compatibility while providing a more secure and scalable authentication system. All existing functionality has been preserved and enhanced with Supabase's robust features.
