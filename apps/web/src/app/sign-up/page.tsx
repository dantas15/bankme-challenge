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
import { userSchema } from '@/shared/schemas/user-schema';
import { useAuth } from '@/shared/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchClient } from '@/shared/lib/fetch-client';
import { groupValidationMessagesFromApi } from '@/shared/lib/group-validation-messages-from-api';
import { useToast } from '@/shared/hooks/use-toast';

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const { accessToken } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (accessToken) {
      router.push('/dashboard');
    }
  }, [router, accessToken]);

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof userSchema>) {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    const response = await fetchClient('/integrations/user', {
      method: 'POST',
      body: values,
    });
    const jsonData = await response.json();

    setIsLoading(false);

    const validResponse = userSchema.safeParse(jsonData);

    if (!validResponse.success) {
      const errorsFromResponse = groupValidationMessagesFromApi<
        z.infer<typeof userSchema>
      >(jsonData.message);

      if (typeof errorsFromResponse === 'string') {
        toast({
          variant: 'destructive',
          title: 'Error!',
          description: errorsFromResponse,
        });
        return;
      }

      errorsFromResponse.username?.forEach((message) => {
        form.setError('username', {
          message,
        });
      });
      errorsFromResponse.password?.forEach((message) => {
        form.setError('password', {
          message,
        });
      });
    }

    toast({
      title: 'Success!',
      description: "You'll be be able to login now!",
    });

    router.push('/');
  }

  const isFormDisabled = !!accessToken || isLoading;

  return (
    <main className="w-[375px] sm:w-2/5 py-10 gap-4 flex flex-col items-center justify-center rounded-md border-ring bg-muted">
      <Form {...form}>
        <h1>Sign up!</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full px-28"
        >
          <FormField
            control={form.control}
            name="username"
            disabled={isFormDisabled}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="myUsername" {...field} />
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
              Sign up
            </Button>
          </div>
          <div className="flex justify-center">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link className="text-foreground" href="/login">
                Click here
              </Link>{' '}
              to login!
            </p>
          </div>
        </form>
      </Form>
    </main>
  );
}
