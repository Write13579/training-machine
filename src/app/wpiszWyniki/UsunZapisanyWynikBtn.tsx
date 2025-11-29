import { Button } from "@/components/ui/button";
import { usunZapisanyWynik } from "./actions";
import { toast } from "sonner";
import { Trash } from "lucide-react";

export default function UsunZapisanyWynikBtn({ id }: { id: number }) {
  return (
    <Button
      className="border-2 cursor-pointer bg-amber-800"
      onClick={async () => {
        const result = await usunZapisanyWynik(id);
        toast(result);
      }}>
      <Trash color="red" />
    </Button>
  );
}
