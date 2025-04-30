
import { signOut } from '@/auth'
import XBackButton from '@/components/nav/x-back-button'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const Logout = () => {
  return (
    <div className='w-full flex items-center justify-center flex-col bg-indigo-600'>
      <div className='flex w-full md:w-2/5 items-center justify-center flex-col'>
        <Card className='w-4/5 p-5 md:p-10 bg-white text-indigo-600 text-center items-center'>
          <div className='w-full flex flex-col items-end'>
            <XBackButton/>
          </div>
          <div className='w-full'>
            <p className='text-xl lg:text-3xl font-black mb-10'>WE BLESS YOU</p>
          </div>
          <p className='text-lg lg:text-xl mb-10 text-slate-600'> Vous nous quittez déjà? 😜</p>
          <div className='grid grid-cols-1 gap-x-5'>
            <form action={async () => {
                "use server"
                await signOut()             
              }}
            >
              <Button variant={"primary"} className='w-full h-12 md:h-14 text-lg'>
                Déconnexion
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}
//
export default Logout