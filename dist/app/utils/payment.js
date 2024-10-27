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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.initiatePayment = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const initiatePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.post(config_1.default.amarpay_baseurl, {
        store_id: config_1.default.amarpay_storeId,
        signature_key: config_1.default.amarpay_signaturekey,
        tran_id: payload.id,
        success_url: `https://assingment-3-eight.vercel.app/api/payment/confirmation?bookingId=${payload.bookingId}&endTime=${payload.endTime}&transtionId=${payload.id}`,
        fail_url: `https://assingment-3-eight.vercel.app/api/payment/failed`,
        cancel_url: "https://car-rantal-fbe8.vercel.app",
        amount: payload.amount,
        currency: "BDT",
        desc: "Merchant Registration Payment",
        cus_name: payload.name,
        cus_email: payload.email,
        cus_add1: "House B-158 Road 22",
        cus_add2: "Mohakhali DOHS",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1206",
        cus_country: "Bangladesh",
        cus_phone: "+8801704",
        type: "json",
    });
    return response.data;
});
exports.initiatePayment = initiatePayment;
const verifyPayment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(config_1.default.payment_verify_url, {
        params: {
            store_id: config_1.default.amarpay_storeId,
            signature_key: config_1.default.amarpay_signaturekey,
            type: "json",
            request_id: id,
        },
    });
    return response.data;
});
exports.verifyPayment = verifyPayment;
