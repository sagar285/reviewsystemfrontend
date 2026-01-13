
export interface Company {
  _id: string;
  name: string;
  description?: string;
}

export interface Review {
  _id: string;
  companyId: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: string;
}
