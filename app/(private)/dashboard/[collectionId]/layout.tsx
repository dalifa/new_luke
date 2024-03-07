import Footer from "@/components/nav/footer"
import Navbar from "@/components/nav/navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full bg-slate-50">
      {/* nav */}
      <div className="pt-5 md:pt-10 pb-20 bg-slate-50">
        { children }
      </div>
      {/* footer */}
    </div>
  )
}
