import { CreateProfile } from '@/components/dashboard/profile/profileCreationForm'
import React from 'react'

const profileCreation = async () => {
  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <CreateProfile/> 
    </div>
  )
}
//
export default profileCreation
