"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import { fetchLeaves } from "@/store/slices/fetchleaveSlice";
import useToast from "@/hooks/useToast";
import { JwtService } from "@/services/jwtService";
import { useRouter } from "next/navigation";
import { approveLeave } from "@/store/slices/leaveApprovalSlice";
import { sendEmail } from "@/app/lib/send-email";
import HTML_TEMPLATE from "@/app/utils/mail-template";

export default function LeaveApprovals() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const { data: leaves, isLoading } = useAppSelector(
    (state) => state.fetchLeave
  );
  // const { data:leaveData,  error } = useAppSelector(
  //   (state) => state.leaveHistory
  // );
  const { isLoading: isApproving } = useAppSelector(
    (state) => state.leaveApproval
  );
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
       if (leaves.length === 0) {
      dispatch(fetchLeaves());
    }
  }, [dispatch, leaves.length, router]);

  const SubmitEmail = async (data: any) => {
    const { name, email, leavetype, startDate, endDate, reason, newStatus } =
      data;
    const leaveDetails = {
      type: leavetype,
      startDate: startDate,
      endDate: endDate,
      reason: reason,
    };
    const status: "APPROVED" | "REJECTED" = newStatus;

    const mailOptions = {
      to: email,
      subject: "LEAVE APPLICATION UPDATE",
      html: HTML_TEMPLATE(name, email, status, leaveDetails),
    };
    try {
      await sendEmail(mailOptions);
      dispatch(fetchLeaves());

    } catch (e: any) {
      showError(e.message || "Failed to send leave application update email");
    }
  };

  const handleApprove = async (leaveId: number, status: string, leave: any) => {
    try {
      const leaveData = {
        id: leaveId,
        status: status,
        email: leave.email,
        leaveTypeId: leave.leaveTypeId,
        start_date: leave.start_date,
        end_date: leave.end_date,
      };
      SubmitEmail({
        name: leave.email,
        email: leave.email,
        reason: leave.reason,
        leavetype: leave.leaveTypeId,
        startDate: leave.start_date,
        endDate: leave.end_date,
        newStatus: status,
      });
      await dispatch(approveLeave(leaveData)).unwrap();
      showSuccess("Leave approved successfully!");
      dispatch(fetchLeaves());
    } catch (error: any) {
      showError(error.message || "Failed to approve leave");
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <h1 className='text-3xl font-bold mb-8'>Leave Approvals</h1>

      <div className='bg-white rounded-lg shadow overflow-x-auto'>
        <div className='max-w-[1000px]'>
          <table className='w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Employee
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Leave Type
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Dates
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Reason
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {leaves.length > 0 &&
                leaves[leaves.length - 1].data.map((leave: any) => (
                  <tr key={leave.id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {leave.email}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {leave.leaveTypeId}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {leave.start_date} to {leave.end_date}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm text-gray-900 max-w-[400px] break-words whitespace-normal'>
                        {leave.reason}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          leave.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : leave.status === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      {leave.status === "PENDING" && (
                        <div className='space-x-2'>
                          <button
                            onClick={() =>
                              handleApprove(leave.id, "APPROVED", leave)
                            }
                            disabled={isApproving}
                            className='text-green-600 hover:text-green-900 disabled:opacity-50'
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleApprove(leave.id, "REJECTED", leave)
                            }
                            disabled={isApproving}
                            className='text-red-600 hover:text-red-900 disabled:opacity-50'
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
