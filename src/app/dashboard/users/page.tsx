"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import useToast from "@/hooks/useToast";
import { JwtService } from "@/services/jwtService";
import { useRouter } from "next/navigation";
import { approveLeave } from "@/store/slices/leaveApprovalSlice";
import { sendEmail } from "@/app/lib/send-email";
import HTML_TEMPLATE from "@/app/utils/mail-template";
import { fetchUsersSmart } from "@/store/slices/getUserSmartSlice";
import { fetchingRoleThunk } from "@/store/slices/roleSlice";
import { updateUserThunk } from "@/store/slices/updateUserSlice";

export default function usersTable() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const { data: usersData, isLoading } = useAppSelector(
    (state) => state.fetchUsersSmart
  );
  const { data: roleData } = useAppSelector((state) => state.fetchroleSlice);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  useEffect(() => {
    if (usersData.length === 0) {
      dispatch(fetchUsersSmart());
    }
  }, [dispatch, usersData.length, router]);

  useEffect(() => {
    if (roleData.length === 0) {
      dispatch(fetchingRoleThunk());
    }
  }, [dispatch, roleData.length, router]);

  if (usersData) {
    console.log(
      "user FDDDDDDDDDDDDDAtAAAAAAAAa",
      roleData[roleData.length - 1]?.data
      //   usersData[usersData.length - 1]?.data
    );
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    );
  }

  const roles = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Manager" },
    { id: 3, name: "User" },
  ];
  const openRoleModal = (user: any) => {
    setSelectedUser(user);
    setSelectedRole(user.role.name);
    setIsRoleModalOpen(true);
  };
  const closeRoleModal = () => {
    setIsRoleModalOpen(false);
    setSelectedUser(null);
    setSelectedRole("");
    setSelectedRoleId(null);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roleId = parseInt(e.target.value);
    setSelectedRoleId(roleId);
    const selectedRoleName = roleData[roleData.length - 1]?.data.find(
      (role: any) => role.id === roleId
    )?.name;
    setSelectedRole(selectedRoleName || "");
  };

  return (
    <div>
      <h1 className='text-3xl font-bold mb-8'> Smart Home Users</h1>
      {isRoleModalOpen && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h2 className='text-xl font-bold mb-4'>Edit User Roles</h2>

            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Current User: {selectedUser?.name}
              </label>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Current Role: {selectedUser?.role.name}
              </label>
              <select
                value={selectedRoleId || ""}
                onChange={handleRoleChange}
                className='w-full p-2 border border-gray-300 rounded-md'
              >
                <option value=''>Select a role</option>
                {roleData.length > 0 &&
                  roleData[roleData.length - 1]?.data.map((role: any) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className='flex justify-end space-x-3'>
              <button
                onClick={closeRoleModal}
                className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (selectedRoleId) {
                    // Here you would dispatch your update action
                    await dispatch(
                      updateUserThunk({
                        id: selectedUser.id,
                        role_id: selectedRoleId,
                      })
                    );
                    await dispatch(fetchUsersSmart());
                    showSuccess("Role updated successfully!");
                    closeRoleModal();
                  }
                }}
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='bg-white rounded-lg shadow overflow-x-auto'>
        <div className=''>
          <table className='w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Username
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Email
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Role
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Role actions
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Activate/Deactivate
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {usersData.length > 0 &&
                usersData[usersData.length - 1]?.data.map((user: any) => (
                  <tr key={user.id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {user.name}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{user.email}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {user.role.name}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm text-gray-900 max-w-[400px] break-words whitespace-normal'>
                        {user.is_active === 1 ? "Active" : "Inactive"}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <button
                        onClick={() => openRoleModal(user)}
                        className='px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors'
                      >
                        Edit Role
                      </button>
                    </td>{" "}
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      {user.is_active === 1 ? (
                        <button
                          onClick={async () => {
                            try {
                              await dispatch(
                                updateUserThunk({
                                  id: user.id,
                                  is_active: false,
                                })
                              );
                              await dispatch(fetchUsersSmart());
                              showSuccess("User deactivated successfully!");
                            } catch (error) {
                              showError("Failed to deactivate user");
                            }
                          }}
                          className='px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors'
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            try {
                              await dispatch(
                                updateUserThunk({
                                  id: user.id,
                                  is_active: true,
                                })
                              );
                              await dispatch(fetchUsersSmart());
                              showSuccess("User activated successfully!");
                            } catch (error) {
                              showError("Failed to activate user");
                            }
                          }}
                          className='px-3 py-1 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors'
                        >
                          Activate
                        </button>
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
