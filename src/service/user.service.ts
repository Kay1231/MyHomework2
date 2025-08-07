import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userModel: Repository<User>;

  async createUser(username: string, password: string) {
    // 检查用户名是否已存在
    const existingUser = await this.userModel.findOne({ where: { username } });
    if (existingUser) {
      throw new Error('用户名已存在');
    }

    const user = new User();
    user.username = username;
    user.password = password; // 明文存储

    try {
      return await this.userModel.save(user);
    } catch (error) {
      console.error('创建用户失败:', error);
      throw new Error('创建用户失败');
    }
  }

  async verifyUser(username: string, password: string) {
    return this.userModel.findOne({
      where: {
        username,
        password, // 明文比较
      },
    });
  }

}
