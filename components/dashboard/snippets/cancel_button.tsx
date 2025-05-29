"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const GoBack = () => {
    const router = useRouter() 
    return (
        <Button variant={"outline"} onClick={() => router.push('/dashboard')}>Annuler</Button>
    )
}

export default GoBack
