
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full bg-white">
      {/* nav */}
      <div className="pt-2 pb-20 bg-white">
        { children }
      </div>
      {/* footer */}
    </div>
  )
}
