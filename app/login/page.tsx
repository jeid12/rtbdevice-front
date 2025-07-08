"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  
  const {  isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Redirect if already authenticated
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const backendUrl = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_BACKEND_URL : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch(`${backendUrl}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem("pendingEmail", formData.email);
          window.location.href = "/verify-otp";
        }
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Prevent hydration mismatch by only rendering after component mounts
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rtb-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8 bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Image
                src="/rtb-logo.png"
                alt="Rwanda TVET Board"
                width={60}
                height={60}
                className="rounded-lg"
              />
              <div className="text-left">
                <h1 className="text-2xl font-bold rtb-text-primary">Rwanda TVET Board</h1>
                <p className="text-gray-600">Device Management System</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Badge variant="rtb" className="text-sm px-4 py-2">
                Secure Access Portal
              </Badge>
              
              <h2 className="text-4xl font-bold text-gray-900">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-rtb-primary to-rtb-secondary bg-clip-text text-transparent">
                  RTB Device Management
                </span>
              </h2>
              
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                &quot;Employable Skills for Sustainable Job Creation&quot; - 
                Your gateway to comprehensive TVET device management and analytics.
              </p>
            </div>
          </div>
          
          {/* Features Preview */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "🔐", title: "Secure Login", desc: "Multi-role authentication" },
              { icon: "📊", title: "Real-time Analytics", desc: "Device insights & reports" },
              { icon: "🏫", title: "School Management", desc: "Multi-institution support" },
              { icon: "⚡", title: "Bulk Operations", desc: "Efficient device management" }
            ].map((feature, index) => (                <div key={index} className="text-center p-4 rounded-lg bg-white border border-gray-200 shadow-sm">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-semibold rtb-text-primary text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-600">{feature.desc}</p>
                </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md shadow-2xl border border-gray-200 bg-white">
            <CardHeader className="text-center space-y-2">
              <div className="lg:hidden flex items-center justify-center space-x-3 mb-4">
                <Image
                  src="/rtb-logo.png"
                  alt="RTB Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <div>
                  <h1 className="text-lg font-bold rtb-text-primary">RTB Device Management</h1>
                </div>
              </div>
              
              <CardTitle className="text-2xl font-bold rtb-text-primary">
                Sign In
              </CardTitle>
              <CardDescription className="text-gray-600">
                Enter your credentials to access the system
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-rtb-primary font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@rtb.gov.rw"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-11 border-rtb-primary/20 focus:border-rtb-primary focus:ring-rtb-primary/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-rtb-primary font-medium">
                      Password
                    </Label>
                    <Link 
                      href="/forgot-password" 
                      className="text-sm text-rtb-secondary hover:text-rtb-secondary/80 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="h-11 border-rtb-primary/20 focus:border-rtb-primary focus:ring-rtb-primary/20"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rtb-btn-primary rounded-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
              
              {/* Role-based Login Info */}
              <div className="mt-6 p-4 bg-rtb-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  <strong className="text-rtb-primary">System Access Roles:</strong>
                </p>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {["Admin", "RTB Staff", "School", "Technician"].map((role) => (
                    <Badge key={role} variant="outline" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0">
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Rwanda Technical and Vocational Education Board. All rights reserved.</p>
          <div className="flex items-center justify-center space-x-4 mt-2">
            <Link href="/" className="hover:text-rtb-primary transition-colors">
              Home
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-rtb-primary transition-colors">
              Support
            </Link>
            <span>•</span>
            <a 
              href="https://rtb.gov.rw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-rtb-primary transition-colors"
            >
              RTB Official Site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
