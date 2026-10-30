// Persist retry metadata without discarding the original queued submission.
export async function markRetryFailure(store,key,record,now=new Date().toISOString()){
  if(!record||typeof record!=='object'||Array.isArray(record))return false;
  const attempts=Number.isSafeInteger(record.attempts)&&record.attempts>=0?record.attempts:0;
  await store.setJSON(key,{...record,attempts:Math.min(attempts+1,Number.MAX_SAFE_INTEGER),lastAttemptAt:now});
  return true;
}
