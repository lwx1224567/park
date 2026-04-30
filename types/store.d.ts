// Lock screen information
export interface LockInfo {
  // Password required
  pwd?: string | undefined;
  // Is it locked?
  isLock?: boolean;
}

export interface ApiAddress {
  key: string;
  val: string;
}

export interface UserInfo {
  userId: number;
  userName: string;
  nickName: string;
  avatar: string;
  roles: string[];
  homePath?: string;
  permissions: string[];
}
