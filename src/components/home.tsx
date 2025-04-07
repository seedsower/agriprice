import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, ChevronDown, LogIn, Menu, UserPlus } from "lucide-react";
import PriceChart from "./PriceChart";
import CommodityList from "./CommodityList";
import AlertsManager from "./AlertsManager";
import DataTable from "./DataTable";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">AgriPrice Hub</h1>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost">Dashboard</Button>
            <Button variant="ghost">Commodities</Button>
            <Button variant="ghost">API Docs</Button>
            <Button variant="ghost">About</Button>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
                      alt="User"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">John Doe</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="flex items-center gap-1">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden md:inline">Login</span>
                </Button>
                <Button className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden md:inline">Register</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t p-4 bg-background">
            <div className="flex flex-col space-y-2">
              <Button variant="ghost" className="justify-start">
                Dashboard
              </Button>
              <Button variant="ghost" className="justify-start">
                Commodities
              </Button>
              <Button variant="ghost" className="justify-start">
                API Docs
              </Button>
              <Button variant="ghost" className="justify-start">
                About
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="container px-4 py-6">
        {/* Dashboard header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Commodity Price Dashboard
          </h2>
          <p className="text-muted-foreground">
            Track real-time and historical agricultural commodity prices from
            multiple sources.
          </p>
        </div>

        {/* Dashboard content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Main content area - spans 2 columns on larger screens */}
          <div className="space-y-6 md:col-span-2">
            {/* Price chart card */}
            <Card>
              <CardHeader>
                <CardTitle>Price Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <PriceChart />
              </CardContent>
            </Card>

            {/* Data table card */}
            <Card>
              <CardHeader>
                <CardTitle>Commodity Price Data</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All Commodities</TabsTrigger>
                    <TabsTrigger value="grains">Grains</TabsTrigger>
                    <TabsTrigger value="livestock">Livestock</TabsTrigger>
                    <TabsTrigger value="softs">Softs</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <DataTable />
                  </TabsContent>
                  <TabsContent value="grains">
                    <DataTable />
                  </TabsContent>
                  <TabsContent value="livestock">
                    <DataTable />
                  </TabsContent>
                  <TabsContent value="softs">
                    <DataTable />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - takes 1 column */}
          <div className="space-y-6">
            {/* Commodity list card */}
            <Card>
              <CardHeader>
                <CardTitle>Commodities</CardTitle>
              </CardHeader>
              <CardContent>
                <CommodityList />
              </CardContent>
            </Card>

            {/* Alerts manager card */}
            <Card>
              <CardHeader>
                <CardTitle>Price Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                {isAuthenticated ? (
                  <AlertsManager />
                ) : (
                  <div className="text-center p-4">
                    <p className="mb-4 text-muted-foreground">
                      Login or register to set price alerts
                    </p>
                    <Button>Sign In to Use Alerts</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container px-4 py-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold mb-2">AgriPrice Hub</h3>
              <p className="text-sm text-muted-foreground">
                Real-time agricultural commodity price data from multiple
                sources.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    API Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Legal</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Data Sources
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 border-t pt-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} AgriPrice Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
