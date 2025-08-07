import { Controller, Post, Inject, Body, HttpStatus } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/api/auth')
export class AuthController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Post('/register')
  async register(@Body() body: { username: string; password: string }) {
    try {
      const user = await this.userService.createUser(
        body.username,
        body.password
      );
      return {
        success: true,
        data: { id: user.id, username: user.username },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '注册失败',
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @Post('/login')
  async login(@Body() body: { username: string; password: string }) {
    try {
      const user = await this.userService.verifyUser(
        body.username,
        body.password
      );
      if (!user) {
        return {
          success: false,
          message: '用户名或密码错误',
          code: HttpStatus.UNAUTHORIZED,
        };
      }
      return {
        success: true,
        data: { id: user.id, username: user.username },
      };
    } catch (error) {
      return {
        success: false,
        message: '登录失败',
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
