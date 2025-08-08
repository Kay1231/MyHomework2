import { Controller, Post, Inject, Body } from '@midwayjs/core';
import { InitService } from '../service/init.service';

@Controller('/api/init')
export class InitController {
  @Inject()
  initService: InitService;

  @Post('/preset-boxes')
  async initPresetBoxes(@Body() body: { boxes: any[] }) {
    return this.initService.initPresetBoxes(body.boxes);
  }
}