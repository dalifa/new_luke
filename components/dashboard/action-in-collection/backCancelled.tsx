"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"


const BackCancel = () => {
    const router = useRouter()
    return (
        <Button 
            onClick={() => router.back()} 
            className='cursor-pointer border-red-400 text-white bg-red-500 hover:bg-red-600'
        >
            Annuler le don
        </Button>
    )
}

export default BackCancel
