export interface Image {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface Option {
  name: string;
  value: string;
}

export interface Price {
  amount: string;
  currencyCode: string;
}

export interface Variant {
  id: string;
  title: string;
  quantityAvailable: number;
  availableForSale: boolean;
  price: Price;
  selectedOptions: Option[];
  productId?: string;
  priceAmount?: string;
  priceCurrencyCode?: string;
}

export interface PriceRange {
  maxVariantPrice: Price;
  minVariantPrice: Price;
}

export interface Collection {
  handle: string;
  title: string;
  descriptionHtml: string;
  updatedAt: string;
  id: string;
  image: string | null;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  descriptionHtml?: string;
  priceRange: PriceRange;
  minPrice: number;
  featuredImage: Image;
  images: Image[];
  variants: Variant[];
  collections: Collection[];
}