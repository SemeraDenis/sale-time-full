import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user.module';
import { PostModule } from './post.module';
import { OfferModule } from './offer.protected.module';
import { PostProtectedModule } from './post.protected.module';
import {DictionaryModule} from "./category.module";
import {AuthModule} from "../auth/auth.module";
import {ConfigModule} from "@nestjs/config";



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
    DictionaryModule,
    ConfigModule.forRoot({ isGlobal: true }), // Подключаем глобально
    AuthModule,
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {

  }
}
