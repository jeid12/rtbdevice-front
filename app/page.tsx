import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Image
              src="/rtb-logo.png"
              alt="Rwanda TVET Board"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-lg font-bold text-rtb-primary">RTB Device Management</h1>
              <p className="text-xs text-gray-600">Rwanda TVET Board</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-rtb-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/devices" className="text-sm font-medium text-gray-700 hover:text-rtb-primary transition-colors">
              Devices
            </Link>
            <Link href="/schools" className="text-sm font-medium text-gray-700 hover:text-rtb-primary transition-colors">
              Schools
            </Link>
            <Link href="/analytics" className="text-sm font-medium text-gray-700 hover:text-rtb-primary transition-colors">
              Analytics
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Link href="/login">
              <Button variant="rtb-outline" size="sm" className="border-rtb-primary text-rtb-primary hover:bg-rtb-primary hover:text-white">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 bg-gradient-to-br from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="text-center lg:text-left">
              <Badge variant="rtb" className="mb-4 bg-rtb-primary text-white">
                Rwanda TVET Board
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl rtb-hero-title rtb-fade-in">
                <span className="text-rtb-primary">Device</span>{" "}
                <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent font-extrabold">
                  Management
                </span>{" "}
                <span className="text-slate-800">System</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-700 max-w-2xl rtb-hero-subtitle">
                Empowering TVET institutions with advanced device tracking, management, and analytics.
                Supporting Rwanda&apos;s vision for{" "}
                <span className="font-semibold text-slate-800">&quot;Employable Skills for Sustainable Job Creation&quot;</span>
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link href="/login">
                  <Button size="lg" className="rtb-btn-primary px-8 py-3 text-lg rounded-lg">
                    Get Started
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button variant="outline" size="lg" className="border-2 border-rtb-primary text-rtb-primary hover:bg-rtb-primary hover:text-white px-8 py-3 text-lg rounded-lg bg-white">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-tr from-white/80 to-slate-100/60 backdrop-blur-sm border border-slate-200/50 p-8 shadow-lg">
                <div className="h-full w-full rounded-xl bg-rtb-primary/10 backdrop-blur-sm flex items-center justify-center border border-rtb-primary/20">
                  <div className="text-center text-rtb-primary">
                    <div className="text-6xl font-bold mb-4">RTB</div>
                    <div className="text-xl font-semibold">Device Management</div>
                    <div className="text-sm opacity-80 mt-2">Professional • Secure • Efficient</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-rtb-primary mb-4">
              Comprehensive Device Management
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built specifically for TVET institutions to streamline device tracking, maintenance, and reporting
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Device Tracking",
                description: "Real-time monitoring and tracking of all devices across TVET institutions",
                icon: "📱",
                badge: "Core Feature"
              },
              {
                title: "School Management",
                description: "Manage multiple schools and their device inventories from a centralized platform",
                icon: "🏫",
                badge: "Multi-School"
              },
              {
                title: "User Roles",
                description: "Role-based access control for Admin, RTB Staff, School Staff, and Technicians",
                icon: "👥",
                badge: "Security"
              },
              {
                title: "Analytics Dashboard",
                description: "Comprehensive insights and reporting on device usage and performance",
                icon: "📊",
                badge: "Insights"
              },
              {
                title: "Bulk Operations",
                description: "Efficient bulk import, export, and management of devices and schools",
                icon: "⚡",
                badge: "Efficiency"
              },
              {
                title: "Search & Filter",
                description: "Advanced search capabilities to quickly find devices, schools, and users",
                icon: "🔍",
                badge: "Smart Search"
              }
            ].map((feature, index) => (
              <div key={index} className={`rtb-card p-6 rtb-fade-in delay-${index * 100}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{feature.icon}</div>
                  <Badge variant="secondary" className="bg-blue-100 text-rtb-primary border-0">{feature.badge}</Badge>
                </div>
                <h3 className="text-xl font-semibold rtb-text-primary mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 gradient-rtb-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Trusted by TVET Institutions
            </h2>
            <p className="text-lg opacity-90">
              Supporting Rwanda&apos;s technical education with reliable device management
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "50+", label: "TVET Schools" },
              { value: "10K+", label: "Devices Managed" },
              { value: "500+", label: "Active Users" },
              { value: "99.9%", label: "Uptime" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-rtb-primary mb-4">
            Ready to Transform Your Device Management?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the growing network of TVET institutions using our platform to streamline their operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="gradient-rtb-primary">
                Start Managing Devices
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="rtb-outline" size="lg">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-rtb-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="/rtb-logo.png"
                  alt="Rwanda TVET Board"
                  width={32}
                  height={32}
                  className="rounded"
                />
                <div>
                  <h3 className="font-bold">Rwanda TVET Board</h3>
                  <p className="text-sm opacity-80">Device Management System</p>
                </div>
              </div>
              <p className="text-sm opacity-80 max-w-md">
                &quot;Employable Skills for Sustainable Job Creation&quot; - Empowering Rwanda&apos;s technical education sector with modern device management solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link href="/dashboard" className="hover:opacity-100">Dashboard</Link></li>
                <li><Link href="/devices" className="hover:opacity-100">Devices</Link></li>
                <li><Link href="/schools" className="hover:opacity-100">Schools</Link></li>
                <li><Link href="/analytics" className="hover:opacity-100">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>📞 (+250) 783 558 414</li>
                <li>✉️ info@rtb.gov.rw</li>
                <li>🌐 rtb.gov.rw</li>
                <li>📍 Kigali, Rwanda</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm opacity-80">
            <p>&copy; 2025 Rwanda Technical and Vocational Education Board. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
