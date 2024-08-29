export type TCar = {
  name: string;
  description: string;
  color: string;
  status: "available" | "unavailable";
  features: string[];
  pricePerHour: number;
  isDeleted?: boolean;
  image: string;
  location: string;
  category: string;
  doors: number;
  passenger: number;
  luggage: number;
};

export type TCarReturn = {
  bookingId: string;
  endTime: string;
  transtionId: string;
};

export type TCarQueryParams = {
  category?: string;
  color?: string;
  searchTrams?: string;
  name?: string;
  location?: string;
  startDate?: string;
};
