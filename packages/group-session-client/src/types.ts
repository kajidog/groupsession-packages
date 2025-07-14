/**
 * GroupSession API client types
 */

export interface GroupSessionConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface LoginCredentials {
  userId: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  sessionId?: string;
  message?: string;
}

export interface User {
  userId: string;
  userName: string;
  email?: string;
  position?: string;
  department?: string;
  active: boolean;
  lastLogin?: string;
}

export interface Group {
  groupId: string;
  groupName: string;
  description?: string;
  members: string[];
  active: boolean;
}

export interface Schedule {
  scheduleId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  attendees: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleRequest {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  attendees?: string[];
}

export interface UpdateScheduleRequest extends Partial<CreateScheduleRequest> {
  scheduleId: string;
}

export interface Message {
  messageId: string;
  subject: string;
  body: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  sentAt: string;
  read: boolean;
}

export interface SendMessageRequest {
  subject: string;
  body: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface SearchParams {
  query?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
