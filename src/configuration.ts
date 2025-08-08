import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as orm from '@midwayjs/typeorm';
import * as swagger from '@midwayjs/swagger';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';
import * as crossDomain from '@midwayjs/cross-domain';
import DefaultConfig from './config/config.default';
 import UnitTestConfig from './config/config.unittest';
 import * as staticFile from '@midwayjs/static-file';
@Configuration({
  imports: [
    koa,
    swagger,
    orm,
    validate,
    crossDomain,
    staticFile,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [{
 default: DefaultConfig,
 unittest: UnitTestConfig
 }],
})
export class MainConfiguration {

  @App('koa')
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware]);
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
