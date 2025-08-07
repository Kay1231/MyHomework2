import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BoxItem } from '../entity/box-item.entity';
import { UserBox } from '../entity/user-box.entity';

@Provide()
export class DrawService {
  @InjectEntityModel(BoxItem)
  itemModel: Repository<BoxItem>;

  @InjectEntityModel(UserBox)
  userBoxModel: Repository<UserBox>;

  async drawBox(userId: number, boxId: number) {
    // 获取盲盒所有物品及其概率
    const items = await this.itemModel.find({
      where: { box: { id: boxId } },
      select: ['id', 'name', 'image', 'probability'],
    });

    // 概率抽取逻辑
    const total = items.reduce((sum, item) => sum + item.probability, 0);
    let random = Math.random() * total;

    let selectedItem: BoxItem;
    for (const item of items) {
      random -= item.probability;
      if (random <= 0) {
        selectedItem = item;
        break;
      }
    }

    // 保存抽取记录
    const record = new UserBox();
    record.user = { id: userId } as any;
    record.item = selectedItem!;
    await this.userBoxModel.save(record);

    return {
      id: selectedItem!.id,
      name: selectedItem!.name,
      image: selectedItem!.image,
    };
  }
}
