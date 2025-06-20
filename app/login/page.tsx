import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eaf3fa] to-[#f8fafc] p-2 sm:p-4">
      <Card className="w-full max-w-xs sm:max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-2xl font-bold text-blue-900">Login to RTB Devices Management</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" required className="text-sm sm:text-base" />
            </div>
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" required className="text-sm sm:text-base" />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-1.5 sm:gap-2 mt-2">
              <Link href="/forgot-password" className="text-blue-700 hover:underline text-xs sm:text-sm">Forgot password?</Link>
              <Link href="/" className="text-gray-600 hover:underline text-xs sm:text-sm">Back Home</Link>
            </div>
            <Button type="submit" className="w-full mt-2 text-sm sm:text-base">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
