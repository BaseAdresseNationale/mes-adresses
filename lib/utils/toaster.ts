import { toaster } from "evergreen-ui";

export function toasterWrapper<T>(
  fn: () => Promise<T>,
  successMessage: string,
  errorMessage: string
) {
  return async () => {
    try {
      const result = await fn();
      toaster.success(successMessage);

      return result;
    } catch (error) {
      toaster.danger(errorMessage, {
        description: error.message,
      });
    }
  };
}
