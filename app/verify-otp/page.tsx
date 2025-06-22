"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyTokenPage() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
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
      if (!res.ok) throw new Error(data.message || "OTP verification failed");
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.removeItem("pendingEmail");
      }
      router.replace("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eaf3fa] to-[#f8fafc] p-2 sm:p-4">
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
