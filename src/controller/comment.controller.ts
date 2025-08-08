import { Controller, Post, Get, Inject, Body, Param } from '@midwayjs/core';
import { CommentService } from '../service/comment.service';

@Controller('/api/comment')
export class CommentController {
  @Inject()
  commentService: CommentService;

  @Post('/')
  async create(@Body() body: { userId: number; boxId: number; content: string }) {
  try {
    const { userId, boxId, content } = body;
    
    // 创建评论
    const comment = await this.commentService.createComment(userId, boxId, content);
    
    // 重新加载评论以获取用户信息
    const fullComment = await this.commentService.commentModel.findOne({
      where
: { id: comment.id },
      relations
: ['user'] // 加载关联的用户信息
    });
    
    return { 
      success
: true, 
      data
: fullComment // 返回完整的评论对象
    };
  } catch (error) {
    return {
      success
: false,
      message
: error.message,
      code
: 500
    };
  }
}

  @Get('/:boxId')
  async getByBoxId(@Param('boxId') boxId: number) {
    const comments = await this.commentService.getCommentsByBoxId(boxId);
    return { success: true, data: comments };
  }
}