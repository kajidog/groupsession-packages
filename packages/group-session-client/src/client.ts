import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type {
  ApiResponse,
  AuthResponse,
  CreateScheduleRequest,
  Group,
  GroupSessionConfig,
  LoginCredentials,
  Message,
  PaginatedResponse,
  Schedule,
  SearchParams,
  SendMessageRequest,
  UpdateScheduleRequest,
  User,
} from './types.js';

/**
 * GroupSession API Client
 */
export class GroupSessionClient {
  private axiosInstance: AxiosInstance;
  private sessionId?: string;

  constructor(config: GroupSessionConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add session ID
    this.axiosInstance.interceptors.request.use((config: any) => {
      if (this.sessionId) {
        config.headers['X-Session-ID'] = this.sessionId;
      }
      return config;
    });

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response?.status === 401) {
          this.sessionId = undefined;
        }
        return Promise.reject(error);
      }
    );
  }

  private async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.request<ApiResponse<T>>(config);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.message || error.message,
        };
      }
      return {
        success: false,
        error: 'An unknown error occurred',
      };
    }
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>({
      method: 'POST',
      url: '/api/auth/login',
      data: credentials,
    });

    if (response.success && response.data?.sessionId) {
      this.sessionId = response.data.sessionId;
    }

    return response.data || { success: false };
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request({
      method: 'POST',
      url: '/api/auth/logout',
    });

    if (response.success) {
      this.sessionId = undefined;
    }

    return response;
  }

  isAuthenticated(): boolean {
    return !!this.sessionId;
  }

  // User management methods
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>({
      method: 'GET',
      url: '/api/users/me',
    });
  }

  async getUsers(params?: SearchParams): Promise<PaginatedResponse<User>> {
    return this.request<User[]>({
      method: 'GET',
      url: '/api/users',
      params,
    }) as Promise<PaginatedResponse<User>>;
  }

  async getUser(userId: string): Promise<ApiResponse<User>> {
    return this.request<User>({
      method: 'GET',
      url: `/api/users/${userId}`,
    });
  }

  // Group management methods
  async getGroups(params?: SearchParams): Promise<PaginatedResponse<Group>> {
    return this.request<Group[]>({
      method: 'GET',
      url: '/api/groups',
      params,
    }) as Promise<PaginatedResponse<Group>>;
  }

  async getGroup(groupId: string): Promise<ApiResponse<Group>> {
    return this.request<Group>({
      method: 'GET',
      url: `/api/groups/${groupId}`,
    });
  }

  async getGroupMembers(groupId: string): Promise<ApiResponse<User[]>> {
    return this.request<User[]>({
      method: 'GET',
      url: `/api/groups/${groupId}/members`,
    });
  }

  // Schedule management methods
  async getSchedules(params?: SearchParams): Promise<PaginatedResponse<Schedule>> {
    return this.request<Schedule[]>({
      method: 'GET',
      url: '/api/schedules',
      params,
    }) as Promise<PaginatedResponse<Schedule>>;
  }

  async getSchedule(scheduleId: string): Promise<ApiResponse<Schedule>> {
    return this.request<Schedule>({
      method: 'GET',
      url: `/api/schedules/${scheduleId}`,
    });
  }

  async createSchedule(schedule: CreateScheduleRequest): Promise<ApiResponse<Schedule>> {
    return this.request<Schedule>({
      method: 'POST',
      url: '/api/schedules',
      data: schedule,
    });
  }

  async updateSchedule(schedule: UpdateScheduleRequest): Promise<ApiResponse<Schedule>> {
    const { scheduleId, ...data } = schedule;
    return this.request<Schedule>({
      method: 'PUT',
      url: `/api/schedules/${scheduleId}`,
      data,
    });
  }

  async deleteSchedule(scheduleId: string): Promise<ApiResponse> {
    return this.request({
      method: 'DELETE',
      url: `/api/schedules/${scheduleId}`,
    });
  }

  // Message/Mail methods
  async getMessages(params?: SearchParams): Promise<PaginatedResponse<Message>> {
    return this.request<Message[]>({
      method: 'GET',
      url: '/api/messages',
      params,
    }) as Promise<PaginatedResponse<Message>>;
  }

  async getMessage(messageId: string): Promise<ApiResponse<Message>> {
    return this.request<Message>({
      method: 'GET',
      url: `/api/messages/${messageId}`,
    });
  }

  async sendMessage(message: SendMessageRequest): Promise<ApiResponse<Message>> {
    return this.request<Message>({
      method: 'POST',
      url: '/api/messages',
      data: message,
    });
  }

  async markMessageAsRead(messageId: string): Promise<ApiResponse> {
    return this.request({
      method: 'PUT',
      url: `/api/messages/${messageId}/read`,
    });
  }

  async deleteMessage(messageId: string): Promise<ApiResponse> {
    return this.request({
      method: 'DELETE',
      url: `/api/messages/${messageId}`,
    });
  }

  // Utility methods
  getSessionId(): string | undefined {
    return this.sessionId;
  }

  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  clearSession(): void {
    this.sessionId = undefined;
  }
}
