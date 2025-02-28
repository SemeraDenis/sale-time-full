import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret';

export function signJWT(payload: any) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

export function verifyJWT(token: string) {
  try{
    return jwt.verify(token, SECRET_KEY);
  }
  catch(error){
    console.error(error);
    return null;
  }
}