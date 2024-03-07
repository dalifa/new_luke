import ReactivateAccount from '@/components/admin/active-account'
import AddCountry from '@/components/admin/add-country'
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

 
const Admin = async () => {
    return (
        <div className='flex w-full h-full flex-col'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-3 m-4'>
                <ReactivateAccount/>
                <UnactivateAccount/>
                <MakePartner/>
                <DontMakePartner/>
                <UpdatePartnerCredit/>
                <MaxPartnerCredit/>
                <Metric/>
                <AddCountry/>
                <EnterAmount/>
                <EnterCents/>
                <IncreaseCredit/>
                <RateCommission/>
                {/* TODO ICI UPDATE DE GROUP isolé du reste des metrics
                    On updatera metric.group, on updatant aussi group 
                    dans toutes les collectes qui auront isGroupComplete à false
                */}
            </div>
        </div>
    )
}

export default Admin
