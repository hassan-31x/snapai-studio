"use client";

import { useState, useTransition } from "react";
import CardWrapper from "./card-wrapper";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { login } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type Props = Record<string, never>;

const LoginForm = (props: Props) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition(); //automatically changes state on revalidatePath with server action

  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email in use with different provider"
      : undefined;

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "muhammadhassanchannel786@gmail.com",
      password: "muhammadhassanchannel786@gmail.com",
      code: "",
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
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonhref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {showTwoFactor && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Two Factor Code
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isPending}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} className="w-12 h-12" />
                            <InputOTPSlot index={1} className="w-12 h-12" />
                            <InputOTPSlot index={2} className="w-12 h-12" />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} className="w-12 h-12" />
                            <InputOTPSlot index={4} className="w-12 h-12" />
                            <InputOTPSlot index={5} className="w-12 h-12" />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {!showTwoFactor && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Email address*
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          {...field}
                          disabled={isPending}
                          type="email"
                          placeholder="you@brand.com"
                          className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-400 focus:ring-blue-100 rounded-lg"
                        />
                      </div>
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
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Password*
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          {...field}
                          disabled={isPending}
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="pl-10 pr-10 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-400 focus:ring-blue-100 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <div className="flex items-center justify-between mt-2">
                      <Link
                        href="/auth/reset-password"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <FormError message={error || urlError} />
          <FormSuccess message={success} />

          <Button disabled={isPending} type="submit" className="w-full h-12">
            {isPending
              ? "Signing in…"
              : showTwoFactor
                ? "Confirm code"
                : "Sign in"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
