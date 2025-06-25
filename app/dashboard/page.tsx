"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout, DashboardHeader, StatsCard } from "@/components/ui/dashboard";
import { Sidebar } from "@/components/ui/navigation";

// Mock data for demonstration
const mockStats = {
  totalDevices: 10547,
  activeSchools: 127,
  activeUsers: 845,
  maintenanceAlerts: 23,
};

const mockDevices = [
  { id: "D001", name: "MacBook Pro 14", school: "IPRC Kigali", status: "Active", lastSeen: "2 hours ago" },
  { id: "D002", name: "Dell Latitude 5520", school: "IPRC Huye", status: "Maintenance", lastSeen: "1 day ago" },
  { id: "D003", name: "HP EliteBook 840", school: "IPRC Musanze", status: "Active", lastSeen: "30 minutes ago" },
  { id: "D004", name: "Lenovo ThinkPad X1", school: "IPRC Tumba", status: "Inactive", lastSeen: "3 days ago" },
  { id: "D005", name: "ASUS ZenBook 14", school: "IPRC Kitabi", status: "Active", lastSeen: "1 hour ago" },
];

const mockAlerts = [
  { id: 1, type: "maintenance", message: "Device D002 requires scheduled maintenance", priority: "high", time: "2 hours ago" },
  { id: 2, type: "offline", message: "5 devices at IPRC Musanze are offline", priority: "medium", time: "4 hours ago" },
  { id: 3, type: "update", message: "Security update available for 23 devices", priority: "low", time: "1 day ago" },
];

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
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  return (
    <div className="dashboard-dark">
      <DashboardLayout header={header} sidebar={sidebar}>
        <div className="space-y-8">
          
          {/* Welcome Section */}
          <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-8 text-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-slate-900">
                Welcome to RTB Device Management
              </h2>
              <p className="text-lg text-slate-700">
                &quot;Employable Skills for Sustainable Job Creation&quot;
              </p>
              <p className="text-sm text-slate-600 mt-2">
                Managing {mockStats.totalDevices.toLocaleString()} devices across {mockStats.activeSchools} TVET institutions
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
            value={mockStats.totalDevices.toLocaleString()}
            description="Across all TVET institutions"
            icon={() => <span className="text-lg">💻</span>}
            trend={{ value: 12, label: "vs last month", isPositive: true }}
          />
          <StatsCard
            title="Active Schools"
            value={mockStats.activeSchools}
            description="TVET institutions connected"
            icon={() => <span className="text-lg">🏫</span>}
            trend={{ value: 5, label: "vs last month", isPositive: true }}
          />
          <StatsCard
            title="Active Users"
            value={mockStats.activeUsers.toLocaleString()}
            description="Staff and administrators"
            icon={() => <span className="text-lg">👥</span>}
            trend={{ value: 8, label: "vs last month", isPositive: true }}
          />
          <StatsCard
            title="Maintenance Alerts"
            value={mockStats.maintenanceAlerts}
            description="Requiring attention"
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
                {mockDevices.map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg">💻</div>
                      <div>
                        <p className="font-medium text-sm">{device.name}</p>
                        <p className="text-xs text-muted-foreground">{device.school}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          device.status === "Active" ? "success" :
                          device.status === "Maintenance" ? "outline" : 
                          "secondary"
                        }
                        className={`text-xs ${device.status === "Maintenance" ? "border-slate-400 text-slate-700 bg-white" : ""}`}
                      >
                        {device.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{device.lastSeen}</p>
                    </div>
                  </div>
                ))}
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
                <Badge variant="destructive" className="text-xs">{mockAlerts.length} Active</Badge>
              </CardTitle>
              <CardDescription>
                Important notifications and system updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-white border border-slate-200">
                    <div className="text-lg">
                      {alert.type === "maintenance" ? "🔧" :
                       alert.type === "offline" ? "📡" : "🔄"}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge
                          variant={
                            alert.priority === "high" ? "destructive" :
                            alert.priority === "medium" ? "outline" : 
                            "secondary"
                          }
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
  );
}
