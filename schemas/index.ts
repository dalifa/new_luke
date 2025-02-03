import * as z from "zod"; 

// with server action
export const CreateProfileSchema = z.object({
  //prénoms
  firstname: z.string().toLowerCase().min(2, {
    message: "Renseignez vos prénoms."
  }),
  //nom
  lastname: z.string().toLowerCase().min(2, {
    message: "Renseignez vos Noms."
  }),
  // pseudo
  username: z.string().toLowerCase().min(2, {
    message: "Renseignez vos Noms."
  }).max(14, { message: "14 caractères au max."}),
  // phone
  phone: z.string().toLowerCase().min(10, {
    message: "Renseigner votre numéro de portable."
  }).max(10,{ message: "Dix chiffre maxi."}),
  // ville d'habitation
  city: z.string().toLowerCase().min(2,{
    message:"Votre ville d'habitation, svp"
  }),
  country: z.string().toLowerCase().min(2,{
    message:"Votre pays d'habitation, svp"
  }),
  // commentaire
  bio: z.string().toLowerCase(),
//
});