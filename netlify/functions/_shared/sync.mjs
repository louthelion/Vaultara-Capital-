import {createHmac,timingSafeEqual} from 'node:crypto';
export function signSync(body,timestamp,key){return createHmac('sha256',key).update(timestamp+'.'+body).digest('hex');}
export function verifySync(body,timestamp,signature,key,now=Date.now()){if(!key||!/^\d{13}$/.test(timestamp||'')||Math.abs(now-Number(timestamp))>300000||!/^[a-f0-9]{64}$/.test(signature||''))return false;return timingSafeEqual(Buffer.from(signature,'hex'),Buffer.from(signSync(body,timestamp,key),'hex'));}
