"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = require("../../error/AppError");
const user_modal_1 = require("./user.modal");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUserIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = payload, userinfo = __rest(payload, ["password"]);
    const isExistUser = yield user_modal_1.Users.findOne({ email: payload.email });
    if (isExistUser) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "User already exist!");
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, config_1.default.bcrypt_salt_round);
    const result = yield user_modal_1.Users.create(Object.assign({ password: hashedPassword }, userinfo));
    return result;
});
const loginUserIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_modal_1.Users.findOne({ email: payload.email }).select("+password");
    if (!isUserExist) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User does not exist!");
    }
    const matchPassword = yield bcrypt_1.default.compare(payload.password, isUserExist.password);
    if (!matchPassword) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "You are not authorize!");
    }
    const data = {
        email: isUserExist.email,
        role: isUserExist.role,
    };
    const accessToken = jsonwebtoken_1.default.sign(data, config_1.default.jwt_access_secret, {
        expiresIn: config_1.default.jwt_secret_expirein,
    });
    const refreshToken = jsonwebtoken_1.default.sign(data, config_1.default.jwt_refresh_secret, {
        expiresIn: config_1.default.jwt_refresh_expires_in,
    });
    return { data: isUserExist, accessToken, refreshToken };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    const { email, role } = decoded;
    const isExistUser = yield user_modal_1.Users.findOne({ email: email });
    if (!isExistUser) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User does not exist!");
    }
    const jwtPayload = { email, role };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: config_1.default.jwt_secret_expirein,
    });
    return accessToken;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_modal_1.Users.find();
    return result;
});
const updateUserRole = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_modal_1.Users.findByIdAndUpdate(id, {
        role: payload.role,
    }, {
        new: true,
        runValidators: true,
    });
    return result;
});
const getCurrentUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_modal_1.Users.findOne({ email: email });
    return result;
});
const updateProfile = (email, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_modal_1.Users.findOne({ email: email });
    if (!isUserExist) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User does not exist!");
    }
    const result = yield user_modal_1.Users.findByIdAndUpdate(isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist._id, {
        name: payload.name,
        phone: payload.phone,
        address: payload.address,
        image: payload.image,
    }, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.userServices = {
    createUserIntoDb,
    loginUserIntoDb,
    refreshToken,
    getAllUsers,
    updateUserRole,
    getCurrentUser,
    updateProfile,
};
