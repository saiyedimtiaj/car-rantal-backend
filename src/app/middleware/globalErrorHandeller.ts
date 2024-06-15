import { ErrorRequestHandler } from "express";
import { AppError } from "../error/AppError";
import { zodValidationError } from "../error/zodValidationError";
import { TErrorSource } from "../interface/error";
import { validationError } from "../error/validationerror";
import { ZodError } from "zod";
import { handleCastError } from "../error/handleCastError";
import { handleDuplicatError } from "../error/handleDuplicateError";

const globalErrorHandeller: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Somethis went worng!";

  let errorSourse: TErrorSource = [
    {
      path: "",
      message: "Something went wrong!",
    },
  ];

  if (err instanceof AppError) {
    statusCode = err.ststusCode;
    (message = err.message),
      (errorSourse = [
        {
          path: "",
          message: err.message,
        },
      ]);
  } else if (err.name === "ValidationError") {
    const error = validationError(err);
    message = error.message;
    errorSourse = error.errorSource;
  } else if (err instanceof ZodError) {
    const error = zodValidationError(err);
    message = error.message;
    errorSourse = error.errorSource;
  } else if (err?.name === "CastError") {
    const simplifildError = handleCastError(err);
    message = simplifildError?.message;
    errorSourse = simplifildError?.errorSource;
  } else if (err?.code === 11000) {
    const simplifildError = handleDuplicatError(err);
    message = simplifildError?.message;
    errorSourse = simplifildError?.errorSource;
  } else if (err instanceof Error) {
    message = err.message;
    errorSourse = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  return res.status(statusCode).send({
    sucess: false,
    message: message,
    errorSourse,
    stack: err.stack,
    err,
  });
};

export default globalErrorHandeller;
