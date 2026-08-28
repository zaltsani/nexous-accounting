import { type FieldErrors } from "react-hook-form";

export function getFormErrorMessage(errors: FieldErrors): string | null {
  if (!errors || Object.keys(errors).length === 0) return null;

  for (const key of Object.keys(errors)) {
    const fieldError = errors[key];

    if (!fieldError) continue;

    if (typeof fieldError.message === "string") {
      return fieldError.message;
    }

    if (
      typeof fieldError === "object" &&
      "root" in fieldError &&
      typeof (fieldError as Record<string, any>).root?.message === "string"
    ) {
      return (fieldError as Record<string, any>).root.message;
    }

    if (Array.isArray(fieldError)) {
      const activeError = fieldError.find((item) => item?.message || item?.root?.message);
      const message = activeError?.message || activeError?.root?.message;
      if (message) return message;
    }
  }

  return null;
}
