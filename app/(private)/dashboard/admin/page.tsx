//
import { CurrentProfile } from '@/hooks/own-current-user'
// 
const Admin = async () => {
  //
  const connected = CurrentProfile()
  //
  return (
    <div className='pt-14 flex w-full h-full flex-col'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-3 m-4'>
        <p>TODO:</p>
        <p>augmenter le credit par id</p>
        <p>duminuer le credit par id</p>
        <p>augmenter le jackpot par id</p>
        <p>duminuer le jackpot par id</p>
        <p>faire devenir partenaire</p>
        <p>faire ne plus être partenaire</p>
        <p>activer un compte par id </p>
        <p>inactiver un compte par id</p>
      </div>
    </div>
  )
}
//
export default Admin
