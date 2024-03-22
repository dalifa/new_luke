//
import { auth } from "@/auth";
import { prismadb } from "@/lib/prismadb";
import { currentUserInfos } from "@/hooks/own-current-user";
import { ProjectToFinanceForm } from "./object-to-finance-form";

//  
const AddObjectToFinance = async () => {
  const session = await auth();
  const connectedUser = await currentUserInfos()
  const myObjects = await prismadb.myObject.findFirst({
    where: {usercodepin: connectedUser?.usercodepin}
  })
  const allObjects = await prismadb.toFinance.findMany();

  return ( 
    // le objectToFinances ici c'est celui dans form
    <ProjectToFinanceForm initialData={myObjects} objectToFinances={allObjects}/>
  );
}

export default AddObjectToFinance
