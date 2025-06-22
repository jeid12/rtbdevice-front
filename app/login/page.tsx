"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendUrl =process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${backendUrl}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("pendingEmail", email);
        window.location.href = "/verify-otp";
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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eaf3fa] to-[#f8fafc] p-2 sm:p-4">
      <Card className="w-full max-w-xs sm:max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-2xl font-bold text-blue-900">Login to RTB Devices Management</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4 sm:gap-6" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" required className="text-sm sm:text-base" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" required className="text-sm sm:text-base" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-1.5 sm:gap-2 mt-2">
              <Link href="/forgot-password" className="text-blue-700 hover:underline text-xs sm:text-sm">Forgot password?</Link>
              <Link href="/" className="text-gray-600 hover:underline text-xs sm:text-sm">Back Home</Link>
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full mt-2 text-sm sm:text-base" disabled={loading}>{loading ? "Logging in..." : "Login"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
