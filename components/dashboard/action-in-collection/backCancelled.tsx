"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"


const BackCancel = () => {
    const router = useRouter()
    return (
        <Button 
            onClick={() => router.back()}
            variant={"outline"} 
            className='w-full h-full cursor-pointer border-2 '
        >
            Annuler
        </Button>
    )
}

export default BackCancel
