//
import { auth } from "@/auth";
import { prismadb } from "@/lib/prismadb";
import { currentUserInfos } from "@/hooks/own-current-user";
import { ProfileInfosForm } from "./profile-infos-form";

//  
const CreateOrUpdateProfile = async () => {
  const session = await auth();
  const connectedUser = await currentUserInfos()
  const theCountries = await prismadb.country.findMany();

  return ( 
    // le countries ici c'est celui dans form
    <ProfileInfosForm initialData={connectedUser} countries={theCountries}/>
  );
}

export default CreateOrUpdateProfile
