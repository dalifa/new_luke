// page tobless
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prismadb } from "@/lib/prismadb";
import { AmountFive, AmountFour, AmountOne, AmountSix, AmountThree, AmountTwo, CurrentProfile } from "@/hooks/own-current-user";
import AmountOneDialog from "./amountForm/amountOneDialog";
import AmountTwoDialog from "./amountForm/amountTwoDialog";
import AmountFourDialog from "./amountForm/amountFourDialog";
import AmountFiveDialog from "./amountForm/amountFiveDialog";
import AmountSixDialog from "./amountForm/amountSixDialog";
import AmountThreeDialog from "./amountForm/amountThreeDialog";

export const ToBless = async () => {
  const connected = await CurrentProfile();
  // VÉRIFICATION DE L'ABONNEMENT DU CONNECTÉ
  const subscription = await prismadb.subscription.findFirst({
    where: {
      codepin: connected?.codepin
    }
  })
  //
  const metric = await prismadb.metric.findFirst({
    select: { maxDisplays: true }
  })
  // 
  const one = await AmountOne()
  const two = await AmountTwo()
  const three = await AmountThree()
  const four = await AmountFour()
  const five = await AmountFive()
  const six = await AmountSix()
  // on vérifie s'il y a un ou autant de profile  à qui
  // le connecté peut donné parce qu'ils ne se sont jamais rencontré
  const countOne = await prismadb.canBeBlessed.count({
    where: {
      canBeDisplayed: true,
      amountId: one?.id,
      profileId: { not: connected?.id },
      profile: {
        NOT: {
          OR: [
            { metProfiles: { some: { profileMetId: connected?.id } } },
            { metByProfiles: { some: { profileId: connected?.id } } },
          ],
        },
      },
    },
  });
  //
  const countTwo = await prismadb.canBeBlessed.count({
    where: {
      canBeDisplayed: true,
      amountId: two?.id,
      profileId: { not: connected?.id },
      profile: {
        NOT: {
          OR: [
            { metProfiles: { some: { profileMetId: connected?.id } } },
            { metByProfiles: { some: { profileId: connected?.id } } },
          ],
        },
      },
    },
  });
  //
  const countThree = await prismadb.canBeBlessed.count({
    where: {
      canBeDisplayed: true,
      amountId: three?.id,
      profileId: { not: connected?.id },
      profile: {
        NOT: {
          OR: [
            { metProfiles: { some: { profileMetId: connected?.id } } },
            { metByProfiles: { some: { profileId: connected?.id } } },
          ],
        },
      },
    },
  });
  //
  const countFour = await prismadb.canBeBlessed.count({
    where: {
      canBeDisplayed: true,
      amountId: four?.id,
      profileId: { not: connected?.id },
      profile: {
        NOT: {
          OR: [
            { metProfiles: { some: { profileMetId: connected?.id } } },
            { metByProfiles: { some: { profileId: connected?.id } } },
          ],
        },
      },
    },
  });
  //
  const countFive = await prismadb.canBeBlessed.count({
    where: {
      canBeDisplayed: true,
      amountId: four?.id,
      profileId: { not: connected?.id },
      profile: {
        NOT: {
          OR: [
            { metProfiles: { some: { profileMetId: connected?.id } } },
            { metByProfiles: { some: { profileId: connected?.id } } },
          ],
        },
      },
    },
  });
  //
  const countSix = await prismadb.canBeBlessed.count({
    where: {
      canBeDisplayed: true,
      amountId: six?.id,
      profileId: { not: connected?.id },
      profile: {
        NOT: {
          OR: [
            { metProfiles: { some: { profileMetId: connected?.id } } },
            { metByProfiles: { some: { profileId: connected?.id } } },
          ],
        },
      },
    },
  });
  // on vérifie que le conncté n'a pas de bless non confirmé par un destinataire
  // ex: il ne peut pas redonner 5€ s'il en a déjà donné et que le destinataire
  // n'a toujours pas validé avoir reçu le wero.
  const lastOneBlessCount = await prismadb.myListToBless.count({
    where: {
      donorId: connected?.id,
      amountId: one?.id,
      isRecipientChosen: true,
      recipientValidation: false
    }
  })
  //
  const lastTwoBlessCount = await prismadb.myListToBless.count({
    where: {
      donorId: connected?.id,
      amountId: two?.id,
      isRecipientChosen: true,
      recipientValidation: false
    }
  })
  //
  const lastThreeBlessCount = await prismadb.myListToBless.count({
    where: {
      donorId: connected?.id,
      amountId: three?.id,
      isRecipientChosen: true,
      recipientValidation: false
    }
  })
  //
  const lastFourBlessCount = await prismadb.myListToBless.count({
    where: {
      donorId: connected?.id,
      amountId: four?.id,
      isRecipientChosen: true,
      recipientValidation: false
    }
  })
  // 
  const lastFiveBlessCount = await prismadb.myListToBless.count({
    where: {
      donorId: connected?.id,
      amountId: five?.id,
      isRecipientChosen: true,
      recipientValidation: false
    }
  })
  // 
  const lastSixBlessCount = await prismadb.myListToBless.count({
    where: {
      donorId: connected?.id,
      amountId: six?.id,
      isRecipientChosen: true,
      recipientValidation: false
    }
  })
  //

  return (
    <Card className="bg-white shadow-xl p-6 rounded-lg">
      <p className="text-center text-xl font-semibold text-gray-700 mb-4">
        BÉNIR  
      </p>
      <hr className="border-t border-gray-300 mb-4" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {one && metric && countOne >= metric?.maxDisplays && lastOneBlessCount < 1 && subscription?.remainingDays !== 0 ? (
          <AmountOneDialog amountId={ one?.id }/>
        ):(
        <Button variant="blue" className="bg-indigo-400">
           
        </Button>
        )}
        {two && metric && countTwo >= metric?.maxDisplays && lastTwoBlessCount < 1 && subscription?.remainingDays !== 0 ? (
          <AmountTwoDialog amountId={ two?.id }/>
        ):(
        <Button variant="blue" className="bg-indigo-400">
          10€
        </Button>
        )}
        {three && metric && countThree >= metric?.maxDisplays && lastThreeBlessCount < 1 && subscription?.remainingDays !== 0 ? (
          <AmountThreeDialog amountId={ three?.id }/>
        ):(
        <Button variant="blue" className="bg-indigo-400">
          20€
        </Button>
        )}
        
        {four && metric && countFour >= metric?.maxDisplays && lastFourBlessCount < 1 && subscription?.remainingDays !== 0 ? (
          <AmountFourDialog amountId={ four?.id }/>
        ):(
        <Button variant="blue" className="bg-indigo-400">
          50€
        </Button>
        )}
        {five && metric && countFive >= metric?.maxDisplays && lastFiveBlessCount < 1 && subscription?.remainingDays !== 0 ? (
          <AmountFiveDialog amountId={ five?.id }/>
        ):(
        <Button variant="blue" className="bg-indigo-400">
          100€
        </Button>
        )}
        {six && metric && countSix >= metric?.maxDisplays && lastSixBlessCount < 1 && subscription?.remainingDays !== 0 ? (
          <AmountSixDialog amountId={ six?.id }/>
        ):(
        <Button variant="blue" className="bg-indigo-400">
          200€
        </Button>
        )}  {/*  */}
      </div> 
    </Card>
  );
};

export default ToBless;

// ###
/*
*/