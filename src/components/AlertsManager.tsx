import React, { useState } from "react";
import { PlusCircle, Bell, Edit, Trash2, AlertTriangle, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";

interface Alert {
  id: string;
  commodity: string;
  threshold: number;
  condition: "above" | "below";
  notifyBy: ("email" | "sms")[];
  active: boolean;
  createdAt: string;
}

const AlertsManager = ({ alerts = mockAlerts }: { alerts?: Alert[] }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  const filteredAlerts =
    activeTab === "all"
      ? alerts
      : activeTab === "active"
        ? alerts.filter((alert) => alert.active)
        : alerts.filter((alert) => !alert.active);

  const handleDeleteClick = (id: string) => {
    setSelectedAlertId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // In a real app, this would call an API to delete the alert
    console.log(`Deleting alert ${selectedAlertId}`);
    setIsDeleteDialogOpen(false);
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to create the alert
    console.log("Creating new alert");
    setIsCreateDialogOpen(false);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Price Alerts</CardTitle>
            <CardDescription>
              Get notified when commodity prices reach your thresholds
            </CardDescription>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <PlusCircle className="h-4 w-4" />
                New Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Price Alert</DialogTitle>
                <DialogDescription>
                  Set up an alert to notify you when a commodity price reaches
                  your specified threshold.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateAlert}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="commodity">Commodity</Label>
                    <Select defaultValue="wheat">
                      <SelectTrigger id="commodity">
                        <SelectValue placeholder="Select commodity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="corn">Corn</SelectItem>
                        <SelectItem value="soybeans">Soybeans</SelectItem>
                        <SelectItem value="coffee">Coffee</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select defaultValue="above">
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="above">Price goes above</SelectItem>
                        <SelectItem value="below">Price goes below</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="threshold">Price Threshold (USD)</Label>
                    <Input
                      id="threshold"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Notification Methods</Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="email" />
                      <Label htmlFor="email">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="sms" />
                      <Label htmlFor="sms">SMS</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Alert</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Tabs defaultValue="all" className="mt-2" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          {filteredAlerts.length > 0 ? (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <Card key={alert.id} className="relative overflow-hidden">
                  {!alert.active && (
                    <div className="absolute inset-0 bg-gray-100 bg-opacity-60 flex items-center justify-center">
                      <Badge variant="outline" className="bg-gray-200">
                        Inactive
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg capitalize">
                          {alert.commodity}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Alert when price goes {alert.condition}{" "}
                          <span className="font-semibold">
                            ${alert.threshold.toFixed(2)}
                          </span>
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          {alert.notifyBy.includes("email") && (
                            <Badge variant="secondary" className="text-xs">
                              Email
                            </Badge>
                          )}
                          {alert.notifyBy.includes("sms") && (
                            <Badge variant="secondary" className="text-xs">
                              SMS
                            </Badge>
                          )}
                          <span className="text-xs text-gray-400">
                            Created{" "}
                            {new Date(alert.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(alert.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <Bell className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">No alerts found</h3>
              <p className="text-sm text-gray-500 mt-1">
                {activeTab === "all"
                  ? "Create your first price alert to get started"
                  : `No ${activeTab} alerts found`}
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t pt-4 text-sm text-gray-500">
        <AlertTriangle className="h-4 w-4 mr-2" />
        Price alerts are checked every 15 minutes during market hours
      </CardFooter>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Alert</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this price alert? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// Mock data for demonstration
const mockAlerts: Alert[] = [
  {
    id: "1",
    commodity: "wheat",
    threshold: 7.25,
    condition: "above",
    notifyBy: ["email", "sms"],
    active: true,
    createdAt: "2023-06-15T10:30:00Z",
  },
  {
    id: "2",
    commodity: "corn",
    threshold: 3.85,
    condition: "below",
    notifyBy: ["email"],
    active: true,
    createdAt: "2023-07-22T14:15:00Z",
  },
  {
    id: "3",
    commodity: "soybeans",
    threshold: 12.5,
    condition: "above",
    notifyBy: ["sms"],
    active: false,
    createdAt: "2023-05-10T09:45:00Z",
  },
  {
    id: "4",
    commodity: "coffee",
    threshold: 1.75,
    condition: "below",
    notifyBy: ["email", "sms"],
    active: true,
    createdAt: "2023-08-05T16:20:00Z",
  },
  {
    id: "5",
    commodity: "cotton",
    threshold: 0.85,
    condition: "above",
    notifyBy: ["email"],
    active: false,
    createdAt: "2023-04-30T11:10:00Z",
  },
];

export default AlertsManager;
