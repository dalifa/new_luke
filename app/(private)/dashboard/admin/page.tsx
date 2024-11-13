import ReactivateAccount from '@/components/admin/active-account'
import AddCountry from '@/components/admin/add-country'
//import AddProfileForTests from '@/components/admin/add-profile-for-tests'
import DontMakePartner from '@/components/admin/dont-make-partner'
import EnterAmount from '@/components/admin/enter-amount'
import EnterCents from '@/components/admin/enter-cents'
import IncreaseCredit from '@/components/admin/increase-credit'
import MakePartner from '@/components/admin/make-partner'
import Metric from '@/components/admin/metric-infos'
import RateCommission from '@/components/admin/rate-commission'
import UnactivateAccount from '@/components/admin/unactive-account'
import MaxPartnerCredit from '@/components/admin/update-maxpartner-credit'
import UpdatePartnerCredit from '@/components/admin/update-partner-credit'
import { ProfileForTest } from '@/components/admin/update-profile-for-test'
import { prismadb } from '@/lib/prismadb'

 
const Admin = async () => {
    // last current profile for test
    const last = await prismadb.currentProfileForTest.findFirst()
    const profiles = await prismadb.profile.findMany()
    return (
        <div className='pt-14 flex w-full h-full flex-col'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-3 m-4'>
                <div className='flex flex-col border-2 border-green-500'>
                    <p className='my-4 text-center font-medium text-xl text-green-600'>current: {last?.usercodepin}</p>
                    <p className='my-2 text-center font-medium text-xl text-blue-500'>last: {last?.lastProfile}</p>
                    <ProfileForTest collectionId={''}/> 
                </div>
                <div className='grid grid-cols-3'>
                    {
                        profiles.map((profile) =>(
                            <p key={profile?.id}>{profile?.username}</p>
                        ))
                    }
                </div>
                <ReactivateAccount/>
                <UnactivateAccount/>
                <MakePartner/>
                <RateCommission/>
                <DontMakePartner/>
                <UpdatePartnerCredit/>
                <MaxPartnerCredit/>
                <Metric/>
                <AddCountry/>
                <EnterAmount/>
                <EnterCents/>
                <IncreaseCredit/>
                
                {/* TODO ICI UPDATE DE GROUP isolé du reste des metrics
                    On updatera metric.group, on updatant aussi group 
                    dans toutes les collectes qui auront isGroupComplete à false
                */}
            </div>
        </div>
    )
}

export default Admin
