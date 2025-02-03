//
import { MetricForm } from "./metric-form";
import { prismadb } from "@/lib/prismadb";
import { CurrentProfile } from "@/hooks/own-current-user";

//  
const Metric = async () => {
  const connected = await CurrentProfile()
  //
  const metrics = await prismadb.metric.findFirst();

  return ( 
    //
    <MetricForm initialData={metrics}/>
  );
}

export default Metric