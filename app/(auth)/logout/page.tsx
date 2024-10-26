
import { signOut } from '@/auth'
import GoBack from '@/components/dashboard/enter-in-collection/cancel-button'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const Logout = () => {
    return (
        <div className='w-full flex items-center justify-center flex-col'>
            <div className='flex w-full md:w-3/5 items-center justify-center flex-col'>
                <Card className='w-4/5 p-10 bg-white text-blue-500 text-center items-center shadow-md shadow-blue-200'>
                    <p className='text-xl lg:text-2xl font-semibold mb-10'>Luke 6:38</p>
                    <p className=' text-md lg:text-lg mb-10'> Vous nous quittez déjà? 😜</p>

                    <div className='grid grid-cols-2 gap-x-5'>
                      <GoBack/>
                      <form action={async () => {
                       "use server"
                       await signOut()
                       
                       }}>
                        <Button variant={"blue"} className='w-full'>
                            Déconnexion
                        </Button>
                      </form>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Logout