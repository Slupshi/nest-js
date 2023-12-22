import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './utils/middlewares/logger.middleware';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './utils/guards/auth.guard';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  imports: [AuthModule, UsersModule, ProductsModule, OrdersModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: "*", method: RequestMethod.ALL,
    });
  }
}
