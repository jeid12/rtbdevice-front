const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';

// Types based on backend entities
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'admin' | 'rtb-staff' | 'school' | 'technician';
  gender?: 'Male' | 'Female';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  schoolId?: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface Device {
  id: number;
  serialNumber: string;
  name_tag: string;
  model: string;
  brand: string;
  category: 'laptop' | 'desktop' | 'projector' | 'other';
  status: 'active' | 'inactive' | 'maintenance' | 'damaged' | 'lost' | 'disposed';
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'broken';
  purchaseDate?: string;
  purchaseCost?: number;
  warrantyExpiry?: string;
  schoolId?: number;
  assignedUserId?: number;
  location?: string;
  notes?: string;
  lastSeenAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface School {
  id: number;
  name: string;
  code: string;
  type: 'primary' | 'secondary' | 'tvet' | 'university' | 'other';
  address: string;
  phone?: string;
  email?: string;
  principalName?: string;
  principalPhone?: string;
  principalEmail?: string;
  district: string;
  sector: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user?: User;
  token?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const token = localStorage.getItem('authToken');
      
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async verifyOtp(email: string, otp: string): Promise<ApiResponse<{ token: string; user: User }>> {
    return this.request<{ token: string; user: User }>('/users/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/users/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Users
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<{ users: User[]; total: number; pages: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{ users: User[]; total: number; pages: number }>(
      `/users?${queryParams.toString()}`
    );
  }

  async getUserById(id: number): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`);
  }

  async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Devices
  async getDevices(params?: {
    page?: number;
    limit?: number;
    status?: string;
    condition?: string;
    schoolId?: number;
    search?: string;
  }): Promise<ApiResponse<{ devices: Device[]; total: number; pages: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{ devices: Device[]; total: number; pages: number }>(
      `/devices?${queryParams.toString()}`
    );
  }

  async getDeviceById(id: number): Promise<ApiResponse<Device>> {
    return this.request<Device>(`/devices/${id}`);
  }

  async createDevice(deviceData: Partial<Device>): Promise<ApiResponse<Device>> {
    return this.request<Device>('/devices', {
      method: 'POST',
      body: JSON.stringify(deviceData),
    });
  }

  async updateDevice(id: number, deviceData: Partial<Device>): Promise<ApiResponse<Device>> {
    return this.request<Device>(`/devices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(deviceData),
    });
  }

  async deleteDevice(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/devices/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkImportDevices(file: File): Promise<ApiResponse<{ imported: number; failed: number }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.request<{ imported: number; failed: number }>('/devices/bulk-import', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  }

  // Schools
  async getSchools(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    district?: string;
    search?: string;
  }): Promise<ApiResponse<{ schools: School[]; total: number; pages: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{ schools: School[]; total: number; pages: number }>(
      `/schools?${queryParams.toString()}`
    );
  }

  async getSchoolById(id: number): Promise<ApiResponse<School>> {
    return this.request<School>(`/schools/${id}`);
  }

  async createSchool(schoolData: Partial<School>): Promise<ApiResponse<School>> {
    return this.request<School>('/schools', {
      method: 'POST',
      body: JSON.stringify(schoolData),
    });
  }

  async updateSchool(id: number, schoolData: Partial<School>): Promise<ApiResponse<School>> {
    return this.request<School>(`/schools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(schoolData),
    });
  }

  async deleteSchool(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/schools/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics
  async getAnalytics(): Promise<ApiResponse<{
    totalDevices: number;
    activeDevices: number;
    totalSchools: number;
    activeSchools: number;
    totalUsers: number;
    activeUsers: number;
    devicesByStatus: Array<{ status: string; count: number }>;
    devicesBySchool: Array<{ schoolName: string; count: number }>;
    usersByRole: Array<{ role: string; count: number }>;
  }>> {
    return this.request('/analytics');
  }

  // Search
  async search(query: string, filters?: {
    type?: 'devices' | 'schools' | 'users';
    limit?: number;
  }): Promise<ApiResponse<{
    devices: Device[];
    schools: School[];
    users: User[];
  }>> {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/search?${params.toString()}`);
  }
}

export const apiService = new ApiService();
export default apiService;
