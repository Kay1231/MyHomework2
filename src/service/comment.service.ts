// src/service/comment.service.ts
import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';

@Provide()
export class CommentService {
  @InjectEntityModel('Comment')
  commentModel;

  @InjectEntityModel('BlindBox')
  blindBoxModel;

  @InjectEntityModel('User')
  userModel;

  async createComment(userId, blindBoxId, content) {
    const user = await this.userModel.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('用户不存在');
    }
    
    const blindBox = await this.blindBoxModel.findOne({ where: { id: blindBoxId } });
    if (!blindBox) {
      throw new Error('盲盒不存在');
    }
    
    const comment = new this.commentModel();
    comment.user = user;
    comment.blindBox = blindBox;
    comment.content = content;
    
    return this.commentModel.save(comment);
  }

  async getBlindBoxComments(blindBoxId, page, limit) {
    const skip = (page - 1) * limit;
    
    const [comments, total] = await this.commentModel.findAndCount({
      where: { blindBox: { id: blindBoxId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit
    });
    
    return {
      comments,
      total
    };
  }

  async deleteComment(id) {
    const comment = await this.commentModel.findOne({ where: { id } });
    if (!comment) {
      return false;
    }
    
    await this.commentModel.delete(id);
    return true;
  }
}