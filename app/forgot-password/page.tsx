"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "otp" | "reset" | "done">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const backendUrl = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_BACKEND_URL : '';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Step 1: Send email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${backendUrl}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const text = await res.text();
        let data = {};
        try { data = text ? JSON.parse(text) : {}; } catch {}
        let message = "Failed to send OTP";
        if (typeof data === "object" && data && "message" in data && typeof (data as Record<string, unknown>)["message"] === "string") {
          message = (data as Record<string, string>)["message"];
        }
        throw new Error(message);
      }
      setStep("otp");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${backendUrl}/users/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      if (!res.ok) {
        const text = await res.text();
        let data = {};
        try { data = text ? JSON.parse(text) : {}; } catch {}
        let message = "OTP verification failed";
        if (typeof data === "object" && data && "message" in data && typeof (data as Record<string, unknown>)["message"] === "string") {
          message = (data as Record<string, string>)["message"];
        }
        throw new Error(message);
      }
      setStep("reset");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${backendUrl}/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp,  newPassword: password, }),
      });
      if (!res.ok) {
        const text = await res.text();
        let data = {};
        try { data = text ? JSON.parse(text) : {}; } catch {}
        let message = "Password reset failed";
        if (typeof data === "object" && data && "message" in data && typeof (data as Record<string, unknown>)["message"] === "string") {
          message = (data as Record<string, string>)["message"];
        }
        throw new Error(message);
      }
      setStep("done");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred.");
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
          <CardTitle className="text-center text-xl sm:text-2xl font-bold text-blue-900">Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          {step === "email" && (
            <form className="flex flex-col gap-4 sm:gap-6" onSubmit={handleSendEmail}>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" required className="text-sm sm:text-base" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              <Button type="submit" className="w-full mt-2 text-sm sm:text-base" disabled={loading}>{loading ? "Sending..." : "Send OTP"}</Button>
            </form>
          )}
          {step === "otp" && (
            <form className="flex flex-col gap-4 sm:gap-6" onSubmit={handleVerifyOtp}>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input id="otp" type="text" placeholder="Enter the OTP sent to your email" required className="text-sm sm:text-base" value={otp} onChange={e => setOtp(e.target.value)} />
              </div>
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              <Button type="submit" className="w-full mt-2 text-sm sm:text-base" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</Button>
            </form>
          )}
          {step === "reset" && (
            <form className="flex flex-col gap-4 sm:gap-6" onSubmit={handleResetPassword}>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" placeholder="Enter new password" required className="text-sm sm:text-base" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              <Button type="submit" className="w-full mt-2 text-sm sm:text-base" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</Button>
            </form>
          )}
          {step === "done" && (
            <div className="flex flex-col items-center gap-4">
              <div className="text-green-700 text-center font-semibold">Password reset successful!</div>
              <Link href="/login" className="text-blue-700 hover:underline text-sm">Back to Login</Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
