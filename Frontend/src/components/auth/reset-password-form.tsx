'use client';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { useRouter } from 'next/navigation';

import { authClient } from '@/lib/auth/client';

const schema = zod.object({ email: zod.string().min(1, { message: 'Email is required' }).email() });

type Values = zod.infer<typeof schema>;

const defaultValues = { email: '' } satisfies Values;

export function ResetPasswordForm(): React.JSX.Element {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [codeVerified, setCodeVerified] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      setEmail(values.email); // Save email for verification step
      const { error } = await authClient.resetPassword(values);
      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }
      setIsPending(false);
      setCodeSent(true); // Show verification code input
    },
    [setError]
  );

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setVerifyError(null);
    const { error } = await authClient.verifyCode({ email, code: verificationCode });
    setIsPending(false);
    if (error) {
      setVerifyError(error);
    } else {
      setCodeVerified(true);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setPasswordError(null);
    setPasswordSuccess(null);
    const { error } = await authClient.newUpdatePassword({ email, newPassword });
    setIsPending(false);
    if (error) {
      setPasswordError(error);
    } else {
      setPasswordSuccess('Password updated successfully!');
      router.push('sign-in?reset=success');
    }
  };

  return (
    <Stack spacing={4}>
      <Typography variant="h5">Reset password</Typography>
  {codeSent === false ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <FormControl error={Boolean(errors.email)}>
                  <InputLabel>Email address</InputLabel>
                  <OutlinedInput {...field} label="Email address" type="email" />
                  {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
            <Button disabled={isPending} type="submit" variant="contained">
              Send recovery link
            </Button>
          </Stack>
        </form>
  ) : codeVerified === false ? (
        <form onSubmit={handleVerify}>
          <Stack spacing={2}>
            <FormControl>
              <InputLabel>Verification Code</InputLabel>
              <OutlinedInput
                value={verificationCode}
                onChange={e => setVerificationCode(e.target.value)}
                label="Verification Code"
                type="text"
                required
              />
            </FormControl>
            {verifyError ? <Alert color="error">{verifyError}</Alert> : null}
            <Button disabled={isPending} type="submit" variant="contained">
              Verify Code
            </Button>
          </Stack>
        </form>
      ) : (
        <form onSubmit={handlePasswordChange}>
          <Stack spacing={2}>
            <FormControl>
              <InputLabel>New Password</InputLabel>
              <OutlinedInput
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                label="New Password"
                type="password"
                required
              />
            </FormControl>
            {passwordError ? <Alert color="error">{passwordError}</Alert> : null}
            {passwordSuccess ? <Alert color="success">{passwordSuccess}</Alert> : null}
            <Button disabled={isPending} type="submit" variant="contained">
              Set New Password
            </Button>
          </Stack>
        </form>
      )}
    </Stack>
  );
}
