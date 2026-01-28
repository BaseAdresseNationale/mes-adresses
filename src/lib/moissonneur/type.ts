import { Perimeter } from "../api-depot/types";

export interface Organization {
  id?: string;
  email?: string;
  name?: string;
  page?: string;
  logo?: string;
  perimeters?: Perimeter[];
  updatedAt?: Date;
  createdAt?: Date;
  deletedAt?: Date;
}
