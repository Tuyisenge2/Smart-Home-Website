import { toast } from 'sonner';

const useToast = () => {
	const showSuccessMessage = (message: string) => {
		toast.success(message);
	};

	const showErrorMessage = (message: string) => {
		toast.error(message);
	};
	const showWorningMessage = (message: string) => {
		toast.warning(message);
	};
	return {
		showSuccessMessage,
		showErrorMessage,
		showWorningMessage,
	};
};

export default useToast;
