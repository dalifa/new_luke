
import { signOut } from '@/auth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const Logout = () => {
    return (
        <div className='w-full flex items-center justify-center flex-col'>
            <div className='flex w-full md:w-3/5 items-center justify-center flex-col'>
                <Card className='w-4/5 p-10 bg-white text-blue-800 text-center items-center'>
                    <p className='text-xl lg:text-2xl font-semibold mb-10'>Luke 6:38</p>
                    <p className=' text-md lg:text-lg mb-10'> Vous nous quittez déjà ?</p>

                    <form action={async () => {
                       "use server"
                       await signOut()
                       
                       }}>
                        <Button variant={"blue"}>
                            Déconnexion
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    )
}

export default Logout