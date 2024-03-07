import { auth } from "@/auth";
import { prismadb } from "@/lib/prismadb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Amount1TotalityButton } from "./amount1totality";
import { Amount2TotalityButton } from "./amount2totality";
import { Amount3TotalityButton } from "./amount3totality";
import { Amount4TotalityButton } from "./amount4totality";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { currentUserInfos } from "@/hooks/own-current-user";
import { AlertTriangle } from "lucide-react";

export async function CollectionEnter() {
    //  
    const metrics = await prismadb.metric.findFirst()
    //
    const connectedProfile = await currentUserInfos()
    // on select les sommes selon la monnaie du connecté
    // somme 1
    const myAmountOne = await prismadb.amount.findFirst({
        where: { 
            currency: connectedProfile?.currency,
            rank: "one"
        }
    })
    // somme 2
    const myAmountTwo = await prismadb.amount.findFirst({
        where: { 
            currency: connectedProfile?.currency,
            rank: "two"
        }
    })
    // somme 3
    const myAmountThree = await prismadb.amount.findFirst({
        where: { 
            currency: connectedProfile?.currency,
            rank: "three"
        }
    })
    // somme 4 
    const myAmountFour = await prismadb.amount.findFirst({
        where: { 
            currency: connectedProfile?.currency,
            rank: "four"
        }
    })
    //
    // #### verifier s'il est déjà dans une collecte amount One ouverte
    const inAmountOneCollection = await prismadb.collection.count({
        where: {
            amount: myAmountOne?.amount,
            currency: myAmountOne?.currency,
            collectionType: "snippet",
            email: connectedProfile?.googleEmail,  // prod
            usercodepin: connectedProfile?.usercodepin,
            isGroupComplete: false
        }
    })
    // #### verifier s'il est déjà dans une collecte amount Two ouverte
    const inAmountTwoCollection = await prismadb.collection.count({
        where: {
            amount: myAmountTwo?.amount,
            currency: myAmountTwo?.currency,
            collectionType: "snippet",
            email: connectedProfile?.googleEmail,  // prod
            usercodepin: connectedProfile?.usercodepin,
            isGroupComplete: false
        }
    })
    // #### verifier s'il est déjà dans une collecte amount three ouverte
    const inAmountThreeCollection = await prismadb.collection.count({
        where: {
            amount: myAmountThree?.amount,
            currency: myAmountThree?.currency,
            collectionType: "snippet",
            email: connectedProfile?.googleEmail,  // prod
            usercodepin: connectedProfile?.usercodepin,
            isGroupComplete: false
        }
    })
    // #### verifier s'il est déjà dans une collecte amount four ouverte
    const inAmountFourCollection = await prismadb.collection.count({
        where: {
            amount: myAmountFour?.amount,
            currency: myAmountFour?.currency,
            collectionType: "snippet",
            email: connectedProfile?.googleEmail,  // prod
            usercodepin: connectedProfile?.usercodepin,
            isGroupComplete: false
        }
    })
    // 
    return(
        <Tabs defaultValue="snippet" className="w-full">
            <TabsList className="grid grid-cols-2 gap-x-2 text-slate-500">
                <TabsTrigger value="snippet" className="hover:bg-blue-50">Snippet</TabsTrigger>
                <TabsTrigger value="totality" className="hover:bg-blue-50">Totality</TabsTrigger>
            </TabsList>
            <TabsContent value="snippet">
                <Card>
                    <CardHeader className="text-slate-500 text-center">
                        <CardDescription>
                            Recevoir des fragments de cagnotte.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-center">
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">  
                            {
                            // Prod  
                                // credit exist? and currency of amount one exist ? and credit >= than currency amount one ? =>
                                connectedProfile?.credit && myAmountOne?.amount && connectedProfile.credit >= myAmountOne.amount ?(
                                    <div>
                                        {   // s'il n'est pas déjà dans une collecte dont le group n'est pas complet
                                            inAmountOneCollection == 0 ? (
                                                <Link href={"/dashboard/confirmEnterAmountOne"}>
                                                    <Button variant={"blue"} className="w-full">
                                                       {myAmountOne?.amount}{myAmountOne?.currency}
                                                    </Button>
                                                </Link>
                                            ):( // s'il est déjà dans une collecte dont group est ouvert
                                            <Button variant={"blue"} disabled className="w-full">
                                                {myAmountOne?.amount}{myAmountOne?.currency}
                                            </Button>
                                            )
                                        }
                                    </div>
                                ):(
                                    <div>
                                        <Button variant={"blue"} disabled className="w-full">
                                            {myAmountOne?.amount}{myAmountOne?.currency}
                                        </Button>
                                    </div>
                                )
                            }
                            {/* end */}
                            {/* amount two */}
                            {
                                // credit exist? and currency of amount one exist ? and credit >= than currency amount two ? =>
                                connectedProfile?.credit && myAmountTwo?.amount && connectedProfile.credit >= myAmountTwo.amount ?(
                                    <div>
                                        {   // s'il n'est pas déjà dans une collecte dont group est ouvert
                                            inAmountTwoCollection == 0 ? (
                                                <Link href={"/dashboard/confirmEnterAmountTwo"}>
                                                    <Button variant={"blue"} className="w-full">
                                                       {myAmountTwo?.amount}{myAmountTwo?.currency}
                                                    </Button>
                                                </Link> 
                                            ):( // s'il est déjà dans une collecte dont group est ouvert
                                              <Button variant={"blue"} disabled className="w-full">
                                                {myAmountTwo?.amount}{myAmountTwo?.currency}
                                              </Button>
                                            )
                                        }
                                    </div>
                                ):(
                                    <div>
                                        <Button variant={"blue"} disabled className="w-full">
                                            {myAmountTwo?.amount}{myAmountTwo?.currency}
                                        </Button>
                                    </div>
                                )
                            }
                            {/* amount three */}
                            {
                                // credit exist? and currency of amount one exist ? and credit >= than currency amount one ? =>
                                connectedProfile?.credit && myAmountThree?.amount && connectedProfile.credit >= myAmountThree.amount ?(
                                    <div>
                                        {   // s'il n'est pas déjà dans une collecte dont group est ouvert
                                            inAmountThreeCollection == 0 ? (
                                                <Link href={"/dashboard/confirmEnterAmountThree"}>
                                                    <Button variant={"blue"} className="w-full">
                                                       {myAmountThree?.amount}{myAmountThree?.currency}
                                                    </Button>
                                                </Link>
                                            ):( // s'il est déjà dans une collecte dont group est ouvert
                                              <Button variant={"blue"} disabled className="w-full">
                                                {myAmountThree?.amount}{myAmountThree?.currency}
                                              </Button>
                                            )
                                        }
                                    </div>
                                ):(
                                    <div>
                                        <Button variant={"blue"} disabled className="w-full">
                                            {myAmountThree?.amount}{myAmountThree?.currency}
                                        </Button>
                                    </div>
                                )
                            }
                            {/* amount four*/}
                            {
                                // credit exist? and currency of amount one exist ? and credit >= than currency amount one ? =>
                                connectedProfile?.credit && myAmountFour?.amount && connectedProfile.credit >= myAmountFour.amount ?(
                                    <div>
                                        {   // s'il n'est pas déjà dans une collecte dont group est ouvert
                                            inAmountFourCollection == 0 ? (
                                                <Link href={"/dashboard/confirmEnterAmountFour"}>
                                                    <Button variant={"blue"} className="w-full">
                                                       {myAmountFour?.amount}{myAmountFour?.currency}
                                                    </Button>
                                                </Link>
                                            ):( // s'il est déjà dans une collecte dont group est ouvert
                                              <Button variant={"blue"} disabled className="w-full">
                                                {myAmountFour?.amount}{myAmountFour?.currency}
                                              </Button>
                                            )
                                        }
                                    </div>
                                ):(
                                    <div>
                                        <Button variant={"blue"} disabled className="w-full">
                                            {myAmountFour?.amount}{myAmountFour?.currency}
                                        </Button>
                                    </div>
                                )
                            }

                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="totality">
                <Card>
                    <CardHeader className="text-slate-500">
                        <CardDescription>
                            Un seul reçoit toute la cagnotte
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {/* <div className="grid grid-cols-2 gap-2">
                            {
                                // credit exist? and currency of amount one exist ? and credit >= than currency amount one ? =>
                                connectedProfile?.credit && myAmountOne?.amount && connectedProfile.credit >= myAmountOne.amount ?(
                                    <Amount1TotalityButton>
                                        <p><span>{myAmountOne?.amount}{myAmountOne?.currency}</span></p>
                                    </Amount1TotalityButton>
                                ):(
                                    <div className="cursor-pointer bg-blue-600 text-white text-center rounded p-1 md:p-2 hover:bg-orange-500">
                                    <p>
                                        {
                                        myAmountOne?.amount && (
                                            <span>
                                                {myAmountOne.amount}{myAmountOne.currency}
                                            </span>
                                        ) 
                                        }
                                    </p>
                                    </div>
                                )
                            }
                            {
                                // credit exist? and currency of amount one exist ? and credit >= than currency amount one ? =>
                                connectedProfile?.credit && myAmountTwo?.amount && connectedProfile.credit >= myAmountTwo?.amount ?(
                                    <Amount2TotalityButton>
                                        <p><span>{myAmountTwo?.amount}{myAmountTwo?.currency}</span></p>
                                    </Amount2TotalityButton>
                                ):(
                                    <div className="cursor-pointer bg-blue-600 text-white text-center rounded p-1 md:p-2 hover:bg-orange-500">
                                    <p>
                                        {
                                        myAmountTwo?.amount && (
                                            <span>
                                                {myAmountTwo.amount}{myAmountTwo.currency}
                                            </span>
                                        ) 
                                        }
                                    </p>
                                    </div>
                                )
                            }
                            {
                                // credit exist? and currency of amount one exist ? and credit >= than currency amount one ? =>
                                connectedProfile?.credit && myAmountThree?.amount && connectedProfile.credit >= myAmountThree?.amount ?(
                                    <Amount3TotalityButton>
                                        <p><span>{myAmountThree?.amount}{myAmountThree?.currency}</span></p>
                                    </Amount3TotalityButton>
                                ):(
                                    <div className="cursor-pointer bg-blue-600 text-white text-center rounded p-1 md:p-2 hover:bg-orange-500">
                                    <p>
                                        {
                                        myAmountThree?.amount && (
                                            <span>
                                                {myAmountThree.amount}{myAmountThree.currency}
                                            </span>
                                        ) 
                                        }
                                    </p>
                                    </div>
                                )
                            }
                            {
                                // credit exist? and currency of amount one exist ? and credit >= than currency amount one ? =>
                                connectedProfile?.credit && myAmountFour?.amount && connectedProfile.credit >= myAmountFour?.amount ?(
                                    <Amount4TotalityButton>
                                        <p><span>{myAmountFour?.amount}{myAmountFour?.currency}</span></p>
                                    </Amount4TotalityButton>
                                ):(
                                    <div className="cursor-pointer bg-blue-600 text-white text-center rounded p-1 md:p-2 hover:bg-orange-500">
                                    <p>
                                        {
                                        myAmountFour?.amount && (
                                            <span>
                                                {myAmountFour.amount}{myAmountFour.currency}
                                            </span>
                                        ) 
                                        }
                                    </p>
                                    </div>
                                )
                            }
                        </div> */}
                        {/* CECI EST PROVISOIRE */}
                        <div className="flex flex-col items-center gap-y-2">
                        <p className="text-orange-600 text-2xl text-center">
                            <AlertTriangle/>
                        </p>
                        <p className="text-blue-800 text-justify">L'option Totality n&apos;est pas pour l&apos;instant fonctionnelle.</p>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}

