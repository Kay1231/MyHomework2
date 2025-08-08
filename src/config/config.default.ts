import { MidwayConfig } from '@midwayjs/core';
import { join } from 'path';
import { User } from '../entity/user.entity'; // 明确导入实体
import { Box } from '../entity/box.entity';
import { BoxItem } from '../entity/box-item.entity';
import { UserBox } from '../entity/user-box.entity';
import { Comment } from '../entity/comment.entity';

export default {
  keys: '1753998171219_5255',
  koa: {
    port: 7001,
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'sqlite',
        database: join(__dirname, '../../webbackend.db'), // 完整路径
        synchronize: true,
        logging: true,
        // 明确列出所有实体
        entities: [User, Box, BoxItem, UserBox, Comment],
      },
    },
  },
} as MidwayConfig;