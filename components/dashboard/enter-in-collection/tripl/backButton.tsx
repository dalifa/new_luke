"use client"
import { Button } from "@/components/ui/button"
//
import { usePathname, useRouter } from "next/navigation"
//
const BackButton = () => {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <>
    {
      pathname !== "/" ? (
        <Button variant="outline" size="sm" className="py-5" 
          onClick={() => router.back()}
        >
          Annuler
        </Button>
      ):(<span className="text-yellow">🤗</span>)
    }
    </>
  )
}
//
export default BackButton
