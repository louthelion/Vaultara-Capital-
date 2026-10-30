import {createHash} from 'node:crypto';
export function normalizeSubmissionMetadata(payload,source,data,now=new Date().toISOString()){
 const created=typeof payload?.created_at==='string'&&Number.isFinite(Date.parse(payload.created_at))?payload.created_at:now;
 const provided=payload?.id;
 const id=typeof provided==='string'&&/^[a-zA-Z0-9-]{8,100}$/.test(provided)
  ?provided:createHash('sha256').update(JSON.stringify({source,data,created})).digest('hex');
 return {id,created};
}
