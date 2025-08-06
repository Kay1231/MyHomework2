import { Controller, Post, Body, Inject, Get } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { AuthMiddleware } from '../middleware/auth.middleware';
import * as jwt from 'jsonwebtoken';

@Controller('/api/users')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  // 用户注册
  @Post('/register')
  async register(@Body() body: any) {
    const { username, password } = body;

    try {
      // 检查用户名是否已存在
      const existingUser = await this.userService.getUserByUsername(username);
      if (existingUser) {
        this.ctx.status = 400;
        return {
          success: false,
          message: '用户名已存在',
        };
      }

      // 创建用户
      const user = await this.userService.createUser({
        username,
        password,
        role: 'user',
      });

      // 生成JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        success: true,
        message: '注册成功',
        data: {
          id: user.id,
          username: user.username,
          role: user.role,
          token,
        },
      };
    } catch (error) {
      this.ctx.status = 500;
      return {
        success: false,
        message: '注册失败，服务器错误',
      };
    }
  }

  // 用户登录（简化版）
  @Post('/login')
  async login(@Body() body: any) {
    const { username, password } = body;

    try {
      // 查找用户
      const user = await this.userService.getUserByUsername(username);
      if (!user) {
        this.ctx.status = 401;
        return {
          success: false,
          message: '用户名或密码错误',
        };
      }

      // 验证密码
      if (user.password !== password) {
        this.ctx.status = 401;
        return {
          success: false,
          message: '用户名或密码错误'
        };
      }
      
      // 生成JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        success: true,
        message: '登录成功',
        data: {
          id: user.id,
          username: user.username,
          role: user.role,
          token,
        },
      };
    } catch (error) {
      this.ctx.status = 500;
      return {
        success: false,
        message: '登录失败，服务器错误',
      };
    }
  }

  // 获取当前用户信息
  @Get('/me', { middleware: [AuthMiddleware] })
  async getCurrentUser() {
    try {
      const userId = this.ctx.state.user.id;
      const user = await this.userService.getUserById(userId);

      if (!user) {
        this.ctx.status = 404;
        return {
          success: false,
          message: '用户不存在',
        };
      }

      return {
        success: true,
        data: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      };
    } catch (error) {
      this.ctx.status = 500;
      return {
        success: false,
        message: '获取用户信息失败',
      };
    }
  }
}
