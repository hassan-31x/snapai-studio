"use client"

import { useState, useTransition } from 'react'
import CardWrapper from './card-wrapper'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { NewPasswordSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import FormError from '@/components/form-error'
import FormSuccess from '@/components/form-success'
import { newPassword } from '@/actions/new-password'
import { useSearchParams } from 'next/navigation'

type Props = {}

const NewPasswordForm = (props: Props) => {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition() //automatically changes state on revalidatePath with server action

  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    }
  })

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      newPassword(values, token).then((data) => {
        setError(data.error)
        setSuccess(data.success)
      })
    })
  }

  return (
    <CardWrapper
      headerLabel='Enter a new password for your account'
      backButtonLabel="Back to login"
      backButtonhref='/auth/login'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6' style={{fontFamily:'Inter,Geist,sans-serif'}}>
          <div className="space-y-5">
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      type='password'
                      placeholder='Enter new password'
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
            Update Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default NewPasswordForm