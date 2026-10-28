const PRODUCTION_INTAKE_URL='https://vaultara-capital-dashboard.netlify.app/api/intake-sync';
export function resolveIntakeEndpoint(context,configuredUrl){
  if(context==='production')return PRODUCTION_INTAKE_URL;
  if(!configuredUrl)throw Error('Isolated test dashboard URL is not configured');
  let url;
  try{url=new URL(configuredUrl);}catch{throw Error('Invalid isolated test dashboard URL');}
  if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||
     url.port||url.pathname!=='/api/intake-sync'||
     !/^[a-z0-9-]+\.netlify\.app$/.test(url.hostname)||
     url.hostname==='vaultara-capital-dashboard.netlify.app')
    throw Error('Isolated test dashboard URL is not allowed');
  return url.toString();
}
