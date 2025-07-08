"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/rtb-logo.png"
              alt="RTB Logo"
              width={60}
              height={60}
              className="rounded-lg"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-rtb-primary">
            Access Denied
          </CardTitle>
          <CardDescription>
            You don&apos;t have permission to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <p className="text-gray-600 mb-2">
              Sorry, {user?.firstName || 'User'}, you don&apos;t have the required permissions to view this page.
            </p>
            <p className="text-sm text-gray-500">
              Your current role: <span className="font-semibold">{user?.role}</span>
            </p>
          </div>
          
          <div className="space-y-3">
            <Link href="/dashboard" className="block">
              <Button variant="rtb" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
            
            <Link href="/" className="block">
              <Button variant="rtb-outline" className="w-full">
                Go to Home
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              onClick={logout}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Sign Out
            </Button>
          </div>
          
          <div className="text-center text-xs text-gray-500 mt-6">
            If you believe this is an error, please contact your system administrator.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
