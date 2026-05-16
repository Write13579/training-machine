"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircleWarning } from "lucide-react";
import { useState } from "react";
import { zglosTrening } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ZglosBtn({ wynikId }: { wynikId: number }) {
  const [description, setDescription] = useState<string>("");
  const router = useRouter();
  return (
    <div>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button>
              <MessageCircleWarning className="text-red-500" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Zgłoś post</DialogTitle>
              <DialogDescription>
                Opisz problem, który napotkałeś. Nasz zespół rozpatrzy
                zgłoszenie i podejmie odpowiednie działania.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field className="bg-blue-400">
                <Label htmlFor="description-1">Opis zgłoszenia</Label>
                <Input
                  id="description-1"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Anuluj</Button>
              </DialogClose>
              <Button
                type="submit"
                onClick={async () => {
                  const message = await zglosTrening(wynikId, description);
                  toast(message.message);
                  setDescription("");
                  router.refresh();
                }}>
                Wyślij zgłoszenie
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}
