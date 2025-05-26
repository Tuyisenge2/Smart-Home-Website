"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { fetchLeaves } from "@/store/slices/fetchleaveSlice";
import { fetchUsers } from "@/store/slices/fetchUsersSlice";
import { JwtService } from "@/services/jwtService";

interface LeaveRecord {
  id: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: "Approved" | "Pending" | "Rejected";
  profileImage?: string;
}

export default function ColleaguesOnLeave() {
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, data, error } = useAppSelector(
    (state) => state.fetchLeave
  );
  const {
    isLoading: isLoadingUsers,
    data: dataUsers,
    error: errorUsers,
  } = useAppSelector((state) => state.fetchUsers);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      const userData = JwtService.getTokenData(token);
      setCurrentUserEmail(userData?.email || "");
    }
  }, []);

  useEffect(() => {
    try {
      if (dataUsers.length === 0) {
        dispatch(fetchUsers()).unwrap();
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    try {
      if (data.length === 0) {
        dispatch(fetchLeaves()).unwrap();
      }
    } catch (error) {}
  }, []);

  const getAPPROVEDLeaveDays = (leavesData: Array<any>) => {
    if (
      leavesData?.length > 0 &&
      Array.isArray(leavesData[leavesData?.length - 1])
    ) {
      const latestLeaves = leavesData[leavesData.length - 1];
      return (
        latestLeaves?.filter(
          (leave: any) =>
            leave?.status === "APPROVED" && leave?.email !== currentUserEmail
        ) || []
      );
    }
    return (
      leavesData?.filter(
        (leave: any) =>
          leave?.status === "APPROVED" && leave?.email !== currentUserEmail
      ) || []
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className='bg-green-500'>APPROVED</Badge>;
      case "PENDING":
        return <Badge className='bg-yellow-500'>PENDING</Badge>;
      case "REJECTED":
        return <Badge className='bg-red-500'>REJECTED</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getProfilePictureForLeave = (leaveEmail: string, users: any[]) => {
    const user = users?.find((user) => user?.email === leaveEmail);
    return user?.picture || "https://via.placeholder.com/150";
  };

  const approvedLeaves =
    data?.length > 0 ? getAPPROVEDLeaveDays(data[data?.length - 1]?.data) : [];

  return (
    <div className='container mx-auto py-6'>
      <Card>
        <CardHeader>
          <CardTitle>Colleagues on Leave</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex justify-center items-center h-64'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
            </div>
          ) : (
            <>
              {approvedLeaves.length === 0 ? (
                <p className='text-center text-gray-500 py-8'>
                  No colleagues are currently on leave
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedLeaves.map((leave: any) => (
                      <TableRow key={leave.id}>
                        <TableCell>
                          <div className='flex items-center gap-3'>
                            <Avatar
                              src={getProfilePictureForLeave(
                                leave.email,
                                dataUsers[dataUsers?.length - 1]?.data
                              )}
                              alt={leave.email}
                            />
                            <span className='font-medium'>{leave.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{leave.leaveTypeId}</TableCell>
                        <TableCell>
                          {format(new Date(leave.start_date), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          {format(new Date(leave.end_date), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>{getStatusBadge(leave.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
