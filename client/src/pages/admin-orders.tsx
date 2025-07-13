import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Eye, Package, Truck, CheckCircle, Filter, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format, parseISO, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import { Link } from "wouter";
import type { Order } from "@shared/schema";

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
  });

  // Filter orders based on status and date
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by date range
    if (startDate || endDate) {
      filtered = filtered.filter(order => {
        const orderDate = parseISO(order.createdAt);
        const start = startDate ? startOfDay(parseISO(startDate)) : null;
        const end = endDate ? endOfDay(parseISO(endDate)) : null;

        if (start && end) {
          return !isBefore(orderDate, start) && !isAfter(orderDate, end);
        } else if (start) {
          return !isBefore(orderDate, start);
        } else if (end) {
          return !isAfter(orderDate, end);
        }
        return true;
      });
    }

    // Filter by specific date
    if (dateFilter) {
      filtered = filtered.filter(order => {
        const orderDate = format(parseISO(order.createdAt), "yyyy-MM-dd");
        return orderDate === dateFilter;
      });
    }

    return filtered;
  }, [orders, statusFilter, startDate, endDate, dateFilter]);

  const clearFilters = () => {
    setStatusFilter("all");
    setDateFilter("");
    setStartDate("");
    setEndDate("");
  };

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      apiRequest(`/api/orders/${id}/status`, "PUT", { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({ title: "Order status updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update order status", variant: "destructive" });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "confirmed":
        return <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>;
      case "preparing":
        return <Badge className="bg-orange-100 text-orange-800">Preparing</Badge>;
      case "out_for_delivery":
        return <Badge className="bg-purple-100 text-purple-800">Out for Delivery</Badge>;
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Package className="w-4 h-4" />;
      case "confirmed":
      case "preparing":
        return <Package className="w-4 h-4" />;
      case "out_for_delivery":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <div className="flex space-x-2 mt-2">
              <Link href="/admin">
                <Button variant="outline">
                  Products
                </Button>
              </Link>
              <Button variant="default" className="bg-primary">
                Orders
              </Button>
              <Link href="/admin/config">
                <Button variant="outline">
                  Configuration
                </Button>
              </Link>
            </div>
          </div>
          <p className="text-muted-foreground mt-4">Manage and track all customer orders</p>
          
          {/* Filter Controls */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Filters</span>
                <Badge variant="secondary">{filteredOrders.length} orders</Badge>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
                {(statusFilter !== "all" || dateFilter || startDate || endDate) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {showFilters && (
              <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Specific Date Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Specific Date</label>
                    <Input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => {
                        setDateFilter(e.target.value);
                        // Clear date range when using specific date
                        if (e.target.value) {
                          setStartDate("");
                          setEndDate("");
                        }
                      }}
                      placeholder="Select date"
                    />
                  </div>

                  {/* Start Date Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">From Date</label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        // Clear specific date when using range
                        if (e.target.value) {
                          setDateFilter("");
                        }
                      }}
                      placeholder="Start date"
                    />
                  </div>

                  {/* End Date Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">To Date</label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        // Clear specific date when using range
                        if (e.target.value) {
                          setDateFilter("");
                        }
                      }}
                      placeholder="End date"
                    />
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="h-32 bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
            <p className="text-muted-foreground">
              {orders.length === 0 
                ? "Orders will appear here when customers place them."
                : "No orders match the current filters. Try adjusting your filter criteria."
              }
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.createdAt), "MMM dd, yyyy 'at' hh:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">₹{order.total}</p>
                      <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(order.status)}
                    
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">Customer</p>
                      <p>{order.sessionId}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Delivery Address</p>
                      <p>{order.address}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Phone</p>
                      <p>{order.phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details - #{selectedOrder?.id}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Status:</span> {getStatusBadge(selectedOrder.status)}</p>
                      <p><span className="font-medium">Total:</span> ₹{selectedOrder.total}</p>
                      <p><span className="font-medium">Payment:</span> {selectedOrder.paymentMethod}</p>
                      <p><span className="font-medium">Order Date:</span> {format(new Date(selectedOrder.createdAt), "MMM dd, yyyy 'at' hh:mm a")}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Delivery Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Address:</span> {selectedOrder.address}</p>
                      <p><span className="font-medium">Phone:</span> {selectedOrder.phone || "Not provided"}</p>
                      <p><span className="font-medium">Session ID:</span> {selectedOrder.sessionId}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {JSON.parse(selectedOrder.items).map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.brand}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{item.price} x {item.quantity}</p>
                          <p className="text-sm text-muted-foreground">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}