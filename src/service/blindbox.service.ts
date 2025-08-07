import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BlindBox } from '../entity/BlindBox';
import { BlindBoxItem } from '../entity/BlindBoxItem';

@Provide()
export class BlindBoxService {
    @InjectEntityModel(BlindBox)
    blindBoxRepo: Repository<BlindBox>;

    @InjectEntityModel(BlindBoxItem)
    blindBoxItemRepo: Repository<BlindBoxItem>;

    // 获取所有盲盒及其物品
    async getAllBlindBoxes(): Promise<BlindBox[]> {
        return this.blindBoxRepo.find({
            relations: ['items'],
            order: { createdAt: 'DESC' }
        });
    }

    // 根据ID获取盲盒详情
    async getBlindBoxById(id: number): Promise<BlindBox | null> {
        return this.blindBoxRepo.findOne({
            where: { id },
            relations: ['items', 'orders', 'comments']
        });
    }

    // 创建盲盒
    async createBlindBox(data: {
        name: string;
        price: number;
        coverImage: string;
        items: Array<{
            name: string;
            image: string;
            probability: number;
        }>;
    }): Promise<BlindBox> {
        const blindBox = this.blindBoxRepo.create({
            name: data.name,
            price: data.price,
            coverImage: data.coverImage,
            items: data.items.map(item => this.blindBoxItemRepo.create(item))
        });
        return this.blindBoxRepo.save(blindBox);
    }

    // 更新盲盒
    async updateBlindBox(id: number, data: Partial<BlindBox>): Promise<BlindBox | null> {
        await this.blindBoxRepo.update(id, data);
        return this.getBlindBoxById(id);
    }

    // 删除盲盒（级联删除物品）
    async deleteBlindBox(id: number): Promise<void> {
        await this.blindBoxRepo.delete(id);
    }

    // 添加盲盒物品
    async addBlindBoxItem(blindBoxId: number, itemData: {
        name: string;
        image: string;
        probability: number;
    }): Promise<BlindBoxItem> {
        const blindBox = await this.blindBoxRepo.findOneBy({ id: blindBoxId });
        if (!blindBox) throw new Error('BlindBox not found');
        const item = this.blindBoxItemRepo.create({ ...itemData, blindBox });
        return this.blindBoxItemRepo.save(item);
    }

    // 删除盲盒物品
    async deleteBlindBoxItem(itemId: number): Promise<void> {
        await this.blindBoxItemRepo.delete(itemId);
    }
}