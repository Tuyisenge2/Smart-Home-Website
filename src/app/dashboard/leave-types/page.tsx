"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { fetchLeavesType } from "@/store/slices/fetchLeaveTypeSlice";
import useToast from "@/hooks/useToast";
import { JwtService } from "@/services/jwtService";
import { useRouter } from "next/navigation";
import API from "@/utils/Api";
import { LeaveTypeDialog } from "./leave-type-dialog";

export default function LeaveTypes() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const { data: leaveTypes, isLoading } = useAppSelector(
    (state) => state.fetchLeavesType
  );

  useEffect(() => {
    if (leaveTypes.length === 0) {
      dispatch(fetchLeavesType());
    }
  }, [dispatch, router]);

  const [selectedLeaveType, setSelectedLeaveType] = useState<any>(null);

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/leave-types/${id}`);
      showSuccess("Leave type deleted successfully!");
      dispatch(fetchLeavesType());
    } catch (error: any) {
      showError(error.message || "Failed to delete leave type");
    }
  };

  const handleEdit = (leaveType: any) => {
    setSelectedLeaveType(leaveType);
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-[calc(100vh-200px)]'>
        <div className='flex flex-col items-center gap-4'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
          <p className='text-muted-foreground'>Loading leave types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-6'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Leave Types</CardTitle>
          <LeaveTypeDialog
            mode='add'
            trigger={
              <Button className='flex items-center gap-2'>
                <Plus className='h-4 w-4' />
                Add Leave Type
              </Button>
            }
          />
        </CardHeader>
        <CardContent>
          {leaveTypes.length === 0 && isLoading == false ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <div className='rounded-full bg-muted p-3 mb-4'>
                <Plus className='h-6 w-6 text-muted-foreground' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>
                No Leave Types Found
              </h3>
              <p className='text-muted-foreground mb-4'>
                Get started by adding your first leave type.
              </p>
              <LeaveTypeDialog
                mode='add'
                trigger={
                  <Button className='flex items-center gap-2'>
                    <Plus className='h-4 w-4' />
                    Add Leave Type
                  </Button>
                }
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveTypes[leaveTypes.length - 1].data.map(
                  (leaveType: any) => (
                    <TableRow key={leaveType.id}>
                      <TableCell>{leaveType.name}</TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <LeaveTypeDialog
                            mode='edit'
                            leaveType={leaveType}
                            trigger={
                              <Button variant='ghost' size='icon'>
                                <Pencil className='h-4 w-4' />
                              </Button>
                            }
                          />
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleDelete(leaveType.id)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
