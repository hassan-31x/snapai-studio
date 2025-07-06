"use client"

import { useState, useTransition } from 'react'
import CardWrapper from './card-wrapper'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { LoginSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import FormError from '@/components/form-error'
import FormSuccess from '@/components/form-success'
import { login } from '@/actions/login'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

type Props = {}

const LoginForm = (props: Props) => {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isPending, startTransition] = useTransition(); //automatically changes state on revalidatePath with server action

  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email in use with different provider" : undefined;

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: ""
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <div className="auth-fade-in">
      <CardWrapper headerLabel="Sign in to your account to continue" backButtonLabel="Don't have an account?" backButtonhref="/auth/register" showSocial>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" style={{fontFamily:'Inter,Geist,sans-serif'}}>
            <div className="space-y-5">
              {showTwoFactor && (
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">Two Factor Code</FormLabel>
                      <FormControl>
                        <div className="flex justify-center">
                          <InputOTP maxLength={6} value={field.value} onChange={field.onChange} disabled={isPending}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} className="auth-input" />
                              <InputOTPSlot index={1} className="auth-input" />
                              <InputOTPSlot index={2} className="auth-input" />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot index={3} className="auth-input" />
                              <InputOTPSlot index={4} className="auth-input" />
                              <InputOTPSlot index={5} className="auth-input" />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              )}
              {!showTwoFactor && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={isPending} 
                            type="email" 
                            placeholder="johndoe@gmail.com" 
                            className="auth-input h-12 px-4 rounded-xl border-gray-200/60 focus-visible:ring-2 focus-visible:ring-indigo-200/50 focus-visible:border-indigo-300 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-5a3 3 0 100-6 3 3 0 000 6z" />
                          </svg>
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={isPending} 
                            type="password" 
                            placeholder="Enter your password" 
                            className="auth-input h-12 px-4 rounded-xl border-gray-200/60 focus-visible:ring-2 focus-visible:ring-indigo-200/50 focus-visible:border-indigo-300 transition-all duration-200"
                          />
                        </FormControl>
                        <Button size="sm" variant="link" asChild className="px-0 font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                          <Link href="/auth/reset-password" className="text-sm">
                            Forgot password?
                          </Link>
                        </Button>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                </>
              )}
            </div>
            <FormError message={error || urlError} />
            <FormSuccess message={success} />
            <Button 
              disabled={isPending} 
              type="submit" 
              className="auth-button w-full h-12 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{fontFamily:'Geist,Inter,sans-serif'}}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {showTwoFactor ? "Verifying..." : "Signing In..."}
                </div>
              ) : (
                showTwoFactor ? "Confirm" : "Sign In"
              )}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
}

export default LoginForm