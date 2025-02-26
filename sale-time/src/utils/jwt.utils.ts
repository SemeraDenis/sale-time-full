import * as jwt from 'jsonwebtoken'

const SECRET_KEY = 'SALE-TIME-JWT_SECRET_KEY';

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