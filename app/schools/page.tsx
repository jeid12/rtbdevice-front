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
import { apiService, School } from "@/lib/api";

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard", icon: () => <span>📊</span> },
  { title: "Devices", href: "/devices", icon: () => <span>💻</span>, badge: "10.5K" },
  { title: "Schools", href: "/schools", icon: () => <span>🏫</span>, badge: "127" },
  { title: "Users", href: "/users", icon: () => <span>👥</span>, badge: "845" },
  { title: "Analytics", href: "/analytics", icon: () => <span>📈</span> },
  { title: "Reports", href: "/reports", icon: () => <span>📋</span> },
  { title: "Settings", href: "/settings", icon: () => <span>⚙️</span> },
];

export default function SchoolsPage() {
  const { user } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    district: '',
    search: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getSchools({
          page: currentPage,
          limit: 10,
          ...(filters.type && { type: filters.type }),
          ...(filters.status && { status: filters.status }),
          ...(filters.district && { district: filters.district }),
          ...(filters.search && { search: filters.search }),
        });

        if (response.success && response.data) {
          setSchools(response.data.schools);
          setTotalPages(response.data.pages);
          setTotal(response.data.total);
        } else {
          setError(response.error || 'Failed to fetch schools');
        }
      } catch (err) {
        console.error('Error fetching schools:', err);
        setError('Failed to fetch schools');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, filters]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'suspended':
        return 'destructive';
      case 'pending':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'tvet':
        return 'rtb';
      case 'university':
        return 'success';
      case 'secondary':
        return 'outline';
      case 'primary':
        return 'outline';
      case 'other':
        return 'secondary';
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
      title="School Management"
      description="Manage TVET institutions across Rwanda"
    >
      <div className="flex items-center space-x-4">
        <Button variant="rtb-outline" size="sm">
          Export List
        </Button>
        <Button variant="rtb-outline" size="sm">
          Bulk Import
        </Button>
        {(user?.role === 'admin' || user?.role === 'rtb-staff') && (
          <Link href="/schools/add">
            <Button variant="rtb" size="sm">
              Add School
            </Button>
          </Link>
        )}
      </div>
    </DashboardHeader>
  );

  const sidebar = <Sidebar items={sidebarItems} />;

  return (
    <ProtectedRoute allowedRoles={['admin', 'rtb-staff', 'school']}>
      <div className="dashboard-dark">
        <DashboardLayout header={header} sidebar={sidebar}>
          <div className="space-y-6">
            
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-rtb-primary">Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label htmlFor="search-input" className="block text-sm font-medium mb-2">Search</label>
                    <input
                      id="search-input"
                      type="text"
                      placeholder="Search schools..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rtb-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="type-filter" className="block text-sm font-medium mb-2">Type</label>
                    <select
                      id="type-filter"
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rtb-primary"
                    >
                      <option value="">All Types</option>
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                      <option value="tvet">TVET</option>
                      <option value="university">University</option>
                      <option value="other">Other</option>
                    </select>
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
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="district-filter" className="block text-sm font-medium mb-2">District</label>
                    <input
                      id="district-filter"
                      type="text"
                      placeholder="Filter by district..."
                      value={filters.district}
                      onChange={(e) => handleFilterChange('district', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rtb-primary"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      variant="rtb-outline" 
                      onClick={() => {
                        setFilters({ type: '', status: '', district: '', search: '' });
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

            {/* Schools List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-rtb-primary">Schools ({total})</span>
                  <Badge variant="rtb" className="text-xs">
                    Page {currentPage} of {totalPages}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  TVET institutions registered in the RTB system
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
                    <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
                  </div>
                ) : schools.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No schools found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {schools.map((school) => (
                      <div 
                        key={school.id} 
                        className="flex items-center justify-between p-4 rounded-lg bg-white border border-slate-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">🏫</div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{school.name}</h3>
                            <p className="text-sm text-slate-600">Code: {school.code}</p>
                            <p className="text-xs text-slate-500">{school.district}, {school.sector}</p>
                            {school.principalName && (
                              <p className="text-xs text-slate-500">Principal: {school.principalName}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <Badge 
                              variant={getStatusBadgeVariant(school.status)}
                              className="mb-1"
                            >
                              {school.status}
                            </Badge>
                            <br />
                            <Badge 
                              variant={getTypeBadgeVariant(school.type)}
                              className="text-xs"
                            >
                              {school.type}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-col space-y-2">
                            <Link href={`/schools/${school.id}`}>
                              <Button variant="rtb-outline" size="sm">
                                View
                              </Button>
                            </Link>
                            {(user?.role === 'admin' || user?.role === 'rtb-staff') && (
                              <Link href={`/schools/${school.id}/edit`}>
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
