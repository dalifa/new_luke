
//import Navbar from "@/components/nav/navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode 
}) {
  return (
    <div className="h-full bg-white/90">
      <main className="md:pt-10 pb-20 bg-white/90">
        { children }
      </main>
    </div>
  )
}
