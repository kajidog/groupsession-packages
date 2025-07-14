# @groupsession/client

GroupSession API client library for TypeScript/JavaScript applications.

## Installation

```bash
npm install @groupsession/client
```

## Usage

### Basic Setup

```typescript
import { GroupSessionClient } from '@groupsession/client';

const client = new GroupSessionClient({
  baseUrl: 'http://localhost:8080/gsession',
  timeout: 30000
});
```

### Authentication

```typescript
// Login
const authResult = await client.login({
  userId: 'admin',
  password: 'admin'
});

if (authResult.success) {
  console.log('Logged in successfully');
}

// Check authentication status
if (client.isAuthenticated()) {
  console.log('User is authenticated');
}

// Logout
await client.logout();
```

### User Management

```typescript
// Get current user
const currentUser = await client.getCurrentUser();
console.log(currentUser.data);

// Get all users
const users = await client.getUsers({
  page: 1,
  pageSize: 10
});

// Get specific user
const user = await client.getUser('user123');
```

### Group Management

```typescript
// Get all groups
const groups = await client.getGroups();

// Get specific group
const group = await client.getGroup('group123');

// Get group members
const members = await client.getGroupMembers('group123');
```

### Schedule Management

```typescript
// Get schedules
const schedules = await client.getSchedules({
  page: 1,
  pageSize: 20
});

// Create a new schedule
const newSchedule = await client.createSchedule({
  title: 'Meeting',
  description: 'Weekly team meeting',
  startDate: '2024-01-15T10:00:00Z',
  endDate: '2024-01-15T11:00:00Z',
  location: 'Conference Room A',
  attendees: ['user1', 'user2']
});

// Update schedule
await client.updateSchedule({
  scheduleId: 'schedule123',
  title: 'Updated Meeting Title'
});

// Delete schedule
await client.deleteSchedule('schedule123');
```

### Message/Mail Management

```typescript
// Get messages
const messages = await client.getMessages({
  page: 1,
  pageSize: 10
});

// Send a message
const sentMessage = await client.sendMessage({
  subject: 'Hello',
  body: 'This is a test message',
  to: ['user1@example.com']
});

// Mark message as read
await client.markMessageAsRead('message123');
```

## API Reference

### GroupSessionClient

#### Constructor
- `new GroupSessionClient(config: GroupSessionConfig)`

#### Configuration Options
```typescript
interface GroupSessionConfig {
  baseUrl: string;        // GroupSession base URL
  timeout?: number;       // Request timeout in milliseconds (default: 30000)
  headers?: Record<string, string>; // Additional headers
}
```

#### Authentication Methods
- `login(credentials: LoginCredentials): Promise<AuthResponse>`
- `logout(): Promise<ApiResponse>`
- `isAuthenticated(): boolean`

#### User Methods
- `getCurrentUser(): Promise<ApiResponse<User>>`
- `getUsers(params?: SearchParams): Promise<PaginatedResponse<User>>`
- `getUser(userId: string): Promise<ApiResponse<User>>`

#### Group Methods
- `getGroups(params?: SearchParams): Promise<PaginatedResponse<Group>>`
- `getGroup(groupId: string): Promise<ApiResponse<Group>>`
- `getGroupMembers(groupId: string): Promise<ApiResponse<User[]>>`

#### Schedule Methods
- `getSchedules(params?: SearchParams): Promise<PaginatedResponse<Schedule>>`
- `getSchedule(scheduleId: string): Promise<ApiResponse<Schedule>>`
- `createSchedule(schedule: CreateScheduleRequest): Promise<ApiResponse<Schedule>>`
- `updateSchedule(schedule: UpdateScheduleRequest): Promise<ApiResponse<Schedule>>`
- `deleteSchedule(scheduleId: string): Promise<ApiResponse>`

#### Message Methods
- `getMessages(params?: SearchParams): Promise<PaginatedResponse<Message>>`
- `getMessage(messageId: string): Promise<ApiResponse<Message>>`
- `sendMessage(message: SendMessageRequest): Promise<ApiResponse<Message>>`
- `markMessageAsRead(messageId: string): Promise<ApiResponse>`
- `deleteMessage(messageId: string): Promise<ApiResponse>`

## Error Handling

All API methods return a response object with a `success` field:

```typescript
const result = await client.getUsers();

if (result.success) {
  console.log('Users:', result.data);
} else {
  console.error('Error:', result.error);
}
```

## TypeScript Support

This library is written in TypeScript and provides full type definitions for all API responses and request parameters.

## License

MIT