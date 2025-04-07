import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Download, ZoomIn, ZoomOut } from "lucide-react";

interface PriceChartProps {
  commodities?: string[];
  data?: {
    date: string;
    price: number;
    commodity: string;
  }[];
}

const PriceChart = ({
  commodities = ["Wheat", "Corn", "Soybeans", "Coffee", "Cotton"],
  data = [],
}: PriceChartProps) => {
  const [selectedCommodities, setSelectedCommodities] = useState<string[]>([
    "Wheat",
  ]);
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    to: new Date(),
  });
  const [chartType, setChartType] = useState("line");

  // Generate mock data if none provided
  const chartData = data.length > 0 ? data : generateMockData();

  function generateMockData() {
    const mockData = [];
    const commoditiesList = ["Wheat", "Corn", "Soybeans", "Coffee", "Cotton"];
    const today = new Date();

    for (let i = 0; i < 90; i++) {
      // 3 months of daily data
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      for (const commodity of commoditiesList) {
        // Base price varies by commodity
        let basePrice = 0;
        switch (commodity) {
          case "Wheat":
            basePrice = 700;
            break;
          case "Corn":
            basePrice = 400;
            break;
          case "Soybeans":
            basePrice = 1200;
            break;
          case "Coffee":
            basePrice = 180;
            break;
          case "Cotton":
            basePrice = 90;
            break;
          default:
            basePrice = 500;
        }

        // Add some random variation
        const randomVariation = (Math.random() - 0.5) * 20;
        // Add a slight trend
        const trend = i * 0.1;

        mockData.push({
          date: format(date, "yyyy-MM-dd"),
          price: basePrice + randomVariation - trend,
          commodity,
        });
      }
    }

    return mockData;
  }

  const toggleCommodity = (commodity: string) => {
    if (selectedCommodities.includes(commodity)) {
      setSelectedCommodities(
        selectedCommodities.filter((c) => c !== commodity),
      );
    } else {
      setSelectedCommodities([...selectedCommodities, commodity]);
    }
  };

  const handleExport = () => {
    // In a real implementation, this would export the chart data to CSV or similar
    console.log("Exporting chart data...");
    alert("Chart data would be exported here");
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">
          Commodity Price Trends
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Tabs
            defaultValue="line"
            value={chartType}
            onValueChange={setChartType}
            className="w-[200px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="line">Line</TabsTrigger>
              <TabsTrigger value="bar">Bar</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-wrap gap-2 mb-2">
              {commodities.map((commodity) => (
                <Button
                  key={commodity}
                  variant={
                    selectedCommodities.includes(commodity)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => toggleCommodity(commodity)}
                >
                  {commodity}
                </Button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-[240px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => range && setDateRange(range)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Select defaultValue="daily">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative h-[300px] w-full border rounded-md p-4 flex items-center justify-center bg-slate-50">
            {/* Chart would be rendered here using a library like Recharts */}
            <div className="text-center text-muted-foreground">
              {selectedCommodities.length > 0 ? (
                <div>
                  <p className="mb-2">Chart visualization would appear here</p>
                  <p className="text-sm">
                    Showing data for: {selectedCommodities.join(", ")}
                  </p>
                  <p className="text-sm">
                    Date range:{" "}
                    {dateRange.from
                      ? format(dateRange.from, "MMM d, yyyy")
                      : ""}
                    {dateRange.from ? " to " : ""}
                    {dateRange.to ? format(dateRange.to, "MMM d, yyyy") : ""}
                  </p>
                  <p className="text-sm">Chart type: {chartType}</p>
                </div>
              ) : (
                <p>Please select at least one commodity to display</p>
              )}
            </div>

            {/* Chart controls */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <Button variant="outline" size="icon">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>
              Data sources: USDA, CME Group, ICE Futures. Last updated:{" "}
              {format(new Date(), "MMMM d, yyyy h:mm a")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
