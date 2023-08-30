import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { LoggerMiddleware } from 'src/middleware/logger.middleware';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UserModule, PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [],
  exports: [],
})
export class AppModule implements NestModule {
  // configure
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
