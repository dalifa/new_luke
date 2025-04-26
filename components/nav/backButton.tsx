"use client"
import { ChevronLeft } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "../ui/button"


const BackButton = () => {
    const router = useRouter()
    const pathname = usePathname() 
    return (
        <>
            { 
                pathname !== "/" ? (
                    <Button size="sm" className=" text-white bg-indigo-400 hover:bg-white hover:text-indigo-600" 
                      onClick={() => router.back()}
                    >
                        <ChevronLeft className='cursor-pointer h-5 w-5 md:h6 md:w-6'/>
                    </Button>
                ):(<span className="text-yellow">🤗</span>)
            }
        </>
    )
}

export default BackButton
