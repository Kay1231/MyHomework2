import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Box } from '../entity/box.entity';

@Provide()
export class BoxService {
  @InjectEntityModel(Box)
  boxModel: Repository<Box>;

  async getAllBoxes() {
    return this.boxModel.find({
      select: ['id', 'name', 'image'],
    });
  }

  async getBoxDetail(id: number) {
    return this.boxModel.findOne({
    where
: { id },
    relations
: ['items', 'comments', 'comments.user'], // 添加comments关系
  });
  }
  

  // 在 BoxService 类中添加
}
