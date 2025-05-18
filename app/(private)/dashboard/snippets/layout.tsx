
//import Navbar from "@/components/nav/navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full bg-indigo-600">
      <main className="pb-20 bg-indigo-600">
        { children }
      </main>
    </div>
  )
}
