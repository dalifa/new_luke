import Footer from "@/components/nav/footer"
import Navbar from "@/components/nav/navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full bg-white">
      <main className="pb-20 bg-white">
        { children }
      </main>
    </div>
  )
}
