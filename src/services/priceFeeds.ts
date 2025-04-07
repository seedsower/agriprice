import { CommodityData } from "@/types/commodity";

// API endpoints for different commodity price sources
const API_ENDPOINTS = {
  USDA: "https://api.example.com/usda/commodities", // Replace with actual USDA API endpoint
  CME: "https://api.example.com/cme/prices", // Replace with actual CME API endpoint
  ICE: "https://api.example.com/ice/futures", // Replace with actual ICE API endpoint
  FAO: "https://api.example.com/fao/prices", // Replace with actual FAO API endpoint
  WORLDBANK: "https://api.example.com/worldbank/commodities", // Replace with actual World Bank API endpoint
};

// For demo purposes, we'll simulate API responses
const generateMockResponse = (source: string) => {
  const baseData = [
    {
      id: crypto.randomUUID(),
      name: "Wheat (Hard Red Winter)",
      price: 6.75 + (Math.random() - 0.5) * 0.2,
      unit: "bushel",
      currency: "USD",
      change: (Math.random() - 0.5) * 0.3,
      changePercentage: (Math.random() - 0.5) * 4,
      timestamp: new Date().toISOString(),
      source: "USDA",
      sourceUrl: "https://www.usda.gov/oce/commodity/wasde",
      category: "grains",
    },
    {
      id: crypto.randomUUID(),
      name: "Corn",
      price: 4.25 + (Math.random() - 0.5) * 0.15,
      unit: "bushel",
      currency: "USD",
      change: (Math.random() - 0.5) * 0.2,
      changePercentage: (Math.random() - 0.5) * 3.5,
      timestamp: new Date().toISOString(),
      source: "CME Group",
      sourceUrl:
        "https://www.cmegroup.com/markets/agriculture/grains/corn.html",
      category: "grains",
    },
    {
      id: crypto.randomUUID(),
      name: "Soybeans",
      price: 13.85 + (Math.random() - 0.5) * 0.3,
      unit: "bushel",
      currency: "USD",
      change: (Math.random() - 0.5) * 0.4,
      changePercentage: (Math.random() - 0.5) * 2.8,
      timestamp: new Date().toISOString(),
      source: "CME Group",
      sourceUrl:
        "https://www.cmegroup.com/markets/agriculture/oilseeds/soybean.html",
      category: "oilseeds",
    },
    {
      id: crypto.randomUUID(),
      name: "Rice (Rough)",
      price: 17.25 + (Math.random() - 0.5) * 0.25,
      unit: "cwt",
      currency: "USD",
      change: (Math.random() - 0.5) * 0.3,
      changePercentage: (Math.random() - 0.5) * 1.8,
      timestamp: new Date().toISOString(),
      source: "FAO",
      sourceUrl: "https://www.fao.org/markets-and-trade/commodities/rice/en/",
      category: "grains",
    },
    {
      id: crypto.randomUUID(),
      name: "Barley",
      price: 5.45 + (Math.random() - 0.5) * 0.2,
      unit: "bushel",
      currency: "USD",
      change: (Math.random() - 0.5) * 0.25,
      changePercentage: (Math.random() - 0.5) * 3.2,
      timestamp: new Date().toISOString(),
      source: "USDA",
      sourceUrl: "https://www.usda.gov/oce/commodity/wasde",
      category: "grains",
    },
    {
      id: crypto.randomUUID(),
      name: "Oats",
      price: 3.85 + (Math.random() - 0.5) * 0.15,
      unit: "bushel",
      currency: "USD",
      change: (Math.random() - 0.5) * 0.2,
      changePercentage: (Math.random() - 0.5) * 4.5,
      timestamp: new Date().toISOString(),
      source: "CME Group",
      sourceUrl:
        "https://www.cmegroup.com/markets/agriculture/grains/oats.html",
      category: "grains",
    },
    {
      id: crypto.randomUUID(),
      name: "Palm Oil",
      price: 1125.5 + (Math.random() - 0.5) * 25,
      unit: "ton",
      currency: "USD",
      change: (Math.random() - 0.5) * 15,
      changePercentage: (Math.random() - 0.5) * 2.5,
      timestamp: new Date().toISOString(),
      source: "World Bank",
      sourceUrl: "https://www.worldbank.org/en/research/commodity-markets",
      category: "oilseeds",
    },
    {
      id: crypto.randomUUID(),
      name: "Rapeseed",
      price: 475.25 + (Math.random() - 0.5) * 10,
      unit: "ton",
      currency: "USD",
      change: (Math.random() - 0.5) * 8,
      changePercentage: (Math.random() - 0.5) * 1.8,
      timestamp: new Date().toISOString(),
      source: "ICE",
      sourceUrl: "https://www.theice.com/products/254/Rapeseed-Futures",
      category: "oilseeds",
    },
  ];

  // Filter based on source
  return baseData.filter((item) => {
    if (source === "USDA") return item.source === "USDA";
    if (source === "CME") return item.source === "CME Group";
    if (source === "ICE") return item.source === "ICE";
    if (source === "FAO") return item.source === "FAO";
    if (source === "WORLDBANK") return item.source === "World Bank";
    return true;
  });
};

