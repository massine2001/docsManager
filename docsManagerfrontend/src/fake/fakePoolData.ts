import type { User, Pool, PoolStats } from "../types/models";

export const fakeUser: User = {
  id: 1,
  sub: 'sub1',
  email: 'john.doe@mail.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'admin',
  createdAt: '2025-10-29T17:49:00.000Z'
};

export const fakePool: Pool = {
  id: 0,
  name: 'Démo',
  description: 'Pool démo',
  createdBy: 1,
  createdAt: '2025-10-29T17:49:00.000Z',
  publicAccess: true
};

export function getFakeStats(poolId: number): PoolStats {
  const pool = { ...fakePool, id: poolId };
  const file = {
    id: 1,
    name: 'cv-massine-agharmiou.pdf',
    path: '',
    pool,
    createdAt: '2025-10-29T17:49:00.000Z',
    description: '',
    expirationDate: undefined,
    userUploader: fakeUser
  };
  const createdAt = new Date(pool.createdAt ?? '2025-10-29T17:49:00.000Z');
  const now = new Date();
  const poolAgeInDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  return {
    pool,
    membersCount: 1,
    members: [fakeUser],
    accesses: [
      { id: 1, user: fakeUser, pool, role: 'admin' }
    ],
    roleDistribution: { admin: 1 },
    userRoleDistribution: { admin: 1 },
    filesCount: 1,
    files: [file],
    topUploaders: [
      { user: fakeUser, count: 1 }
    ],
    filesPerDay: { '2025-10-29': 1 },
    lastFile: file,
    mostActiveMembers: [],
    inactiveMembers: [],
    inactiveMembersCount: 0,
    poolCreatedAt: '2025-10-29T17:49:00.000Z',
    poolAgeInDays,
    newestMember: fakeUser,
    oldestMember: fakeUser,
    fileExtensions: { pdf: 1 },
    creator: fakeUser,
    activityRate: 100,
    avgFilesPerMember: 1,
    totalViews: undefined,
    totalDownloads: undefined,
    avgViewsPerFile: undefined,
    avgDownloadsPerFile: undefined,
    viewsPerDay: { '2025-10-29': undefined },
    downloadsPerDay: { '2025-10-29': undefined },
    topViewedFiles: [],
    topDownloadedFiles: [],
    viewsByUploader: {},
    downloadsByUploader: {}
  };
}