// A durable delivery receipt means the dashboard already acknowledged this ID.
export function hasConfirmedDelivery(receipt){
 return receipt!==null&&typeof receipt==='object'&&!Array.isArray(receipt)&&
  typeof receipt.deliveredAt==='string'&&Number.isFinite(Date.parse(receipt.deliveredAt));
}

export function pendingRecordMatchesKey(key,record){
 if(typeof key!=='string'||!key.startsWith('pending/'))return false;
 const id=record?.submission?.id;
 return typeof id==='string'&&/^[a-zA-Z0-9-]{8,100}$/.test(id)&&key==='pending/'+id;
}
