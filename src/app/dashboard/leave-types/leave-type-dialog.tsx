"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import API from "@/utils/Api";
import useToast from "@/hooks/useToast";
import { useAppDispatch } from "@/store/hooks";
import { fetchLeavesType } from "@/store/slices/fetchLeaveTypeSlice";

const leaveTypeFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type LeaveTypeFormData = z.infer<typeof leaveTypeFormSchema>;

interface LeaveTypeDialogProps {
  mode: "add" | "edit";
  leaveType?: {
    id: string;
    name: string;
  };
  trigger?: React.ReactNode;
}

export function LeaveTypeDialog({
  mode,
  leaveType,
  trigger,
}: LeaveTypeDialogProps) {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();

  const form = useForm<LeaveTypeFormData>({
    resolver: zodResolver(leaveTypeFormSchema),
    defaultValues: {
      name: leaveType?.name || "",
    },
  });

  const onSubmit = async (data: LeaveTypeFormData) => {
    try {
      if (mode === "add") {
        await API.post("/leave-types", data);
        showSuccess("Leave type added successfully!");
      } else {
        await API.put(`/leave-types/${leaveType?.id}`, data);
        showSuccess("Leave type updated successfully!");
      }
      dispatch(fetchLeavesType());
      setOpen(false);
      form.reset();
    } catch (error: any) {
      showError(
        error.message || `Failed to ${mode} leave type. Please try again.`
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant='outline'>
            {mode === "add" ? "Add Leave Type" : "Edit Leave Type"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] bg-white shadow-lg rounded-lg border border-border'>
        <DialogHeader className='border-b pb-4'>
          <DialogTitle className='text-xl font-semibold text-gray-900'>
            {mode === "add" ? "Add New Leave Type" : "Edit Leave Type"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6 pt-6'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium text-gray-700'>
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter leave type name'
                      {...field}
                      className='h-10 bg-white border-gray-200 focus:border-primary'
                    />
                  </FormControl>
                  <FormMessage className='text-xs text-red-500' />
                </FormItem>
              )}
            />
            <div className='flex justify-end gap-3 pt-4 border-t'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
                className='h-10 px-4 border-gray-200 hover:bg-gray-50 '
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='h-10 px-4 bg-primary hover:bg-primary/90 bg-blue-500 text-white'
              >
                {mode === "add" ? "Add Leave Type" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
