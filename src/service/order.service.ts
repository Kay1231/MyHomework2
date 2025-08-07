import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';

@Provide()
export class OrderService {
  @InjectEntityModel('Order')
  orderModel;

  @InjectEntityModel('BlindBox')
  blindBoxModel;

  @InjectEntityModel('User')
  userModel;

  @InjectEntityModel('OrderItem')
  orderItemModel;

  async createOrder(userId, blindBoxId) {
    const user = await this.userModel.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('用户不存在');
    }
    
    const blindBox = await this.blindBoxModel.findOne({ where: { id: blindBoxId } });
    if (!blindBox) {
      throw new Error('盲盒不存在');
    }
    
    const resultItem = this.drawBlindBox(blindBox);
    
    const order = new this.orderModel();
    order.user = user;
    order.blindBox = blindBox;
    order.totalPrice = blindBox.price;
    order.status = 'completed';
    
    const savedOrder = await this.orderModel.save(order);
    
    const orderItem = new this.orderItemModel();
    orderItem.order = savedOrder;
    orderItem.itemName = resultItem.item;
    orderItem.price = blindBox.price;
    orderItem.quantity = 1;
    
    await this.orderItemModel.save(orderItem);
    
    return {
      ...savedOrder,
      items: [{
        itemName: resultItem.item,
        price: blindBox.price
      }]
    };
  }

  drawBlindBox(blindBox) {
    const probabilities = blindBox.probabilities;
    if (!probabilities || probabilities.length === 0) {
      throw new Error('盲盒未设置概率');
    }
    
    const totalProbability = probabilities.reduce((sum, prob) => sum + prob.chance, 0);
    if (Math.abs(totalProbability - 1) > 0.01) {
      throw new Error('盲盒概率总和必须为1');
    }
    
    const rand = Math.random();
    let cumulative = 0;
    
    for (const prob of probabilities) {
      cumulative += prob.chance;
      if (rand <= cumulative) {
        return {
          item: prob.item,
          rarity: prob.rarity || 'normal'
        };
      }
    }
    
    return {
      item: probabilities[probabilities.length - 1].item,
      rarity: probabilities[probabilities.length - 1].rarity || 'normal'
    };
  }

  async getUserOrders(userId, page, limit) {
    const skip = (page - 1) * limit;
    
    const [orders, total] = await this.orderModel.findAndCount({
      where: { user: { id: userId } },
      relations: ['blindBox', 'items'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit
    });
    
    return {
      orders,
      total
    };
  }

  async getOrderDetail(id) {
    return this.orderModel.findOne({
      where: { id },
      relations: ['blindBox', 'items', 'user']
    });
  }

  async deleteOrder(id) {
    const order = await this.orderModel.findOne({ where: { id } });
    if (!order) {
      return false;
    }
    
    await this.orderItemModel.delete({ order: { id } });
    await this.orderModel.delete(id);
    return true;
  }
}