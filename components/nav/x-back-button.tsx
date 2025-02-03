"use client"
import { ChevronLeft, X } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

//
const XBackButton = () => {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <>
      {
        pathname !== "/" ? (
          <X onClick={() => router.back()} className='border rounded-md cursor-pointer h-6 w-6 text-slate-500'/>
        ):(<span className="text-yellow">🤗</span>)
      }
    </>
  )
}
//
export default XBackButton