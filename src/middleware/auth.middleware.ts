import { Middleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@midwayjs/core/dist/error/http';


@Middleware()
export class AuthMiddleware {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 从请求头获取 Authorization 字段
      const authHeader = ctx.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // 没有提供 token
        throw new UnauthorizedError('未提供认证令牌');
      }

      // 提取 token (去掉 "Bearer " 前缀)
      const token = authHeader.split(' ')[1];

      try {
        // 验证 token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 将解码后的用户信息添加到 ctx.state
        ctx.state.user = decoded;

        // 继续执行后续中间件和控制器
        await next();
      } catch (err) {
        // 处理各种可能的错误
        if (err instanceof jwt.TokenExpiredError) {
          throw new UnauthorizedError('认证令牌已过期');
        } else if (err instanceof jwt.JsonWebTokenError) {
          throw new UnauthorizedError('无效的认证令牌');
        } else {
          // 其他错误
          throw new UnauthorizedError('认证失败');
        }
      }
    };
  }

  // 配置中间件选项
  static getName(): string {
    return 'auth';
  }

  // 设置中间件忽略的路径（可选）
  static getConfig() {
    return {
      // 忽略登录和注册路由
      ignore: [
        '/api/users/login',
        '/api/users/register',
        '/api/blindboxes', // 盲盒列表不需要认证
        '/api/blindboxes/:id', // 盲盒详情不需要认证
        /^\/api\/blindboxes\/search/, // 搜索盲盒不需要认证
      ],
      // 设置中间件匹配的路径（默认为所有路由）
      match: [
        '/api/users/me', // 用户信息需要认证
        '/api/orders/**', // 所有订单相关路由需要认证
        '/api/comments/**', // 所有评论相关路由需要认证
        '/api/admin/**', // 所有管理员路由需要认证
      ],
    };
  }
}
