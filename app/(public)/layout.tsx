
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex w-full h-screen flex-col pt-10 bg-white">
      { children }
    </div>
  )
}
