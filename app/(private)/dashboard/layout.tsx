import Footer from "@/components/nav/footer"
import Navbar from "@/components/nav/navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full bg-white pt-5">
      {/* nav  
      <Navbar/> */}
      <main className="pt-14 md:pt-20 pb-20 bg-white">
        { children }
      </main>
      {/* footer 
      <Footer/> */}
    </div>
  )
}
