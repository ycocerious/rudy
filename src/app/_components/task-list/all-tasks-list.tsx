"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { theOnlyToastId } from "@/constants/uiConstants";
import { useSortedByFrequencyTasks } from "@/hooks/useSortedTasks";
import { cn } from "@/lib/utils";
import { getGridPosition } from "@/lib/utils/get-grid-position";
import { api } from "@/trpc/react";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AddOrEditTaskSheet } from "./add-or-edit-task-sheet";
import { SwipeableAllTask } from "./swipeable-all-task";
import { frequencyMapping } from "./today-tasks-list";

export const AllTasksList = () => {
  //trpc related
  const { data: tasks, isLoading } = api.task.getAllTasks.useQuery();

  const utils = api.useUtils();
  const { mutateAsync: deleteDbTask } = api.task.deleteTask.useMutation({
    onSuccess: async () => {
      // Invalidate and refetch tasks query
      await utils.task.getAllTasks.invalidate();
      toast.success("Task deleted successfully!", { id: theOnlyToastId });
    },
    onError: (error) => {
      toast.error(`Error deleting task: ${error.message}`, {
        id: theOnlyToastId,
      });
    },
  });

  //hooks
  const sortedTasks = useSortedByFrequencyTasks(tasks ?? []);

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState("");

  const dialogOpenChange = useCallback(() => {
    setIsDialogOpen(!isDialogOpen);
    setSelectedFrequency("");
  }, [isDialogOpen]);

  useEffect(() => {
    if (
      sortedTasks[selectedFrequency as keyof typeof sortedTasks] &&
      sortedTasks[selectedFrequency as keyof typeof sortedTasks].length === 0
    ) {
      dialogOpenChange();
    }
  }, [dialogOpenChange, selectedFrequency, sortedTasks]);

  //callbacks
  const deleteTask = async (id: number) => {
    const taskToDelete = tasks?.find((task) => task.id === id);

    if (taskToDelete) {
      try {
        await deleteDbTask(id);
        toast.success("Task deleted successfully!", { id: theOnlyToastId });
      } catch (error) {
        toast.error("Failed to add task", { id: theOnlyToastId });
      }
    }
  };

  const handleCardClick = (frequency: string) => {
    setSelectedFrequency(frequency);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="h-full w-full">
        {tasks?.length !== 0 ? (
          <div className="grid h-full grid-cols-2 grid-rows-2 gap-6 overflow-auto px-2 pb-8">
            {Object.entries(sortedTasks)
              .filter(([_, tasks]) => tasks.length > 0)
              .map(([frequency, tasks], index) => (
                <Card
                  key={frequency}
                  className={cn(
                    "flex max-h-[27vh] cursor-pointer items-center justify-center border-primary",
                    getGridPosition(index),
                  )}
                  onClick={() => handleCardClick(frequency)}
                >
                  <CardContent className="p-6 text-center">
                    <p className="text-lg text-primary">
                      {
                        frequencyMapping[
                          frequency as keyof typeof frequencyMapping
                        ]
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ({tasks.length} task{tasks.length > 1 ? "s" : ""})
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <div className="flex flex-grow items-center justify-center text-center">
            {isLoading
              ? "Loading..."
              : "Click the + icon to add your first task!"}
          </div>
        )}
      </div>

      <Button
        className="fixed bottom-6 right-4 z-50 h-[3.5rem] w-[3.5rem] rounded-xl bg-accent"
        onClick={() => setIsSheetOpen(true)}
      >
        <Plus size={38} className="text-accent-foreground" />
      </Button>

      <AddOrEditTaskSheet
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        taskType="add"
      />

      <Dialog open={isDialogOpen} onOpenChange={dialogOpenChange}>
        <DialogContent className="flex h-auto max-h-[75vh] min-h-[25vh] w-[90vw] max-w-none flex-col items-center justify-center overflow-y-auto rounded-md border-border bg-card px-0 pb-10 pt-14 sm:max-w-sm">
          <DialogTitle className="sr-only">
            {
              frequencyMapping[
                selectedFrequency as keyof typeof frequencyMapping
              ]
            }{" "}
            Tasks
          </DialogTitle>
          <DialogDescription className="sr-only">
            List of tasks for{" "}
            {
              frequencyMapping[
                selectedFrequency as keyof typeof frequencyMapping
              ]
            }
          </DialogDescription>

          <p className="text-md mb-1 px-2 pb-2 text-center">
            <span>
              Swipe to <span className="text-destructive">delete a task</span>,
              Tap to edit
            </span>
          </p>

          <div className="w-full px-6">
            {sortedTasks[selectedFrequency as keyof typeof sortedTasks]?.map(
              (task) => (
                <SwipeableAllTask
                  key={task.id}
                  task={task}
                  handleSwipe={() => deleteTask(task.id)}
                />
              ),
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
