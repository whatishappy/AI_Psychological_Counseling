export interface UserAttributes {
  user_id?: number;
  username: string;
  password_hash: string;
  email?: string;
  user_type?: 'registered' | 'admin';
  last_login?: Date;
  nickname?: string;
  gender?: 'male' | 'female' | 'other';
  birth_date?: string;
  // 添加协议同意字段
  agreed_to_terms?: boolean;
  
  // 时间戳
  createdAt?: Date;
  updatedAt?: Date;
}