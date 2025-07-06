import { cn } from '@/lib/utils'

type Props = {
  label: string
}

const AuthHeader = ({ label }: Props) => {
  return (
    <div className='w-full flex flex-col items-center justify-center gap-y-4'>
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
        Welcome
      </h1>
      <p className='text-gray-500 text-sm text-center max-w-sm' style={{fontFamily:'Inter,Geist,sans-serif'}}>
        {label}
      </p>
    </div>
  )
}

export default AuthHeader