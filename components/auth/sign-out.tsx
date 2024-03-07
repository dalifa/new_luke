import { logout } from "@/actions/logout"
import { Button } from "@/components/ui/button"


export default function SignOut() {
 return (
  <form action={async () => {
    "use server"
    await logout()
  }}
  className="w-full"
  > 
   <Button className=" bg-blue-100 text-slate-500 hover:bg-blue-600 hover:text-white h-8 w-full">Déconnexion</Button>
  </form>
)}