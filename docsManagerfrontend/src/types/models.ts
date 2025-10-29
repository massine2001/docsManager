export interface User {
  id: number;
  sub: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Pool {
  id: number;
  name: string;
  description?: string;
  createdBy?: number;
  createdAt?: string;
  publicAccess?: boolean;
  fileCount?: number;
}

export interface File {
  id: number;
  name: string;
  path: string;
  description?: string;
  expirationDate?: string;
  pool: Pool;
  userUploader: User;
  createdAt: string;
}

export interface Access {
  id: number;
  user: User;
  pool: Pool;
  role: string;
}

export interface PoolStats {
  pool: Pool;
  
  membersCount: number;
  members: User[];
  accesses: Access[];
  roleDistribution: Record<string, number>;
  userRoleDistribution: Record<string, number>;
  
  filesCount: number;
  files: File[];
  topUploaders: Array<{ user: User; count: number }>;
  filesPerDay: Record<string, number>;
  lastFile: File | null;
  fileExtensions: Record<string, number>;
  
  mostActiveMembers: Array<{ user: User; count: number }>;
  inactiveMembers: User[];
  inactiveMembersCount: number;
  activityRate: number;
  avgFilesPerMember: number;
  
  poolCreatedAt: string;
  poolAgeInDays: number;
  newestMember: User | null;
  oldestMember: User | null;
  creator: User | null;
}