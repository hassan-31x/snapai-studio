"use client"

import { useState, useTransition } from 'react'
import CardWrapper from './card-wrapper'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { ResetPasswordSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import FormError from '@/components/form-error'
import FormSuccess from '@/components/form-success'
import { resetPassword } from '@/actions/reset-password'

type Props = {}

const ResetPasswordForm = (props: Props) => {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition() //automatically changes state on revalidatePath with server action

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: '',
    }
  })

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      resetPassword(values).then((data) => {
        setError(data?.error)
        setSuccess(data?.success)
      })
    })
  }

  return (
    <CardWrapper
      headerLabel="Enter your email address and we'll send you a reset link"
      backButtonLabel="Back to login"
      backButtonhref='/auth/login'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6' style={{fontFamily:'Inter,Geist,sans-serif'}}>
          <div className="space-y-5">
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      type='email'
                      placeholder='johndoe@gmail.com'
                      className="border-gray-200 focus-visible:ring-indigo-200 focus-visible:border-indigo-200 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            >
            </FormField>
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            type='submit'
            className='w-full bg-gray-900 text-white hover:bg-gray-700 rounded-lg py-3 font-medium transition-all'
            style={{fontFamily:'Geist,Inter,sans-serif'}}
          >
            Send Reset Email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default ResetPasswordForm