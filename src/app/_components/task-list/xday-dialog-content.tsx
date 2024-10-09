import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Dispatch, type SetStateAction } from "react";

type XdayDialogContentProps = {
  newRepeatValue: string | null;
  setNewRepeatValue: Dispatch<SetStateAction<string | null>>;
};

export const XdayDialogContent = ({
  newRepeatValue,
  setNewRepeatValue,
}: XdayDialogContentProps) => {
  return (
    <Select
      onValueChange={(value) => setNewRepeatValue(value)}
      value={newRepeatValue ?? undefined}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select value of x" />
      </SelectTrigger>
      <SelectContent>
        {["2", "3", "4", "5", "6"].map((day) => (
          <SelectItem key={day} value={day}>
            {day}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};