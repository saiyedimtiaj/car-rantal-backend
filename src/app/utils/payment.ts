import axios from "axios";
import config from "../config";

type PaymentData = {
  id: string;
  amount: number;
  name: string;
  email: string;
  bookingId: string;
  endTime: string;
};

export const initiatePayment = async (payload: PaymentData) => {
  const response = await axios.post(config.amarpay_baseurl as string, {
    store_id: config.amarpay_storeId,
    signature_key: config.amarpay_signaturekey,
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
};

export const verifyPayment = async (id: string) => {
  const response = await axios.get(config.payment_verify_url!, {
    params: {
      store_id: config.amarpay_storeId,
      signature_key: config.amarpay_signaturekey,
      type: "json",
      request_id: id,
    },
  });
  return response.data;
};
