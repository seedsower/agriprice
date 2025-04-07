import React, { useState } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Commodity {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  currency: string;
  priceChange: number;
  priceChangePercentage: number;
  lastUpdated: string;
}

interface CommodityListProps {
  commodities?: Commodity[];
  onCommoditySelect?: (commodity: Commodity) => void;
  onAddToChart?: (commodity: Commodity) => void;
}

const CommodityList = ({
  commodities = [
    {
      id: "1",
      name: "Wheat",
      category: "Grains",
      currentPrice: 245.67,
      currency: "USD",
      priceChange: 2.34,
      priceChangePercentage: 0.96,
      lastUpdated: "2023-06-15T14:30:00Z",
    },
    {
      id: "2",
      name: "Corn",
      category: "Grains",
      currentPrice: 176.89,
      currency: "USD",
      priceChange: -1.23,
      priceChangePercentage: -0.69,
      lastUpdated: "2023-06-15T14:30:00Z",
    },
    {
      id: "3",
      name: "Soybeans",
      category: "Grains",
      currentPrice: 543.21,
      currency: "USD",
      priceChange: 5.67,
      priceChangePercentage: 1.05,
      lastUpdated: "2023-06-15T14:30:00Z",
    },
    {
      id: "4",
      name: "Coffee",
      category: "Soft Commodities",
      currentPrice: 187.45,
      currency: "USD",
      priceChange: 3.21,
      priceChangePercentage: 1.74,
      lastUpdated: "2023-06-15T14:30:00Z",
    },
    {
      id: "5",
      name: "Cotton",
      category: "Soft Commodities",
      currentPrice: 89.32,
      currency: "USD",
      priceChange: -0.45,
      priceChangePercentage: -0.5,
      lastUpdated: "2023-06-15T14:30:00Z",
    },
    {
      id: "6",
      name: "Sugar",
      category: "Soft Commodities",
      currentPrice: 21.78,
      currency: "USD",
      priceChange: 0.34,
      priceChangePercentage: 1.59,
      lastUpdated: "2023-06-15T14:30:00Z",
    },
    {
      id: "7",
      name: "Rice",
      category: "Grains",
      currentPrice: 18.45,
      currency: "USD",
      priceChange: 0.12,
      priceChangePercentage: 0.65,
      lastUpdated: "2023-06-15T14:30:00Z",
    },
    {
      id: "8",
      name: "Cattle",
      category: "Livestock",
      currentPrice: 178.56,
      currency: "USD",
      priceChange: -2.34,
      priceChangePercentage: -1.29,
      lastUpdated: "2023-06-15T14:30:00Z",
    },
    {
      id: "9",
      name: "Hogs",
      category: "Livestock",
      currentPrice: 92.45,
      currency: "USD",
      priceChange: 1.23,
      priceChangePercentage: 1.35,
      lastUpdated: "2023-06-15T14:30:00Z",
    },
    {
      id: "10",
      name: "Cocoa",
      category: "Soft Commodities",
      currentPrice: 3245.67,
      currency: "USD",
      priceChange: 45.67,
      priceChangePercentage: 1.43,
      lastUpdated: "2023-06-15T14:30:00Z",
    },
  ],
  onCommoditySelect = () => {},
  onAddToChart = () => {},
}: CommodityListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Commodity;
    direction: "ascending" | "descending";
  } | null>(null);

  // Get unique categories
  const categories = Array.from(new Set(commodities.map((c) => c.category)));

  // Filter commodities based on search term and selected category
  const filteredCommodities = commodities.filter((commodity) => {
    const matchesSearch = commodity.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? commodity.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  // Sort commodities if sort config is set
  const sortedCommodities = [...filteredCommodities].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Handle sort
  const requestSort = (key: keyof Commodity) => {
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

  return (
    <Card className="w-full h-full bg-background">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Commodity List</CardTitle>
        <div className="flex flex-col space-y-2 mt-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search commodities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {selectedCategory || "All Categories"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                  All Categories
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              onClick={() => requestSort("currentPrice")}
              className="flex items-center"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort by Price
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[450px] pr-4">
          <div className="space-y-2">
            {sortedCommodities.map((commodity) => (
              <div
                key={commodity.id}
                className="p-3 rounded-md border hover:bg-accent cursor-pointer transition-colors"
                onClick={() => onCommoditySelect(commodity)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{commodity.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {commodity.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {commodity.currency} {commodity.currentPrice.toFixed(2)}
                    </p>
                    <p
                      className={`text-sm flex items-center ${
                        commodity.priceChange >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {commodity.priceChange >= 0 ? (
                        <ChevronUp className="h-3 w-3 mr-1" />
                      ) : (
                        <ChevronDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(commodity.priceChange).toFixed(2)} (
                      {Math.abs(commodity.priceChangePercentage).toFixed(2)}%)
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    Last updated:{" "}
                    {new Date(commodity.lastUpdated).toLocaleString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToChart(commodity);
                    }}
                  >
                    Add to Chart
                  </Button>
                </div>
              </div>
            ))}
            {sortedCommodities.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                No commodities found matching your criteria.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CommodityList;
