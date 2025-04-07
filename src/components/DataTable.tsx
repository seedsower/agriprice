import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Filter, RefreshCw, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CommodityData } from "@/types/commodity";
import { fetchAllPriceData, priceWebSocket } from "@/services/priceFeeds";

interface DataTableProps {
  data?: CommodityData[];
  isLoading?: boolean;
}

const DataTable = ({
  data: initialData,
  isLoading: initialLoading = false,
}: DataTableProps) => {
  const [data, setData] = useState<CommodityData[]>(initialData || mockData);
  const [isLoading, setIsLoading] = useState<boolean>(initialLoading);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CommodityData;
    direction: "ascending" | "descending";
  } | null>(null);
  const [showSourceInfo, setShowSourceInfo] = useState(false);
  const [selectedSource, setSelectedSource] = useState<CommodityData | null>(
    null,
  );

  // Filter data based on search term and category
  const filteredData = data.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort data based on sort configuration
  const sortedData = React.useMemo(() => {
    let sortableData = [...filteredData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  // Handle sorting when a column header is clicked
  const requestSort = (key: keyof CommodityData) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get the unique categories from the data
  const categories = [
    "all",
    ...Array.from(new Set(data.map((item) => item.category))),
  ];

  // Fetch data and set up real-time updates
  useEffect(() => {
    // Initial data fetch
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const newData = await fetchAllPriceData();
        if (newData.length > 0) {
          setData(newData);
        }
      } catch (error) {
        console.error("Error fetching price data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up real-time updates
    const removeListener = priceWebSocket.addListener((newData) => {
      setData((prevData) => {
        // Merge new data with existing data
        const dataMap = new Map(prevData.map((item) => [item.id, item]));

        // Update existing items and add new ones
        newData.forEach((item) => {
          dataMap.set(item.id, item);
        });

        return Array.from(dataMap.values());
      });
    });

    // Clean up
    return () => {
      removeListener();
    };
  }, []);

  // Handle refresh button click
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const newData = await fetchAllPriceData();
      if (newData.length > 0) {
        setData(newData);
      }
    } catch (error) {
      console.error("Error refreshing price data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle export data
  const handleExportData = () => {
    const csvContent = [
      // CSV header
      [
        "Name",
        "Price",
        "Unit",
        "Currency",
        "Change",
        "Change %",
        "Timestamp",
        "Source",
        "Category",
      ].join(","),
      // CSV rows
      ...sortedData.map((item) =>
        [
          item.name,
          item.price,
          item.unit,
          item.currency,
          item.change,
          item.changePercentage,
          item.timestamp,
          item.source,
          item.category,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "commodity_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Show source information dialog
  const handleShowSourceInfo = (item: CommodityData) => {
    setSelectedSource(item);
    setShowSourceInfo(true);
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-xl font-bold">
            Commodity Price Data
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleExportData}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search commodities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableCaption>
              Showing {sortedData.length} of {data.length} commodities
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => requestSort("name")}
                >
                  Commodity
                  {sortConfig?.key === "name" && (
                    <span className="ml-1">
                      {sortConfig.direction === "ascending" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer hover:bg-gray-50"
                  onClick={() => requestSort("price")}
                >
                  Price
                  {sortConfig?.key === "price" && (
                    <span className="ml-1">
                      {sortConfig.direction === "ascending" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer hover:bg-gray-50"
                  onClick={() => requestSort("change")}
                >
                  Change
                  {sortConfig?.key === "change" && (
                    <span className="ml-1">
                      {sortConfig.direction === "ascending" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer hover:bg-gray-50"
                  onClick={() => requestSort("timestamp")}
                >
                  Updated
                  {sortConfig?.key === "timestamp" && (
                    <span className="ml-1">
                      {sortConfig.direction === "ascending" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer hover:bg-gray-50"
                  onClick={() => requestSort("source")}
                >
                  Source
                  {sortConfig?.key === "source" && (
                    <span className="ml-1">
                      {sortConfig.direction === "ascending" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
                <TableHead className="text-right">Info</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading data...
                  </TableCell>
                </TableRow>
              ) : sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No commodities found
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{item.name}</span>
                        <Badge variant="outline" className="w-fit mt-1">
                          {item.category}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.price.toFixed(2)} {item.currency}/{item.unit}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          item.change >= 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        {item.change >= 0 ? "+" : ""}
                        {item.change.toFixed(2)} (
                        {item.changePercentage.toFixed(2)}%)
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {new Date(item.timestamp).toLocaleDateString()}
                          </TooltipTrigger>
                          <TooltipContent>
                            {new Date(item.timestamp).toLocaleString()}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right">{item.source}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-8 w-8"
                        onClick={() => handleShowSourceInfo(item)}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={showSourceInfo} onOpenChange={setShowSourceInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Source Information</DialogTitle>
            <DialogDescription>
              Details about the data source for {selectedSource?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedSource && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-semibold">Source:</div>
                <div>{selectedSource.source}</div>

                <div className="font-semibold">URL:</div>
                <div>
                  <a
                    href={selectedSource.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {selectedSource.sourceUrl}
                  </a>
                </div>

                <div className="font-semibold">Last Updated:</div>
                <div>{new Date(selectedSource.timestamp).toLocaleString()}</div>

                <div className="font-semibold">Commodity:</div>
                <div>{selectedSource.name}</div>

                <div className="font-semibold">Category:</div>
                <div>{selectedSource.category}</div>

                <div className="font-semibold">Current Price:</div>
                <div>
                  {selectedSource.price.toFixed(2)} {selectedSource.currency}/
                  {selectedSource.unit}
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  This data is provided for informational purposes only. Please
                  refer to the original source for the most accurate and
                  up-to-date information.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// Mock data for demonstration
const mockData: CommodityData[] = [
  {
    id: "1",
    name: "Wheat (Hard Red Winter)",
    price: 6.75,
    unit: "bushel",
    currency: "USD",
    change: 0.15,
    changePercentage: 2.27,
    timestamp: "2023-06-15T14:30:00Z",
    source: "USDA",
    sourceUrl: "https://www.usda.gov/oce/commodity/wasde",
    category: "grains",
  },
  {
    id: "2",
    name: "Corn",
    price: 4.25,
    unit: "bushel",
    currency: "USD",
    change: -0.08,
    changePercentage: -1.85,
    timestamp: "2023-06-15T14:30:00Z",
    source: "CME Group",
    sourceUrl: "https://www.cmegroup.com/markets/agriculture/grains/corn.html",
    category: "grains",
  },
  {
    id: "3",
    name: "Soybeans",
    price: 13.85,
    unit: "bushel",
    currency: "USD",
    change: 0.23,
    changePercentage: 1.69,
    timestamp: "2023-06-15T14:30:00Z",
    source: "CME Group",
    sourceUrl:
      "https://www.cmegroup.com/markets/agriculture/oilseeds/soybean.html",
    category: "oilseeds",
  },
  {
    id: "4",
    name: "Coffee (Arabica)",
    price: 185.75,
    unit: "lb",
    currency: "USD",
    change: 3.25,
    changePercentage: 1.78,
    timestamp: "2023-06-15T14:30:00Z",
    source: "ICE",
    sourceUrl: "https://www.theice.com/products/15/Coffee-C-Futures",
    category: "softs",
  },
  {
    id: "5",
    name: "Cotton",
    price: 82.45,
    unit: "lb",
    currency: "USD",
    change: -1.15,
    changePercentage: -1.38,
    timestamp: "2023-06-15T14:30:00Z",
    source: "ICE",
    sourceUrl: "https://www.theice.com/products/254/Cotton-No-2-Futures",
    category: "softs",
  },
  {
    id: "6",
    name: "Sugar (Raw)",
    price: 19.85,
    unit: "lb",
    currency: "USD",
    change: 0.35,
    changePercentage: 1.79,
    timestamp: "2023-06-15T14:30:00Z",
    source: "ICE",
    sourceUrl: "https://www.theice.com/products/23/Sugar-No-11-Futures",
    category: "softs",
  },
  {
    id: "7",
    name: "Rice (Rough)",
    price: 17.25,
    unit: "cwt",
    currency: "USD",
    change: -0.05,
    changePercentage: -0.29,
    timestamp: "2023-06-15T14:30:00Z",
    source: "CME Group",
    sourceUrl:
      "https://www.cmegroup.com/markets/agriculture/grains/rough-rice.html",
    category: "grains",
  },
  {
    id: "8",
    name: "Cattle (Live)",
    price: 175.85,
    unit: "cwt",
    currency: "USD",
    change: 1.25,
    changePercentage: 0.72,
    timestamp: "2023-06-15T14:30:00Z",
    source: "CME Group",
    sourceUrl:
      "https://www.cmegroup.com/markets/agriculture/livestock/live-cattle.html",
    category: "livestock",
  },
  {
    id: "9",
    name: "Hogs (Lean)",
    price: 85.45,
    unit: "cwt",
    currency: "USD",
    change: -0.75,
    changePercentage: -0.87,
    timestamp: "2023-06-15T14:30:00Z",
    source: "CME Group",
    sourceUrl:
      "https://www.cmegroup.com/markets/agriculture/livestock/lean-hogs.html",
    category: "livestock",
  },
  {
    id: "10",
    name: "Cocoa",
    price: 3245.5,
    unit: "ton",
    currency: "USD",
    change: 45.25,
    changePercentage: 1.41,
    timestamp: "2023-06-15T14:30:00Z",
    source: "ICE",
    sourceUrl: "https://www.theice.com/products/7/Cocoa-Futures",
    category: "softs",
  },
];

export default DataTable;
