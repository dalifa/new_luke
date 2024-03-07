"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"


const BackCancel = () => {
    const router = useRouter()
    return (
        <Button 
            onClick={() => router.back()} 
            className='cursor-pointer
            border-2 border-red-400 text-red-400 bg-white hover:text-white hover:bg-red-500'
        >
            Annuler
        </Button>
    )
}

export default BackCancel
