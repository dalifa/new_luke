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
                    <Button size="sm" className=" text-white bg-red-800 hover:bg-red-900" 
                      onClick={() => router.back()}
                    >
                        <ChevronLeft className='cursor-pointer h-6 w-6 '/>
                    </Button>
                ):(<span className="text-yellow">🤗</span>)
            }
        </>
    )
}

export default BackButton
