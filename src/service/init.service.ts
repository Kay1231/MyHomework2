import { Provide, Init } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Box } from '../entity/box.entity';
import { BoxItem } from '../entity/box-item.entity';

@Provide()
export class InitService {
  @InjectEntityModel(Box)
  boxModel: Repository<Box>;

  @InjectEntityModel(BoxItem)
  itemModel: Repository<BoxItem>;

  @Init()
  async init() {
    // 默认不自动初始化，通过API触发
  }

  async initPresetBoxes(presetBoxes: any[]) {
    try {
      // 清空现有数据
      await this.itemModel.clear();
      await this.boxModel.clear();

      // 保存预设盲盒
      for (const boxData of presetBoxes) {
        const box = new Box();
        box.name = boxData.name;
        box.image = boxData.image;
        const savedBox = await this.boxModel.save(box);
        
        for (const itemData of boxData.items) {
          const item = new BoxItem();
          item.name = itemData.name;
          item.image = itemData.image;
          item.probability = itemData.probability;
          item.box = savedBox;
          await this.itemModel.save(item);
        }
      }
      
      return { success: true, message: '预设盲盒初始化完成' };
    } catch (error) {
      console.error('初始化预设盲盒失败:', error);
      return { success: false, message: '初始化失败: ' + error.message };
    }
  }
}