"use client";

import { useRouter } from "next/navigation";
import { deleteUser } from "./adminActions";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DeleteUserComp({ userId }: { userId: number }) {
  const router = useRouter();
  return (
    // <Button
    //   onClick={async () => {
    //     await deleteUser(userId);
    //     toast("Użytkownik został usunięty");
    //     router.refresh();
    //   }}>
    //   <div className="cursor-pointer inline-flex items-center px-2 py-2 bg-black transition ease-in-out delay-75 hover:bg-[#FF4D6D] active:bg-[#C9184A] text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110">
    //     <Ban />
    //   </div>
    // </Button>

    //Kajetan zobacz sobie jak wyglada basic button (komentarz wyzej) i jak wyglada alert dialog (ponizej) zeby bylo to "are you sure" i dodaj takie alerty wszedzie gdzie sie zmienia/usuwa cos waznego (na pewno caly admin panel, moze kajs jeszcze)
    //ewentualnie daj to komus innemu do zrobienia zeby ktos mial commity, ale zeby to bylo zrobione bo to moze podbic morale xd

    <AlertDialog>
      <AlertDialogTrigger asChild>
        {/* Ikona przycisku */}
        <Button variant="outline">
          <Ban />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await deleteUser(userId);
              toast("Użytkownik został usunięty");
              router.refresh();
            }}>
            usun suke
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
