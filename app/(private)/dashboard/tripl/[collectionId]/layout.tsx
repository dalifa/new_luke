
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full bg-white/90"> 
      {/* nav */}
      <div className="pt-5 md:pt-10 pb-20 bg-white/90">
        { children }
      </div>
      {/* footer */}
    </div>
  )
}
