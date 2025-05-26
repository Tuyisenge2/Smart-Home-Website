"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchLeavesType } from "@/store/slices/fetchLeaveTypeSlice";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { JwtService } from "@/services/jwtService";
import { applyleave } from "@/store/slices/applyLeaveslice";
import useToast from "@/hooks/useToast";

const leaveFormSchema = z
  .object({
    leaveType: z.string().min(1, "Please select a leave type"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    reason: z
      .string()
      .min(10, "Reason must be at least 10 characters")
      .max(200, "Reason cannot exceed 500 characters"),
    document: z.any().optional(),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return endDate >= startDate;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

type LeaveFormData = z.infer<typeof leaveFormSchema>;

export default function ApplyLeave() {
  const { showSuccess, showError } = useToast();
  const dispatch = useAppDispatch();
  const { data: leaveTypes } = useAppSelector((state) => state.fetchLeavesType);
  const { data: applyleaveData, isLoading: isLoadingApplyLeave } =
    useAppSelector((state) => state.applyleave);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const userData = JwtService.getTokenData(
    localStorage.getItem("auth_token") || ""
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveFormSchema),
  });

  useEffect(() => {
    if (leaveTypes.length === 0) {
      dispatch(fetchLeavesType());
    }
  }, [dispatch, leaveTypes.length]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      if (userData?.email) {
        const leaveData = {
          email: userData.email,
          reason: data.reason,
          start_date: data.startDate,
          end_date: data.endDate,
          document_url: data.document ? data.document[0]?.name : "",
          leaveTypeId: data.leaveType,
        };
        const result = await dispatch(applyleave(leaveData)).unwrap();
        if (result) {
          showSuccess("Leave application submitted successfully!");
          reset();
        }
      }
    } catch (error: any) {
      console.error("Error:", error);
      showError(
        error?.message ||
          "Failed to submit leave application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className='max-w-2xl mx-auto'>
      <h1 className='text-3xl font-bold mb-8'>Apply for Leave</h1>

      <form onSubmit={onSubmit} className='space-y-6' noValidate>
        {/* Leave Type Field */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Leave Type
          </label>
          <select
            {...register("leaveType")}
            className='w-full p-2 border rounded-md'
          >
            <option value=''>Select a leave type</option>
            {leaveTypes.length > 0 &&
              leaveTypes[leaveTypes.length - 1].data.map((leave: any) => (
                <option key={leave.name} value={leave.name}>
                  {leave.name}
                </option>
              ))}
          </select>
          {errors.leaveType && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.leaveType.message}
            </p>
          )}
        </div>

        {/* Date Fields */}
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Start Date
            </label>
            <input
              type='date'
              {...register("startDate")}
              className='w-full p-2 border rounded-md'
            />
            {errors.startDate && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.startDate.message}
              </p>
            )}
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              End Date
            </label>
            <input
              type='date'
              {...register("endDate")}
              className='w-full p-2 border rounded-md'
            />
            {errors.endDate && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Reason Field */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Reason
          </label>
          <textarea
            {...register("reason")}
            className='w-full p-2 border rounded-md'
            rows={4}
            maxLength={200}
          />
          {errors.reason && (
            <p className='text-red-500 text-sm mt-1'>{errors.reason.message}</p>
          )}
        </div>

        {/* Document Field */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Supporting Document
          </label>
          <input
            type='file'
            {...register("document")}
            className='w-full p-2 border rounded-md'
            accept='.pdf,.jpg,.jpeg,.png'
          />
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          {isSubmitting ? "Submitting..." : "Submit Leave Application"}
        </button>
      </form>
    </div>
  );
}
