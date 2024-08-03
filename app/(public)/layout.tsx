import PublicTopbar from "@/components/nav/public-topbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full bg-white">
      <PublicTopbar/>
      <main className="pb-20 bg-white">
        {children}
      </main>
    </div>
  )
}
