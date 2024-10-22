'use client'

import { updateProject } from "@/actions/enter/update-project-action"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function MyProjectForm({ collectionId }: { collectionId: string }) {
  const updateProjectWithId = updateProject.bind(null, collectionId)
 
  return (
    <form action={updateProjectWithId} className="flex flex-col gap-y-5 mt-5">
      <Textarea name="project" placeholder="Ex: achat de billet de train" className="h-14 bg-violet-200 rounded" />
      <Button variant={"violet"} className="h-14">Enregistrer</Button>
    </form>
  )
}