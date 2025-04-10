'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { decreaseMaxDisplays, increaseMaxDisplays } from '@/actions/admin/update-max-displays';

export function UpdateMaxDisplays() {
  const [openDecrease, setOpenDecrease] = useState(false);
  const [openIncrease, setOpenIncrease] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDecrease = () => {
    startTransition(async () => {
      await decreaseMaxDisplays();
      setOpenDecrease(false);
    });
  };

  const handleIncrease = () => {
    startTransition(async () => {
      await increaseMaxDisplays();
      setOpenIncrease(false);
    });
  };

  return (
    <div className="flex gap-4">
      {/* Decrease Button */}
      <Dialog open={openDecrease} onOpenChange={setOpenDecrease}>
        <DialogTrigger asChild>
          <Button variant="blue">Decrease</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className='text-center text-xl text-blue-500'>Diminuer</DialogTitle>
            <DialogDescription className='text-center text-lg'>
              Voulez-vous vraiment diminuer la capacité max ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDecrease}
              disabled={isPending}
            >
              {isPending ? "En cours..." : "Diminuer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Increase Button */}
      <Dialog open={openIncrease} onOpenChange={setOpenIncrease}>
        <DialogTrigger asChild>
          <Button variant="success">Increase</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className='text-center text-xl text-green-600'>Augmenter</DialogTitle>
            <DialogDescription className='text-center text-lg'>
              Voulez-vous vraiment augmenter la capacité max ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button
              type="button"
              variant="blue"
              onClick={handleIncrease}
              disabled={isPending}
            >
              {isPending ? "En cours..." : "Augmenter"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}



