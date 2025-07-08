"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout, DashboardHeader, StatsCard } from "@/components/ui/dashboard";
import { Sidebar } from "@/components/ui/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, Device } from "@/lib/api";

interface DashboardStats {
  totalDevices: number;
  activeDevices: number;
  totalSchools: number;
  activeSchools: number;
  totalUsers: number;
  activeUsers: number;
  devicesByStatus: Array<{ status: string; count: number }>;
  devicesBySchool: Array<{ schoolName: string; count: number }>;
  usersByRole: Array<{ role: string; count: number }>;
}

interface Alert {
  id: number;
  type: "maintenance" | "offline" | "update";
  message: string;
  priority: "high" | "medium" | "low";
  time: string;
}

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard", icon: () => <span>📊</span> },
  { title: "Devices", href: "/devices", icon: () => <span>💻</span>, badge: "10.5K" },
  { title: "Schools", href: "/schools", icon: () => <span>🏫</span>, badge: "127" },
  { title: "Users", href: "/users", icon: () => <span>👥</span>, badge: "845" },
  { title: "Analytics", href: "/analytics", icon: () => <span>📈</span> },
  { title: "Reports", href: "/reports", icon: () => <span>📋</span> },
  { title: "Settings", href: "/settings", icon: () => <span>⚙️</span> },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentDevices, setRecentDevices] = useState<Device[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch analytics data
        const analyticsResponse = await apiService.getAnalytics();
        if (analyticsResponse.success && analyticsResponse.data) {
          setStats(analyticsResponse.data);
        }

        // Fetch recent devices
        const devicesResponse = await apiService.getDevices({ 
          limit: 5,
          page: 1
        });
        if (devicesResponse.success && devicesResponse.data) {
          setRecentDevices(devicesResponse.data.devices);
        }

        // Generate mock alerts for now (you can create an alerts endpoint later)
        const mockAlerts: Alert[] = [
          { 
            id: 1, 
            type: "maintenance", 
            message: "Multiple devices require scheduled maintenance", 
            priority: "high", 
            time: "2 hours ago" 
          },
          { 
            id: 2, 
            type: "offline", 
            message: "Some devices at various schools are offline", 
            priority: "medium", 
            time: "4 hours ago" 
          },
          { 
            id: 3, 
            type: "update", 
            message: "Security updates available for devices", 
            priority: "low", 
            time: "1 day ago" 
          },
        ];
        setAlerts(mockAlerts);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getDeviceStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'outline';
      case 'inactive':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'outline';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const formatLastSeen = (updatedAt: string) => {
    const now = new Date();
    const updated = new Date(updatedAt);
    const diffMs = now.getTime() - updated.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Recently';
    }
  };

  const header = (
    <DashboardHeader
      title="RTB Device Management Dashboard"
      description="Real-time overview of TVET device management across Rwanda"
    >
      <div className="flex items-center space-x-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-rtb-primary">
            {currentTime ? currentTime.toLocaleDateString('en-RW', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'Loading...'}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentTime ? currentTime.toLocaleTimeString('en-RW') : '--:--:--'}
          </p>
        </div>
        <Button variant="rtb-outline" size="sm">
          Export Report
        </Button>
        <Button variant="rtb" size="sm">
          Add Device
        </Button>
      </div>
    </DashboardHeader>
  );

  const sidebar = <Sidebar items={sidebarItems} />;

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="dashboard-dark min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rtb-primary"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-dark min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rtb-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-dark min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin', 'rtb-staff', 'school']}>
      <div className="dashboard-dark">
        <DashboardLayout header={header} sidebar={sidebar}>
          <div className="space-y-8">
            
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-8 text-slate-900 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-slate-900">
                  Welcome to RTB Device Management{user && `, ${user.firstName}`}
                </h2>
                <p className="text-lg text-slate-700">
                  &quot;Employable Skills for Sustainable Job Creation&quot;
                </p>
                <p className="text-sm text-slate-600 mt-2">
                  Managing {stats?.totalDevices?.toLocaleString() || '0'} devices across {stats?.activeSchools || '0'} TVET institutions
                </p>
              </div>
              <div className="hidden md:block">
                <Image
                  src="/rtb-logo.png"
                  alt="RTB Logo"
                  width={80}
                  height={80}
                  className="rounded-lg bg-white/80 p-2 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Devices"
              value={stats?.totalDevices?.toLocaleString() || '0'}
              description="Across all TVET institutions"
              icon={() => <span className="text-lg">💻</span>}
              trend={{ value: 12, label: "vs last month", isPositive: true }}
            />
            <StatsCard
              title="Active Schools"
              value={stats?.activeSchools?.toString() || '0'}
              description="TVET institutions connected"
              icon={() => <span className="text-lg">🏫</span>}
              trend={{ value: 5, label: "vs last month", isPositive: true }}
            />
            <StatsCard
              title="Active Users"
              value={stats?.activeUsers?.toLocaleString() || '0'}
              description="Staff and administrators"
              icon={() => <span className="text-lg">👥</span>}
              trend={{ value: 8, label: "vs last month", isPositive: true }}
            />
            <StatsCard
              title="Maintenance Required"
              value={
                Array.isArray(stats?.devicesByStatus)
                  ? (stats.devicesByStatus.find(s => s.status === 'maintenance')?.count?.toString() || '0')
                  : 'Not found'
              }
              description="Devices requiring attention"
              icon={() => <span className="text-lg">⚠️</span>}
              trend={{ value: 15, label: "vs last week", isPositive: false }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recent Devices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-rtb-primary">Recent Device Activity</span>
                  <Badge variant="rtb" className="text-xs">Live</Badge>
                </CardTitle>
                <CardDescription>
                  Latest device status updates across TVET institutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(recentDevices) && recentDevices.length > 0 ? recentDevices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg">💻</div>
                        <div>
                          <p className="font-medium text-sm">{device.name_tag}</p>
                          <p className="text-xs text-muted-foreground">{device.serialNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={getDeviceStatusBadgeVariant(device.status)}
                          className={`text-xs ${device.status === "maintenance" ? "border-slate-400 text-slate-700 bg-white" : ""}`}
                        >
                          {device.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{formatLastSeen(device.lastSeenAt || device.updatedAt)}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No devices found</p>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Link href="/devices">
                    <Button variant="rtb-outline" className="w-full">
                      View All Devices
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-rtb-primary">System Alerts</span>
                  <Badge variant="destructive" className="text-xs">{alerts.length} Active</Badge>
                </CardTitle>
                <CardDescription>
                  Important notifications and system updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-white border border-slate-200">
                      <div className="text-lg">
                        {alert.type === "maintenance" ? "🔧" :
                         alert.type === "offline" ? "📡" : "🔄"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge
                            variant={getPriorityBadgeVariant(alert.priority)}
                            className={`text-xs ${alert.priority === "medium" ? "border-slate-400 text-slate-700 bg-white" : ""}`}
                          >
                            {alert.priority} priority
                          </Badge>
                          <p className="text-xs text-muted-foreground">{alert.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/alerts">
                    <Button variant="rtb-outline" className="w-full">
                      View All Alerts
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-rtb-primary">Quick Actions</CardTitle>
              <CardDescription>
                Frequently used management operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "Add Device", icon: "➕", href: "/devices/add", desc: "Register new device" },
                  { title: "School Setup", icon: "🏫", href: "/schools/add", desc: "Add TVET institution" },
                  { title: "Bulk Import", icon: "📥", href: "/import", desc: "Import device data" },
                  { title: "Generate Report", icon: "📊", href: "/reports/generate", desc: "Create analytics report" },
                ].map((action, index) => (
                  <Link key={index} href={action.href}>
                    <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
                      <CardContent className="flex flex-col items-center text-center p-6">
                        <div className="text-3xl mb-2">{action.icon}</div>
                        <h3 className="font-semibold text-rtb-primary">{action.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{action.desc}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
