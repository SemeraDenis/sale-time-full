import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import {JwtUserInfo} from "../../model/jwt-user-info.model";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || 'default_secret',
        });
    }

    async validate(payload: any): Promise<JwtUserInfo> {
        return { id: payload.id, fullName: payload.fullName };
    }
}
