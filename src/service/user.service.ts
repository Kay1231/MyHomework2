import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/User';

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userModel: Repository<User>;

  // 创建用户
  async createUser(userData: Partial<User>) {
    const user = this.userModel.create(userData);
    return this.userModel.save(user);
  }

  // 根据ID获取用户
  async getUserById(id: number) {
    return this.userModel.findOne({ where: { id } });
  }

  // 根据用户名获取用户
  async getUserByUsername(username: string) {
    return this.userModel.findOne({ where: { username } });
  }

  // 验证用户密码
  async verifyPassword(user: User, password: string) {
    return user.password === password;
  }
}