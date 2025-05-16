'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { canbedisplayedTest } from '@/actions/admin/canbedisplayTest'
//
export function AdminManagerCanBeDisplayed() {
  const [codepin, setCodepin] =  useState<number | ''>('')
  const [amount, setAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Assurer que codepin est bien un entier
    if (typeof codepin === 'number' && !isNaN(codepin)) {
      const response = await canbedisplayedTest(codepin, amount)

      if (response?.error) {
        setMessage(response.error)
      } else {
        setMessage('Can be displayed Add ✅')
      }
    } else {
      setMessage('Veuillez entrer un codepin valide')
    }
    /*const response = await updateSubscription(codepin, daysToAdd)

    if (response?.error) {
      setMessage(response.error)
    } else {
      setMessage('Abonnement mis à jour ✅')
    } */

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">Can Be Displayer Test</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className='text-center text-xl text-indigo-600'>create can be displayed test</DialogTitle>
          <DialogDescription className='text-center text-lg'>
            add member 
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto flex flex-col gap-4 bg-white rounded shadow">
            <Input
              type="number"
              placeholder="Codepin"
              value={codepin}
              onChange={(e) => setCodepin(Number(e.target.value))}
              className='text-xl text-center'
              required
            />
            <Input
              type="number"
              placeholder="Nombre de jours à ajouter"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              className='text-xl text-center'
              required
            />
            <Button type="submit" disabled={loading} variant={"primary"} className='text-xl font-medium'>
              {loading ? 'Mise à jour...' : 'Ajouter member'}
            </Button>
            {message && <p className="text-center text-sm text-green-600 mt-2">{message}</p>}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
