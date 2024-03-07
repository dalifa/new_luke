import Footer from "@/components/nav/footer"
import Navbar from "@/components/nav/navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col">
      <main className="flex-1 bg-blue-50/20">
        { children }
      </main>
    </div>
  )
}
