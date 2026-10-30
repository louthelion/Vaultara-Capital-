// Retry diagnostics live outside the pending queue to avoid rewriting customer payloads.
export async function markRetryFailure(store,pendingKey,now=new Date().toISOString()){
  if(typeof pendingKey!=='string'||!pendingKey.startsWith('pending/'))return false;
  const key='retry-status/'+pendingKey.slice('pending/'.length);
  const previous=await store.get(key,{type:'json'});
  const attempts=Number.isSafeInteger(previous?.attempts)&&previous.attempts>=0?previous.attempts:0;
  await store.setJSON(key,{attempts:Math.min(attempts+1,Number.MAX_SAFE_INTEGER),lastAttemptAt:now});
  return true;
}
