import { toaster } from "evergreen-ui";

export function toasterWrapper<T>(
  fn: () => Promise<T>,
  successMessage: string,
  errorMessage: string,
  onValidationError?: (error: any) => void
) {
  return async () => {
    try {
      const result = await fn();
      toaster.success(successMessage, {
        duration: 5,
        id: "toaster-success",
      });

      return result;
    } catch (error) {
      if (error.status === 400 && onValidationError) {
        onValidationError(error);
      } else {
        toaster.danger(errorMessage, {
          description: error.message,
        });
      }
    }
  };
}
