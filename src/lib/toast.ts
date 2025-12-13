/**
 * Toast Error Helper
 * 
 * Wraps sonner toast with automatic human-friendly error translation.
 * Always use these helpers instead of raw toast() for errors.
 */

import { toast } from "sonner";
import { toHumanError } from "@/lib/utils";

/**
 * Show a human-friendly error toast
 * Automatically translates technical errors to Indonesian micro-copy.
 * 
 * @param error - Any error (string, Error object, API response, etc.)
 * @param options - Optional toast configuration
 * 
 * @example
 * ```ts
 * // In a try/catch
 * catch (error) {
 *   toastError(error);
 * }
 * 
 * // With server action result
 * if (result.error) {
 *   toastError(result.error);
 * }
 * 
 * // With custom title
 * toastError(error, { title: "Gagal Menyimpan" });
 * ```
 */
export function toastError(
  error: unknown,
  options?: {
    title?: string;
    duration?: number;
  }
) {
  const humanMessage = toHumanError(error);
  
  // Log to console for debugging
  console.error("[ToastError]", error);
  
  toast.error(options?.title || "Oops!", {
    description: humanMessage,
    duration: options?.duration || 5000,
  });
}

/**
 * Show a success toast with optional description
 */
export function toastSuccess(
  message: string,
  options?: {
    description?: string;
    duration?: number;
  }
) {
  toast.success(message, {
    description: options?.description,
    duration: options?.duration || 3000,
  });
}

/**
 * Show an info toast
 */
export function toastInfo(
  message: string,
  options?: {
    description?: string;
    duration?: number;
  }
) {
  toast.info(message, {
    description: options?.description,
    duration: options?.duration || 4000,
  });
}

/**
 * Show a loading toast that returns a promise handler
 * 
 * @example
 * ```ts
 * toastPromise(
 *   saveData(),
 *   {
 *     loading: "Menyimpan...",
 *     success: "Berhasil disimpan!",
 *     error: (err) => toHumanError(err),
 *   }
 * );
 * ```
 */
export function toastPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: unknown) => string);
  }
) {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: (err) => {
      console.error("[ToastPromise Error]", err);
      return typeof messages.error === "function" 
        ? messages.error(err) 
        : toHumanError(err);
    },
  });
}
