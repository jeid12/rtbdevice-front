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
import { apiService, User } from "@/lib/api";

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard", icon: () => <span>📊</span> },
  { title: "Devices", href: "/devices", icon: () => <span>💻</span>, badge: "10.5K" },
  { title: "Schools", href: "/schools", icon: () => <span>🏫</span>, badge: "127" },
  { title: "Users", href: "/users", icon: () => <span>👥</span>, badge: "845" },
  { title: "Analytics", href: "/analytics", icon: () => <span>📈</span> },
  { title: "Reports", href: "/reports", icon: () => <span>📋</span> },
  { title: "Settings", href: "/settings", icon: () => <span>⚙️</span> },
];

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    search: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getUsers({
          page: currentPage,
          limit: 10,
          ...(filters.role && { role: filters.role }),
          ...(filters.status && { status: filters.status }),
          ...(filters.search && { search: filters.search }),
        });

        if (response.success && response.data) {
          setUsers(response.data.users);
          setTotalPages(response.data.pages);
          setTotal(response.data.total);
        } else {
          setError(response.error || 'Failed to fetch users');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users');
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

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'rtb-staff':
        return 'rtb';
      case 'school':
        return 'success';
      case 'technician':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const formatRole = (role: string) => {
    switch (role) {
      case 'rtb-staff':
        return 'RTB Staff';
      case 'admin':
        return 'Administrator';
      case 'school':
        return 'School Staff';
      case 'technician':
        return 'Technician';
      default:
        return role;
    }
  };

  const header = (
    <DashboardHeader
      title="User Management"
      description="Manage system users and their permissions"
    >
      <div className="flex items-center space-x-4">
        <Button variant="rtb-outline" size="sm">
          Export List
        </Button>
        {(currentUser?.role === 'admin' || currentUser?.role === 'rtb-staff') && (
          <Link href="/users/add">
            <Button variant="rtb" size="sm">
              Add User
            </Button>
          </Link>
        )}
      </div>
    </DashboardHeader>
  );

  const sidebar = <Sidebar items={sidebarItems} />;

  return (
    <ProtectedRoute allowedRoles={['admin', 'rtb-staff']}>
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
                    <label htmlFor="search-input" className="block text-sm font-medium mb-2">Search</label>
                    <input
                      id="search-input"
                      type="text"
                      placeholder="Search users..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rtb-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="role-filter" className="block text-sm font-medium mb-2">Role</label>
                    <select
                      id="role-filter"
                      value={filters.role}
                      onChange={(e) => handleFilterChange('role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rtb-primary"
                    >
                      <option value="">All Roles</option>
                      <option value="admin">Administrator</option>
                      <option value="rtb-staff">RTB Staff</option>
                      <option value="school">School Staff</option>
                      <option value="technician">Technician</option>
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
                  <div className="flex items-end">
                    <Button 
                      variant="rtb-outline" 
                      onClick={() => {
                        setFilters({ role: '', status: '', search: '' });
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

            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-rtb-primary">Users ({total})</span>
                  <Badge variant="rtb" className="text-xs">
                    Page {currentPage} of {totalPages}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  System users with access to RTB Device Management
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
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No users found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div 
                        key={user.id} 
                        className="flex items-center justify-between p-4 rounded-lg bg-white border border-slate-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">👤</div>
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-sm text-slate-600">{user.email}</p>
                            {user.phone && (
                              <p className="text-xs text-slate-500">Phone: {user.phone}</p>
                            )}
                            {user.lastLoginAt && (
                              <p className="text-xs text-slate-500">
                                Last login: {new Date(user.lastLoginAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <Badge 
                              variant={getStatusBadgeVariant(user.status)}
                              className="mb-1"
                            >
                              {user.status}
                            </Badge>
                            <br />
                            <Badge 
                              variant={getRoleBadgeVariant(user.role)}
                              className="text-xs"
                            >
                              {formatRole(user.role)}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-col space-y-2">
                            <Link href={`/users/${user.id}`}>
                              <Button variant="rtb-outline" size="sm">
                                View
                              </Button>
                            </Link>
                            {currentUser?.role === 'admin' && (
                              <Link href={`/users/${user.id}/edit`}>
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
