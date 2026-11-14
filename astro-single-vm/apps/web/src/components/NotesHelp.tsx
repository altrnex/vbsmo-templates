import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function NotesHelp() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">About notes</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your notes</DialogTitle>
          <DialogDescription>
            Save a note below. Your notes stay here when you reload.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
