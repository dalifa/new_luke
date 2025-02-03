
const AuthLayout = ({
    children
}:{
    children: React.ReactNode
}) => {
    // 
    return (
        /* <div className="flex justify-center items-center min-h-screen w-full bg-cover bg-fixed bg-center
        bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800"> */
        <div className="flex h-full items-center justify-center bg-blue-500">
            {children}
        </div>
    )
}

export default AuthLayout
