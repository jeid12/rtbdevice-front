"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout, DashboardHeader } from "@/components/ui/dashboard";
import { Sidebar } from "@/components/ui/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, Device } from "@/lib/api";

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard", icon: () => <span>📊</span> },
  { title: "Devices", href: "/devices", icon: () => <span>💻</span>, badge: "10.5K" },
  { title: "Schools", href: "/schools", icon: () => <span>🏫</span>, badge: "127" },
  { title: "Users", href: "/users", icon: () => <span>👥</span>, badge: "845" },
  { title: "Analytics", href: "/analytics", icon: () => <span>📈</span> },
  { title: "Reports", href: "/reports", icon: () => <span>📋</span> },
  { title: "Settings", href: "/settings", icon: () => <span>⚙️</span> },
];

export default function DevicesPage() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    status: '',
    condition: '',
    search: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getDevices({
          page: currentPage,
          limit: 10,
          ...(filters.status && { status: filters.status }),
          ...(filters.condition && { condition: filters.condition }),
          ...(filters.search && { search: filters.search }),
        });

        if (response.success && response.data) {
          setDevices(response.data.devices);
          setTotalPages(response.data.pages);
          setTotal(response.data.total);
        } else {
          setError(response.error || 'Failed to fetch devices');
        }
      } catch (err) {
        console.error('Error fetching devices:', err);
        setError('Failed to fetch devices');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, filters]);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDevices({
        page: currentPage,
        limit: 10,
        ...(filters.status && { status: filters.status }),
        ...(filters.condition && { condition: filters.condition }),
        ...(filters.search && { search: filters.search }),
      });

      if (response.success && response.data) {
        setDevices(response.data.devices);
        setTotalPages(response.data.pages);
        setTotal(response.data.total);
      } else {
        setError(response.error || 'Failed to fetch devices');
      }
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError('Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'outline';
      case 'inactive':
        return 'secondary';
      case 'damaged':
        return 'destructive';
      case 'lost':
        return 'destructive';
      case 'disposed':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getConditionBadgeVariant = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'success';
      case 'good':
        return 'rtb';
      case 'fair':
        return 'outline';
      case 'poor':
        return 'destructive';
      case 'broken':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const header = (
    <DashboardHeader
      title="Device Management"
      description="Manage and monitor TVET devices across all institutions"
    >
      <div className="flex items-center space-x-4">
        <Button variant="rtb-outline" size="sm">
          Export List
        </Button>
        <Button variant="rtb-outline" size="sm">
          Bulk Import
        </Button>
        <Link href="/devices/add">
          <Button variant="rtb" size="sm">
            Add Device
          </Button>
        </Link>
      </div>
    </DashboardHeader>
  );

  const sidebar = <Sidebar items={sidebarItems} />;

  return (
    <ProtectedRoute allowedRoles={['admin', 'rtb-staff', 'school', 'technician']}>
      <div className="dashboard-dark">
        <DashboardLayout header={header} sidebar={sidebar}>
          <div className="space-y-6">
            
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-rtb-primary">Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Search</label>
                    <input
                      type="text"
                      placeholder="Search devices..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rtb-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="status-filter" className="block text-sm font-medium mb-2">Status</label>
                    <select
                      id="status-filter"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rtb-primary"
                    >
                      <option value="">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="damaged">Damaged</option>
                      <option value="lost">Lost</option>
                      <option value="disposed">Disposed</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="condition-filter" className="block text-sm font-medium mb-2">Condition</label>
                    <select
                      id="condition-filter"
                      value={filters.condition}
                      onChange={(e) => handleFilterChange('condition', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rtb-primary"
                    >
                      <option value="">All Conditions</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                      <option value="broken">Broken</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      variant="rtb-outline" 
                      onClick={() => {
                        setFilters({ status: '', condition: '', search: '' });
                        setCurrentPage(1);
                      }}
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Devices List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-rtb-primary">Devices ({total})</span>
                  <Badge variant="rtb" className="text-xs">
                    Page {currentPage} of {totalPages}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  All devices registered in the RTB system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rtb-primary"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-600">
                    <p>{error}</p>
                    <Button onClick={fetchDevices} className="mt-4">Retry</Button>
                  </div>
                ) : Array.isArray(devices) && devices.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No devices found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Array.isArray(devices) && devices.map((device) => (
                      <div 
                        key={device.id} 
                        className="flex items-center justify-between p-4 rounded-lg bg-white border border-slate-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">💻</div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{device.name_tag}</h3>
                            <p className="text-sm text-slate-600">{device.brand} {device.model}</p>
                            <p className="text-xs text-slate-500">Serial: {device.serialNumber}</p>
                            {device.location && (
                              <p className="text-xs text-slate-500">Location: {device.location}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <Badge 
                              variant={getStatusBadgeVariant(device.status)}
                              className="mb-1"
                            >
                              {device.status}
                            </Badge>
                            <br />
                            <Badge 
                              variant={getConditionBadgeVariant(device.condition)}
                              className="text-xs"
                            >
                              {device.condition}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-col space-y-2">
                            <Link href={`/devices/${device.id}`}>
                              <Button variant="rtb-outline" size="sm">
                                View
                              </Button>
                            </Link>
                            {(user?.role === 'admin' || user?.role === 'rtb-staff') && (
                              <Link href={`/devices/${device.id}/edit`}>
                                <Button variant="rtb" size="sm">
                                  Edit
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-6">
                    <Button
                      variant="rtb-outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <Button
                      variant="rtb-outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
