import { PrivateTopbar } from "@/components/nav/private-topbar";
import { currentUser } from "@/hooks/own-current-user"
//
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const connected = await currentUser();
  return (
    <div className="h-full bg-white">
      {
        connected && (
          <PrivateTopbar/>
        )
      }
      <main className="pt-14 pb-20 bg-white">
        {children}
      </main>
    </div>
  )
}
