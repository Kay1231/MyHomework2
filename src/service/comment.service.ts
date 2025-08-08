import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entity/comment.entity';

@Provide()
export class CommentService {
  @InjectEntityModel(Comment)
  commentModel: Repository<Comment>;

  async createComment(userId: number, boxId: number, content: string) {
    const comment = new Comment();
    comment.content = content;
    comment.user = { id: userId } as any;
    comment.box = { id: boxId } as any;
    return this.commentModel.save(comment);
  }

  async getCommentsByBoxId(boxId: number) {
    return this.commentModel.find({
      where: { box: { id: boxId } },
      relations: ['user'], // 关联用户，用于显示用户名
      order: { createdAt: 'DESC' },
    });
  }
}