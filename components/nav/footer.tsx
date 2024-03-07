import { auth } from '@/auth'
import { HomeIcon, Info, LogIn, LogOut, Settings, UserCircle2 } from 'lucide-react'
import Link from 'next/link'

const Footer = async () => {
    const session = await auth();
    return (
        <div className=' fixed bottom-0 flex w-full h-12 bg-white border-t-[1px] border-slate-500 items-center'>
            <div className='flex w-full items-center justify-between flex-row px-6 lg:px-52 xl:px-64'>
                <div className='flex items-center justify-center p-[3px] text-slate-500 border-[1px] border-slate-500
                 rounded-md hover:bg-blue-800 hover:text-white'>
                    <Link href={"/"}>
                        <HomeIcon/>
                    </Link>
                </div>
                <div className='flex items-center justify-center p-[3px] text-slate-500 border-[1px] border-slate-500
                 rounded-md hover:bg-blue-800 hover:text-white'>
                    <Link href={"/ccm"}>
                        <Settings/>
                    </Link>
                </div>
                <div className='flex items-center justify-center p-[3px] text-slate-500 border-[1px] border-slate-500
                 rounded-md hover:bg-blue-800 hover:text-white'>
                    <Link href={"/infos"}>
                        <Info/>
                    </Link> 
                </div>
                <div className='flex items-center justify-center p-[3px] text-slate-500 border-[1px] border-slate-500
                 rounded-md hover:bg-blue-800 hover:text-white'>
                    {
                        session ? (
                            <Link href={"/logout"}>
                                <LogOut/>
                            </Link>
                        ):(
                            <Link href={"/connexion-inscription"}>
                                <LogIn/>
                            </Link>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Footer


