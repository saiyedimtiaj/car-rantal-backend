import { ZodError, ZodIssue } from "zod";
import { TErrorSource } from "../interface/error";

export const zodValidationError = (err: ZodError) => {
  const errorSource: TErrorSource = err.issues.map((issu: ZodIssue) => {
    return {
      path: issu?.path[issu?.path.length - 1],
      message: issu?.message,
    };
  });

  return {
    statusCode: 500,
    message: "validation Error",
    errorSource,
  };
};
