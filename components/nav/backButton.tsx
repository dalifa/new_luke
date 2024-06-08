"use client"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { ArrowLeft, ChevronLeft } from "lucide-react"


const BackButton = () => {
    const router = useRouter()
    const pathname = usePathname()
    return (
        <>
            {
                pathname !== "/" ? (
                    <ChevronLeft onClick={() => router.back()} 
            className='cursor-pointer h-6 w-6 '/>
                ):(<span className="text-yellow">🤗</span>)
            }
        </>
    )
}

export default BackButton
