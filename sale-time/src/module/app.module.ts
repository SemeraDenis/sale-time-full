import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user.module';
import { PostModule } from './post.module';
import { OfferModule } from './offer.protected.module';
import { PostProtectedModule } from './post.protected.module';
import { JwtAuthenticationMiddleware } from '../middleware/jwt-auth.middleware';
import {DictionaryModule} from "./category.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pwd',
      database: 'sale_time_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    PostModule,
    PostProtectedModule,
    OfferModule,
    DictionaryModule
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthenticationMiddleware)
      .forRoutes('*');
  }
}
