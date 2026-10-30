// A durable delivery receipt means the dashboard already acknowledged this ID.
export function hasConfirmedDelivery(receipt){
 return receipt!==null&&typeof receipt==='object'&&!Array.isArray(receipt)&&
  typeof receipt.deliveredAt==='string'&&Number.isFinite(Date.parse(receipt.deliveredAt));
}
