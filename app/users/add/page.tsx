"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout, DashboardHeader } from "@/components/ui/dashboard";
import { Sidebar } from "@/components/ui/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { apiService } from "@/lib/api";

// Types
type Role = "admin" | "rtb-staff" | "school" | "technician";
type Gender = "Male" | "Female";

type FormData = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  nationalId?: string;
  role?: Role;
  gender?: Gender;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  schoolId?: number;
};

// Location data
const districtsByProvince: Record<string, string[]> = {
  Kigali: ["Gasabo", "Kicukiro", "Nyarugenge"],
  Northern: ["Gicumbi", "Musanze"],
  Southern: ["Huye", "Nyanza"],
  Eastern: ["Nyagatare", "Rwamagana"],
  Western: ["Rubavu", "Karongi"],
};

const sectorsByDistrict: Record<string, string[]> = {
  Gasabo: ["Sector 1", "Sector 2"],
  Kicukiro: ["Sector A", "Sector B"],
  Nyarugenge: ["Sector X", "Sector Y"],
  Gicumbi: ["Sector G1", "Sector G2"],
  Musanze: ["Sector M1", "Sector M2"],
  Huye: ["Sector H1", "Sector H2"],
  Nyanza: ["Sector N1", "Sector N2"],
  Nyagatare: ["Sector NY1", "Sector NY2"],
  Rwamagana: ["Sector R1", "Sector R2"],
  Rubavu: ["Sector RU1", "Sector RU2"],
  Karongi: ["Sector KA1", "Sector KA2"],
};

const cellsBySector: Record<string, string[]> = {
  "Sector 1": ["Cell 1", "Cell 2"],
  "Sector 2": ["Cell A", "Cell B"],
  "Sector A": ["Cell A1", "Cell A2"],
  "Sector B": ["Cell B1", "Cell B2"],
  "Sector X": ["Cell X1", "Cell X2"],
  "Sector Y": ["Cell Y1", "Cell Y2"],
  "Sector KA1": ["Cell Y2", "Cell Y12"],
};

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard", icon: () => <span>📊</span> },
  { title: "Devices", href: "/devices", icon: () => <span>💻</span>, badge: "10.5K" },
  { title: "Schools", href: "/schools", icon: () => <span>🏫</span>, badge: "127" },
  { title: "Users", href: "/users", icon: () => <span>👥</span>, badge: "845" },
  { title: "Analytics", href: "/analytics", icon: () => <span>📈</span> },
  { title: "Reports", href: "/reports", icon: () => <span>📋</span> },
  { title: "Settings", href: "/settings", icon: () => <span>⚙️</span> },
];

