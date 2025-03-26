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
  //
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

  return (
    <Card className="bg-white shadow-blue-100 shadow-md p-4">
      <p className="text-center mb-4 font-semibold text-slate-600 text-xl lg:text-lg">
        BÉNIR  
      </p>
      <hr className="w-full mb-2" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        {one && metric && countOne >= metric?.maxDisplays ? (
          <AmountOneDialog amountId={ one?.id }/>
        ):(
        <Button variant="blue" className="bg-blue-300">
          5€
        </Button>
        )}
        {two && metric && countTwo >= metric?.maxDisplays ? (
          <AmountTwoDialog params={{ amountId: two?.id }}/>
        ):(
        <Button variant="blue" className="bg-blue-300">
          10€
        </Button>
        )}
        {three && metric && countThree >= metric?.maxDisplays ? (
          <AmountThreeDialog params={{ amountId: three?.id }}/>
        ):(
        <Button variant="blue" className="bg-blue-300">
          20€
        </Button>
        )}
        {four && metric && countFour >= metric?.maxDisplays ? (
          <AmountFourDialog params={{ amountId: four?.id }}/>
        ):(
        <Button variant="blue" className="bg-blue-300">
          50€
        </Button>
        )}
        {five && metric && countFive >= metric?.maxDisplays ? (
          <AmountFiveDialog params={{ amountId: five?.id }}/>
        ):(
        <Button variant="blue" className="bg-blue-300">
          100€
        </Button>
        )}
        {six && metric && countSix >= metric?.maxDisplays ? (
          <AmountSixDialog params={{ amountId: six?.id }}/>
        ):(
        <Button variant="blue" className="bg-blue-300">
          200€
        </Button>
        )}
      </div>
    </Card>
  );
};

export default ToBless;

// ###
/*
*/