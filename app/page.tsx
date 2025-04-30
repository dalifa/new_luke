import Showroom from "@/components/public/showroom";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <Showroom/>
    </Suspense>
  );
}
