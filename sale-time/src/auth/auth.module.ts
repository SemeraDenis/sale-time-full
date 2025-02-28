import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [PassportModule],
    providers: [JwtStrategy], // Добавляем стратегию JWT
    exports: [JwtStrategy],   // Делаем её доступной в других модулях
})
export class AuthModule {}
