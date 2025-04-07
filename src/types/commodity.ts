export interface CommodityData {
  id: string;
  name: string;
  price: number;
  unit: string;
  currency: string;
  change: number;
  changePercentage: number;
  timestamp: string;
  source: string;
  sourceUrl: string;
  category: string;
}
