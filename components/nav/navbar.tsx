import { auth } from '@/auth'
import { FaCircleUser } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu } from './menu';
import Link from 'next/link';
import BackButton from './backButton';

const Navbar = async () => {
  const session = await auth();
    return (
      <div className='fixed z-20 top-0 flex w-full h-12 md:h-14 bg-blue-800 text-white items-center justify-center border-b border-white'>
        <div className='flex flex-col items-center w-full lg:w-4/5 px-5 lg:px-0'>
        {
          session ? (
            <div className='flex w-full items-center justify-between flex-row px-0 lg:px-6'>
              <div className=''>
                <BackButton/>
              </div>
              <div className='font-semibold'>
                <Link href={"/"} className='text-xl'>
                  Luke 6:38
                </Link>
              </div>
              <div className='flex items-center flex-row gap-x-2'>
                <div>
                  <Avatar className='h-7 w-7 border-white border-2'>
                    <AvatarImage src={session.user.image || ""} />
                      <AvatarFallback className="">
                    <FaCircleUser className="text-yellow-500 h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Menu/>
              </div>
            </div>
          ):(
              <div className='flex w-full items-center justify-between flex-row'>
                <div className='text-xl lg:text-2xl font-semibold'>
                  Luke 6:38
                </div>
                  <div className='font-semibold text-xs md:text-base'>
                    Je donne, je reçois ! 😊
                  </div>
              </div>
            )
        }
        </div>
      </div>
    )
}

export default Navbar
