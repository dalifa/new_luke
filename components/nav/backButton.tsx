"use client"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { ArrowLeft } from "lucide-react"


const BackButton = () => {
    const router = useRouter()
    return (
        <>
            <ArrowLeft onClick={() => router.back()} 
            className='cursor-pointer h-6 w-6 '/>
        </>
    )
}

export default BackButton
