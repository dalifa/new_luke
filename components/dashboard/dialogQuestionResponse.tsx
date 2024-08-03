import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ResponseToQuestion } from "./questionResponses"

export function DialogQR() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="blue" className="w-full">Amen</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-5">
          <DialogTitle className="text-center">Confirmation</DialogTitle>
        </DialogHeader>
        <ResponseToQuestion/>
      </DialogContent>
    </Dialog>
  )
}
