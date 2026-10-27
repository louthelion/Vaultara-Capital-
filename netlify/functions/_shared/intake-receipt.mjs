export function validateIntakeReceipt(receipt, submissionId) {
  const id=String(submissionId);
  if(!/^[a-zA-Z0-9-]{8,100}$/.test(id))return false;
  return receipt!==null && typeof receipt==='object' && !Array.isArray(receipt) &&
    receipt.saved===true && receipt.inquiryId===id && receipt.taskId==='intake-'+id;
}
