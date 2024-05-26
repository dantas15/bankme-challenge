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
import { useRouter } from 'next/navigation';

export default function Login() {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const router = useRouter();

  function onSubmit(values: z.infer<typeof userSchema>) {}

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
            name="username"
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
              onClick={() => {
                router.push('/');
              }}
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
