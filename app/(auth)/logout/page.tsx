
import { signOut } from '@/auth'
import XBackButton from '@/components/nav/x-back-button'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const Logout = () => {
  return (
    <div className='w-full flex items-center justify-center flex-col bg-red-800'>
      <div className='flex w-full md:w-3/5 items-center justify-center flex-col'>
        <Card className='w-4/5 p-5 md:p-10 bg-white text-red-800 text-center items-center'>
          <div className='w-full flex flex-col items-end'>
            <XBackButton/>
          </div>
          <div className='w-full'>
            <p className='text-xl lg:text-2xl font-semibold mb-10'>Tripl</p>
          </div>
          <p className='text-lg lg:text-xl mb-10 text-slate-600'> Vous nous quittez déjà? 😜</p>
          <div className='grid grid-cols-1 gap-x-5'>
            <form action={async () => {
                "use server"
                await signOut()             
              }}
            >
              <Button variant="primary" className='w-full h-12 md:h-14 text-lg hover:bg-red-900'>
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