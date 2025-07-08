"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifyTokenPage() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';

  useEffect(() => {
    setMounted(true);
    // Get email from localStorage (set by login page)
    const pendingEmail = localStorage.getItem("pendingEmail") || "";
    setEmail(pendingEmail);
    if (!pendingEmail) {
      router.replace("/login");
    }
  }, [router]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`${backendUrl}/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.message || "OTP verification failed");
      }
      
      // Check if we got both token and user data
      if (data.token && data.user) {
        // Use the auth context to properly set authentication state
        login(data.token, data.user);
        localStorage.removeItem("pendingEmail");
        router.replace("/dashboard");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: unknown) {
      console.error('OTP verification error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rtb-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-slate-50 p-2 sm:p-4">
      <Card className="w-full max-w-xs sm:max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-2xl font-bold text-blue-900">Verify OTP</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4 sm:gap-6" onSubmit={handleVerifyOtp}>
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input id="otp" type="text" placeholder="Enter the OTP sent to your email" required className="text-sm sm:text-base" value={otp} onChange={e => setOtp(e.target.value)} />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full mt-2 text-sm sm:text-base" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
