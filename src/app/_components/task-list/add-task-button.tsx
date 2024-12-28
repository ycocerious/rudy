import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const AddTaskButton = ({
  setIsSheetOpen,
}: {
  setIsSheetOpen: (open: boolean) => void;
}) => {
  return (
    <Button
      className="fixed bottom-6 right-4 z-50 h-[3.5rem] w-[3.5rem] rounded-xl bg-accent"
      onClick={() => setIsSheetOpen(true)}
    >
      <Plus size={38} className="text-accent-foreground" />
    </Button>
  );
};
