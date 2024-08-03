import BackButton from "./backButton"
import { PublicSheet } from "./public-sheet"

const PublicTopbar = () => {

  return (
    <div className="flex flex-row fixed top-0 left-0 z-20 bg-blue-500 text-white w-full h-10 lg:h-14 items-center justify-between px-4 lg:px-8">
      <div>
        <BackButton/>
      </div>
      <div>
        <p>LUKE 6:38</p>
      </div>
      <div>
        <PublicSheet/>
      </div>
    </div>
  )
}

export default PublicTopbar
