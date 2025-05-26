"use client";

import { JwtService } from "@/services/jwtService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchLeavesHistory } from "@/store/slices/leaveSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LeaveHistory() {
  const { data, isLoading, error } = useAppSelector(
    (state) => state.leaveHistory
  );
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      const userData = JwtService.getTokenData(token);
      setCurrentUserEmail(userData?.email || "");
    }
  }, []);

  useEffect(() => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        const userData = JwtService.getTokenData(token as string);

        if (data.length === 0 && userData) {
          dispatch(fetchLeavesHistory(userData?.email)).unwrap();
        }
      }
    } catch (error) {
    }
  }, [dispatch, data.length, router]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUserLeaves = (leavesData: any[]) => {
    if (!leavesData || leavesData.length === 0) return [];
    const latestLeaves = leavesData[leavesData.length - 1];
    return latestLeaves.filter(
      (leave: any) => leave.email === currentUserEmail
    );
  };

  const userLeaves = data ? getUserLeaves(data) : [];

  return (
    <div>
      <h1 className='text-3xl font-bold mb-8'>My Leave History</h1>

      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
        </div>
      ) : userLeaves.length === 0 ? (
        <div className='bg-white rounded-lg shadow p-6 text-center'>
          <p className='text-gray-500'>
            You haven't applied for any leaves yet.
          </p>
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Leave Type
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Dates
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Reason
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Document
                </th>
              </tr>
            </thead>

            <tbody className='bg-white divide-y divide-gray-200'>
              {userLeaves.map((leave: any) => (
                <tr key={leave.id}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>
                      {leave.leaveTypeId}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900 flex gap-1'>
                      <p>{new Date(leave.start_date).toLocaleDateString()}</p>
                      <p className='font-bold'>to</p>
                      <p>{new Date(leave.end_date).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        leave.status
                      )}`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm text-gray-900'>{leave.reason}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {leave.document_url ? (
                      <a
                        href={leave.document_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:text-blue-900'
                      >
                        View Document
                      </a>
                    ) : (
                      "No document"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
