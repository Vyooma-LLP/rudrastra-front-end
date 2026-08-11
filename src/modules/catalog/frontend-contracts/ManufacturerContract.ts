import { Query } from '../../../contracts/base';

export interface ManufacturerProduct {
  id: string;
  name: string;
  mpn: string;
  category: string;
  price: string;
  img: string;
}

export interface GetManufacturerProductsInput {
  manufacturerSlug: string;
}

export type GetManufacturerProductsQuery = Query<GetManufacturerProductsInput, ManufacturerProduct[]>;
