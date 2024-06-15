"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodValidationError = void 0;
const zodValidationError = (err) => {
    const errorSource = err.issues.map((issu) => {
        return {
            path: issu === null || issu === void 0 ? void 0 : issu.path[(issu === null || issu === void 0 ? void 0 : issu.path.length) - 1],
            message: issu === null || issu === void 0 ? void 0 : issu.message,
        };
    });
    return {
        statusCode: 500,
        message: "validation Error",
        errorSource,
    };
};
exports.zodValidationError = zodValidationError;
