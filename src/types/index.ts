export interface Company {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  category?: string;
  averageRating?: number;
  reviewCount?: number;
  claimToken?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OwnerReply {
  text: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  companyId: string;
  userName: string;
  rating: number;
  text: string;
  ownerReply?: OwnerReply;
  createdAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
