import Footer from "@/components/nav/footer"
import Navbar from "@/components/nav/navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full bg-slate-50">
      {/* nav  
      <Navbar/> */}
      <main className="pt-14 md:pt-20 pb-20 bg-slate-50">
        { children }
      </main>
      {/* footer 
      <Footer/> */}
    </div>
  )
}
