'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/shared/schemas/user-schema';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/hooks/useAuth';
import { useEffect } from 'react';
import { useToast } from '@/shared/hooks/use-toast';

export default function Login() {
  const { toast } = useToast();
  const router = useRouter();

  const { login, isLoading, accessToken } = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  });

  useEffect(() => {
    if (accessToken) {
      router.push('/dashboard');
    }
  }, [router, accessToken]);

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    if (isLoading || accessToken) {
      return;
    }
    const response = await login(values);
    if (!response) {
      toast({
        title: 'Success!',
        description: "You're being redirected to the dashboard",
      });
      return;
    }
    if (typeof response === 'string') {
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: response,
      });
      return;
    }
    response.login?.forEach((message) => {
      form.setError('login', {
        message,
      });
    });
    response.password?.forEach((message) => {
      form.setError('password', {
        message,
      });
    });
  }

  const isFormDisabled = !!isLoading || !!accessToken;

  return (
    <main className="w-[375px] sm:w-2/5 py-10 gap-4 flex flex-col items-center justify-center rounded-md border-ring bg-muted">
      <Form {...form}>
        <h1>Start by logging in!</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full px-28"
        >
          <FormField
            control={form.control}
            name="login"
            disabled={isFormDisabled}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Login</FormLabel>
                <FormControl>
                  <Input placeholder="mylogin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            disabled={isFormDisabled}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="mypassword123"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row-reverse">
            <Button
              type="submit"
              className="place-self-end"
              disabled={isFormDisabled}
            >
              Login
            </Button>
          </div>
          <div className="flex justify-center">
            <p className="text-muted-foreground">
              Don&apos;t have an account yet?{' '}
              <Link className="text-foreground" href="/sign-up">
                Click here
              </Link>{' '}
              to sign up!
            </p>
          </div>
        </form>
      </Form>
    </main>
  );
}
