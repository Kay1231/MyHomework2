import { MidwayConfig } from '@midwayjs/core';
// import your entities from the correct path
// Update the import path to match your actual entities folder
import * as entities from '../entity'; // Assuming your entities are in src/entity folder
// If your entities are in a different folder, update the path accordingly, e.g.:
// import * as entities from '../models/entities';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1753998171219_5255',
  koa: {
    port: 7001,
  },
  typeorm:{
    dataSource: {
      default: {
        type: 'sqlite',
        database: 'webbackend.db',
        synchronize: true, // 开发环境下建议开启，生产环境下建议关闭
        logging: true, // 是否打印SQL日志
        entities: [...Object.values(entities)],
      }
    }
  }
} as MidwayConfig;
