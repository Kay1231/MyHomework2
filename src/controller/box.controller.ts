import { Controller, Get, Inject, Param, Post, Body } from '@midwayjs/core';
import { BoxService } from '../service/box.service';
import { DrawService } from '../service/draw.service';

@Controller('/api/box')
export class BoxController {
  @Inject()
  boxService: BoxService;

  @Inject()
  drawService: DrawService;

  @Get('/')
  async getAllBoxes() {
    return this.boxService.getAllBoxes();
  }

  @Get('/:id')
  async getBoxDetail(@Param('id') id: number) {
    return this.boxService.getBoxDetail(id);
  }

  @Post('/:id/draw')
  async drawBox(@Param('id') boxId: number, @Body() body: { userId: number }) {
    return this.drawService.drawBox(body.userId, boxId);
  }

}
