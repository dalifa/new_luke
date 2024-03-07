//
import { auth } from "@/auth";
import { ProfileForm } from "./profile-infos-form";
import { prismadb } from "@/lib/prismadb";
import { currentUserInfos } from "@/hooks/own-current-user";

// 
const CreateOrUpdateProfile = async () => {
  const session = await auth();
  const connectedUser = await currentUserInfos()
  const theCountries = await prismadb.country.findMany();

  return ( 
    // le countries ici c'est celui dans form
    <ProfileForm initialData={connectedUser} countries={theCountries}/>
  );
}

export default CreateOrUpdateProfile