export default function AddUserPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    id: undefined,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationalId: "",
    role: undefined,
    gender: undefined,
    province: undefined,
    district: undefined,
    sector: undefined,
    cell: undefined,
    schoolId: undefined,
  });

  const provinces = Object.keys(districtsByProvince);
  const availableDistricts = formData.province ? districtsByProvince[formData.province] || [] : [];
  const availableSectors = formData.district ? sectorsByDistrict[formData.district] || [] : [];
  const availableCells = formData.sector ? cellsBySector[formData.sector] || [] : [];

  const isNationalIdValid = formData.nationalId ? /^\d{16}$/.test(formData.nationalId) : true;

  const handleSaveUser = async () => {
    if (!isNationalIdValid) {
      alert("National ID must be exactly 16 digits.");
      return;
    }
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.role) {
      alert("Please fill all required fields.");
      return;
    }

    const result = await apiService.createUser(formData);
    if (result.success) {
      setShowForm(false);
      setFormData({
        id: undefined,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        nationalId: "",
        role: undefined,
        gender: undefined,
        province: undefined,
        district: undefined,
        sector: undefined,
        cell: undefined,
        schoolId: undefined,
      });
    } else {
      alert(result.error || "Failed to create user");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "rtb-staff"]}>
      <div className="dashboard-dark flex">
        <Sidebar items={sidebarItems} />
        <DashboardLayout
          header={<DashboardHeader title="User Management" description="Manage system users and their permissions" />}
        >
          <div>
            <Button variant="rtb" size="sm" onClick={() => setShowForm(true)}>
              Add User
            </Button>
          </div>
        </DashboardLayout>
         {/* Form fields — same as before */}            
        {showForm && (
          <div className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-lg p-6 overflow-auto z-50">
            <Card>
              <CardHeader>
                <CardTitle>Add New User</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {/* ID */}
                  <div>
                    <label className="block mb-1 font-semibold">ID (optional)</label>
                    <input
                      type="number"
                      className="form-input w-full"
                      value={formData.id ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, id: e.target.value ? parseInt(e.target.value) : undefined }))
                      }
                    />
                  </div>
                  {/* First Name */}
                  <div>
                    <label className="block mb-1 font-semibold">First Name *</label>
                    <input
                      type="text"
                      className="form-input w-full"
                      value={formData.firstName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  {/* Last Name */}
                  <div>
                    <label className="block mb-1 font-semibold">Last Name *</label>
                    <input
                      type="text"
                      className="form-input w-full"
                      value={formData.lastName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block mb-1 font-semibold">Email *</label>
                    <input
                      type="email"
                      className="form-input w-full"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  {/* Phone */}
                  <div>
                    <label className="block mb-1 font-semibold">Phone</label>
                    <input
                      type="tel"
                      className="form-input w-full"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  {/* National ID */}
                  <div>
                    <label className="block mb-1 font-semibold">National ID (16 digits)</label>
                    <input
                      type="text"
                      maxLength={16}
                      className={`form-input w-full ${!isNationalIdValid ? "border-red-500" : ""}`}
                      value={formData.nationalId}
                      onChange={(e) => setFormData((prev) => ({ ...prev, nationalId: e.target.value }))}
                    />
                    {!isNationalIdValid && <p className="text-red-600 text-sm">ID must be exactly 16 digits</p>}
                  </div>
                  {/* Role */}
                  <div>
                    <label className="block mb-1 font-semibold">Role *</label>
                    <select
                      className="form-select w-full"
                      value={formData.role ?? ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value as Role }))}
                      required
                    >
                      <option value="">-- Select Role --</option>
                      <option value="admin">Administrator</option>
                      <option value="rtb-staff">RTB Staff</option>
                      <option value="school">School Staff</option>
                      <option value="technician">Technician</option>
                    </select>
                  </div>
                  {/* Gender */}
                  <div>
                    <label className="block mb-1 font-semibold">Gender</label>
                    <select
                      className="form-select w-full"
                      value={formData.gender ?? ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, gender: e.target.value as Gender }))}
                    >
                      <option value="">-- Select Gender --</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  {/* Province */}
<div>
  <label className="block mb-1 font-semibold">Province</label>
  <select
    className="form-select w-full"
    value={formData.province ?? ""}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        province: e.target.value || undefined,
        district: undefined,
        sector: undefined,
        cell: undefined,
      }))
    }
  >
    <option value="">-- Select Province --</option>
    {provinces.map((p) => (
      <option key={p} value={p}>
        {p}
      </option>
    ))}
  </select>
</div>

             {/* District */}
<div>
  <label className="block mb-1 font-semibold">District</label>
  <select
    className="form-select w-full"
    value={formData.district ?? ""}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        district: e.target.value || undefined,
        sector: undefined,
        cell: undefined,
      }))
    }
    disabled={!formData.province}
  >
    <option value="">-- Select District --</option>
    {availableDistricts.map((d) => (
      <option key={d} value={d}>
        {d}
      </option>
    ))}
  </select>
</div>

                  {/* Sector */}
                  <div>
                    <label className="block mb-1 font-semibold">Sector</label>
                    <select
                      className="form-select w-full"
                      value={formData.sector ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          sector: e.target.value || undefined,
                          cell: undefined,
                        }))
                      }
                      disabled={!formData.district}
                    >
                      <option value="">-- Select Sector --</option>
                      {availableSectors.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Cell */}
                  <div>
                    <label className="block mb-1 font-semibold">Cell</label>
                    <select
                      className="form-select w-full"
                      value={formData.cell ?? ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, cell: e.target.value || undefined }))}
                      disabled={!formData.sector}
                    >
                      <option value="">-- Select Cell --</option>
                      {availableCells.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ... (copy from your version — already good) */}
                </div>
                <div className="flex justify-end mt-6 space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({
                        id: undefined,
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone: "",
                        nationalId: "",
                        role: undefined,
                        gender: undefined,
                        province: undefined,
                        district: undefined,
                        sector: undefined,
                        cell: undefined,
                        schoolId: undefined,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveUser} variant="rtb">
                    Save User
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
