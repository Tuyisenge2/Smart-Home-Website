"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { JwtService } from "@/services/jwtService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchLeaves } from "@/store/slices/fetchleaveSlice";
import { Avatar } from "@/components/ui/avatar";
import { fetchUsersSmart } from "@/store/slices/getUserSmartSlice";
// Dummy data for demonstration

const upcomingHolidays = [
  { date: "2024-05-01", name: "Labor Day" },
  { date: "2024-06-12", name: "Independence Day" },
  { date: "2024-08-21", name: "Ninoy Aquino Day" },
];

export default function Dashboard() {
  // All hooks at the top (unconditional)
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");

  // Redux state
  const { data, error } = useAppSelector((state) => state.fetchLeave);
  const { data: usersData, isLoading } = useAppSelector(
    (state) => state.fetchUsersSmart
  );
  const { data: roleData } = useAppSelector((state) => state.fetchroleSlice);

  // Effects
  useEffect(() => {
    if (usersData.length === 0) {
      dispatch(fetchUsersSmart());
    }
  }, [dispatch, usersData.length, router]);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      const userData = JwtService.getTokenData(token);
      setCurrentUserEmail(userData?.email || "");
    }
  }, []);

  // Loading state - moved after all hooks
  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    );
  }

  // Debug log - moved after hooks

  const activeUser = usersData[usersData?.length - 1]?.data.filter((i: any) => {
    return i.is_active === 1;
  });

  const inactiveUser = usersData[usersData?.length - 1]?.data.filter(
    (i: any) => {
      return i.is_active === 0;
    }
  );

  return (
    <div className='max-w-[1000px] m-auto'>
      <div className='space-y-8'>
        <h1 className='text-3xl font-bold'>Welcome {"to Your Dashboard"}</h1>

        {/* Leave Balance Card */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-4'>User Stats</h2>
          <div className='grid grid-cols-3 gap-4'>
            <div className='text-center'>
              <p className='text-2xl font-bold'>
                {usersData?.length > 0
                  ? usersData[usersData?.length - 1]?.data?.length
                  : 0}
              </p>
              <p className='text-gray-600'>Total User</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold'>
                {activeUser?.length > 0 ? activeUser?.length : 0}
              </p>
              <p className='text-gray-600'>Active User</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold'>
                {inactiveUser?.length > 0 ? inactiveUser?.length : 0}
              </p>
              <p className='text-gray-600'>Inactive User</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='grid grid-cols-2 gap-4'>
          <Link
            href='/dashboard/users'
            className='bg-blue-500 text-white p-4 rounded-lg text-center hover:bg-blue-600'
          >
            View Users
          </Link>
          <Link
            href='/dashboard/roles'
            className='bg-green-500 text-white p-4 rounded-lg text-center hover:bg-green-600'
          >
            View Roles
          </Link>
        </div>

        {/* Colleagues on Leave */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold'>Colleagues on Leave</h2>
            {/* {approvedLeaves.length > 5 && (
              <Link
                href='/dashboard/colleagues-on-leave'
                className='text-blue-500 hover:text-blue-600 text-sm font-medium'
              >
                See All ({approvedLeaves.length})
              </Link>
            )} */}
          </div>
          <div className='flex flex-wrap gap-6 justify-between'>
            {/* {firstFiveColleagues.map((colleague: any, index: any) => (
              <div
                key={index}
                className='text-center flex flex-col items-center'
              >
                <Avatar
                  src={`https://ui-avatars.com/api/?name=${colleague.email}&background=random`}
                  alt={colleague.email}
                  className='w-16 h-16 mb-2'
                />
                <p className='font-medium text-sm'>{colleague.email}</p>
                <p className='text-sm text-gray-600'>
                  Until {new Date(colleague.end_date).toLocaleDateString()}
                </p>
              </div>
            ))} */}
            {/* {firstFiveColleagues.length === 0 && (
              <p className='text-gray-500 text-center w-full'>
                No colleagues are currently on leave
              </p>
            )} */}
          </div>
        </div>

        {/* Upcoming Holidays */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-4'>Upcoming Holidays</h2>
          <ul className='space-y-2'>
            {upcomingHolidays.map((holiday, index) => (
              <li key={index} className='flex justify-between'>
                <span>{holiday.name}</span>
                <span className='text-gray-600'>{holiday.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
