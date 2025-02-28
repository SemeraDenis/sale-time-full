import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user.module';
import { PostModule } from './post.module';
import { OfferModule } from './offer.protected.module';
import { PostProtectedModule } from './post.protected.module';
import { JwtDecodeMiddleware } from '../middleware/jwt-decode.middleware';
import {DictionaryModule} from "./category.module";



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USERNAME || 'default',
      password: process.env.POSTGRES_PWD || 'default',
      database: process.env.POSTGRES_DB || 'default',
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
      .apply(JwtDecodeMiddleware)
      .forRoutes('*');
  }
}
