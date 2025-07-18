"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout, DashboardHeader } from "@/components/ui/dashboard";
import { Sidebar } from "@/components/ui/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    status: "",
    condition: "",
    search: "",
  });

  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

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
        setError(response.error || "Failed to fetch devices.");
      }
    } catch (err) {
      setError("Failed to fetch devices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [currentPage, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "maintenance":
        return "outline";
      case "inactive":
        return "secondary";
      case "damaged":
      case "lost":
        return "destructive";
      case "disposed":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getConditionBadgeVariant = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "success";
      case "good":
        return "rtb";
      case "fair":
        return "outline";
      case "poor":
      case "broken":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const toggleDropdown = (id: number) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  const header = (
    <DashboardHeader
      title="Devices"
      description="All devices registered in the RTB system"
    />
  );

  const sidebar = <Sidebar items={sidebarItems} />;

  return (
    <ProtectedRoute allowedRoles={["admin", "rtb-staff", "school", "technician"]}>
      <div className="dashboard-dark">
        <DashboardLayout header={header} sidebar={sidebar}>
          {/* Filters Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-4">
              <input
                type="text"
                placeholder="Search devices..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
                <option value="damaged">Damaged</option>
                <option value="lost">Lost</option>
                <option value="disposed">Disposed</option>
              </select>
              <select
                value={filters.condition}
                onChange={(e) => handleFilterChange("condition", e.target.value)}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="">All Conditions</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
                <option value="broken">Broken</option>
              </select>
              <Button
                variant="rtb-outline"
                onClick={() => setFilters({ search: "", status: "", condition: "" })}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>

          {/* Devices Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                Devices ({total})
                <Link href="/devices/add">
                  <Button variant="rtb" size="sm" className="ml-4">
                    Add Device
                  </Button>
                </Link>
              </CardTitle>
              <CardDescription>
                Page {currentPage} of {totalPages}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-6">Loading devices...</div>
              ) : error ? (
                <div className="text-center text-red-600 py-6">{error}</div>
              ) : devices.length === 0 ? (
                <div className="text-center py-6">No devices found</div>
              ) : (
                <table className="w-full table-auto border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">#</th>
                      <th className="border p-2">Name Tag</th>
                      <th className="border p-2">Serial Number</th>
                      <th className="border p-2">Model</th>
                      <th className="border p-2">Brand</th>
                      <th className="border p-2">Category</th>
                      <th className="border p-2">Status</th>
                      <th className="border p-2">Condition</th>
                      <th className="border p-2">Purchase Date</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map((device, index) => (
                      <tr key={device.id} className="text-center relative">
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2">{device.name_tag || "-"}</td>
                        <td className="border p-2">{device.serialNumber}</td>
                        <td className="border p-2">{device.model}</td>
                        <td className="border p-2">{device.brand}</td>
                        <td className="border p-2">{device.category}</td>
                        <td className="border p-2">
                          <Badge variant={getStatusBadgeVariant(device.status)}>
                            {device.status}
                          </Badge>
                        </td>
                        <td className="border p-2">
                          <Badge variant={getConditionBadgeVariant(device.condition)}>
                            {device.condition}
                          </Badge>
                        </td>
                        <td className="border p-2">{device.purchaseDate}</td>
                        <td className="border p-2 text-left relative">
                          {/* 3-dot button */}
                          <button
                            onClick={() => toggleDropdown(device.id)}
                            className="p-1 rounded hover:bg-gray-200"
                            aria-label="Open actions menu"
                          >
                            ⋮
                          </button>

                          {/* Dropdown menu */}
                          {openDropdownId === device.id && (
                            <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-gray-300 rounded shadow-md z-10">
                              <Link href={`/devices/${device.id}`}>
                                <a
                                  onClick={() => setOpenDropdownId(null)}
                                  className="block px-3 py-2 hover:bg-gray-100"
                                >
                                  View
                                </a>
                              </Link>
                              <Link href={`/devices/${device.id}/assign`}>
                                <a
                                  onClick={() => setOpenDropdownId(null)}
                                  className="block px-3 py-2 hover:bg-gray-100"
                                >
                                  Assign
                                </a>
                              </Link>
                              <Link href={`/devices/${device.id}/edit`}>
                                <a
                                  onClick={() => setOpenDropdownId(null)}
                                  className="block px-3 py-2 hover:bg-gray-100"
                                >
                                  Edit
                                </a>
                              </Link>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-4 mt-4">
                  <Button
                    variant="rtb-outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="self-center">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="rtb-outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
