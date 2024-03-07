//
import { auth } from "@/auth";
import { MetricForm } from "./metric-form";
import { prismadb } from "@/lib/prismadb";
import { currentUserInfos } from "@/hooks/own-current-user";

//  
const Metric = async () => {
  const connectedUser = await currentUserInfos()
  //
  const metrics = await prismadb.metric.findFirst();

  return ( 
    //
    <MetricForm initialData={metrics}/>
  );
}

export default Metric