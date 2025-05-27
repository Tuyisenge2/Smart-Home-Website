"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import useToast from "@/hooks/useToast";
import {
  creatingRoleThunk,
  deletingRoleThunk,
  fetchingRoleThunk,
  updatingRoleThunk,
} from "@/store/slices/roleSlice";

export default function RolesPage() {
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();
  const { data: roleData, isLoading } = useAppSelector(
    (state) => state.fetchroleSlice
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [editingRole, setEditingRole] = useState<{
    id: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (roleData.length === 0) {
      dispatch(fetchingRoleThunk());
    }
  }, [dispatch, roleData.length]);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    );
  }

  const handleAddRole = async () => {
    if (!newRoleName.trim()) {
      showError("Role name cannot be empty");
      return;
    }

    try {
      await dispatch(creatingRoleThunk({ name: newRoleName }));
      await dispatch(fetchingRoleThunk());

      showSuccess("Role added successfully!");
      setIsAddModalOpen(false);
      setNewRoleName("");
    } catch (error) {
      showError("Failed to add role");
    }
  };

  const handleEditRole = async () => {
    if (!editingRole || !editingRole.name.trim()) {
      showError("Role name cannot be empty");
      return;
    }

    try {
      await dispatch(
        updatingRoleThunk({ id: editingRole.id, name: editingRole.name })
      );
      showSuccess("Role updated successfully!");
      setIsEditModalOpen(false);
      setEditingRole(null);
      await dispatch(fetchingRoleThunk());
    } catch (error) {
      showError("Failed to update role");
    }
  };

  const openEditModal = (role: { id: number; name: string }) => {
    setEditingRole(role);
    setIsEditModalOpen(true);
  };

  const handleDeleteRole = async (roleId: number) => {
    try {
      await dispatch(deletingRoleThunk({ id: roleId }));
      await dispatch(fetchingRoleThunk());

      showSuccess("Role deleted successfully!");
    } catch (error) {
      showError("Failed to delete role");
    }
  };

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Manage Roles</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
          Add New Role
        </button>
      </div>

      {/* Add Role Modal */}
      {isAddModalOpen && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h2 className='text-xl font-bold mb-4'>Add New Role</h2>
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Role Name
              </label>
              <input
                type='text'
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md'
                placeholder='Enter role name'
              />
            </div>
            <div className='flex justify-end space-x-3'>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewRoleName("");
                }}
                className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
              >
                Cancel
              </button>
              <button
                onClick={handleAddRole}
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
              >
                Add Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {isEditModalOpen && editingRole && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h2 className='text-xl font-bold mb-4'>Edit Role</h2>
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Role Name
              </label>
              <input
                type='text'
                value={editingRole.name}
                onChange={(e) =>
                  setEditingRole({ ...editingRole, name: e.target.value })
                }
                className='w-full p-2 border border-gray-300 rounded-md'
                placeholder='Enter role name'
              />
            </div>
            <div className='flex justify-end space-x-3'>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingRole(null);
                }}
                className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
              >
                Cancel
              </button>
              <button
                onClick={handleEditRole}
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Roles Table */}
      <div className='bg-white rounded-lg shadow overflow-x-auto'>
        <table className='w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                ID
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Role Name
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {roleData.length > 0 &&
              roleData[roleData.length - 1]?.data.map((role: any) => (
                <tr key={role.id}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>{role.id}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>{role.name}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium '>
                    <div className=' flex gap-3.5 '>
                      <button
                        onClick={() => openEditModal(role)}
                        className='px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRole(role.id)}
                        className='px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors'
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
