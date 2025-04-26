
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full bg-white">
      <main className="md:pt-10 pb-20 bg-white">
        { children }
      </main>
    </div>
  )
}