// Fetch data from a specific source
export const fetchPriceData = async (
  source: keyof typeof API_ENDPOINTS,
): Promise<CommodityData[]> => {
  try {
    // In a real implementation, this would be an actual API call
    // const response = await fetch(API_ENDPOINTS[source]);
    // const data = await response.json();
    // return standardizeData(data, source);

    // For demo purposes, we'll return mock data
    return generateMockResponse(source);
  } catch (error) {
    console.error(`Error fetching data from ${source}:`, error);
    return [];
  }
};

// Fetch data from all sources
export const fetchAllPriceData = async (): Promise<CommodityData[]> => {
  try {
    const sources = Object.keys(API_ENDPOINTS) as Array<
      keyof typeof API_ENDPOINTS
    >;
    const promises = sources.map((source) => fetchPriceData(source));
    const results = await Promise.all(promises);
    return results.flat();
  } catch (error) {
    console.error("Error fetching all price data:", error);
    return [];
  }
};

// Setup WebSocket for real-time updates
export class PriceWebSocket {
  private ws: WebSocket | null = null;
  private listeners: ((data: CommodityData[]) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000; // 3 seconds
  private isConnecting = false;

  constructor(private url: string = "wss://example.com/ws/commodities") {}

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) return;

    this.isConnecting = true;

    // For demo purposes, we'll simulate WebSocket with setInterval
    // In a real implementation, this would be a WebSocket connection
    // this.ws = new WebSocket(this.url);

    // Simulate connection success
    setTimeout(() => {
      this.isConnecting = false;
      this.reconnectAttempts = 0;

      // Simulate receiving data every 5 seconds
      const intervalId = setInterval(() => {
        const mockData = generateMockResponse("");
        this.notifyListeners(mockData);
      }, 5000);

      // Store the interval ID for cleanup
      (this as any).intervalId = intervalId;
    }, 1000);
  }

  disconnect() {
    // Clear the interval if it exists
    if ((this as any).intervalId) {
      clearInterval((this as any).intervalId);
      (this as any).intervalId = null;
    }

    // Close the WebSocket if it exists
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  addListener(callback: (data: CommodityData[]) => void) {
    this.listeners.push(callback);

    // If this is the first listener, connect
    if (this.listeners.length === 1) {
      this.connect();
    }

    // Return a function to remove the listener
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback,
      );

      // If there are no more listeners, disconnect
      if (this.listeners.length === 0) {
        this.disconnect();
      }
    };
  }

  private notifyListeners(data: CommodityData[]) {
    this.listeners.forEach((listener) => listener(data));
  }
}

// Create a singleton instance
export const priceWebSocket = new PriceWebSocket();
