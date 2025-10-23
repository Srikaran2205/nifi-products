export interface ProductSale {
  id: string;
  name: string;
  sold_count: number;
  avg_price: number;
}

export interface AggregatedProduct {
  name: string;
  sold_count: number;
  avg_price: number;
  total_revenue: number;
}
