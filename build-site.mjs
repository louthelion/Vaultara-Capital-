import {readdir,mkdir,cp} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
const excluded=new Set(['dist','node_modules','netlify','package.json','package-lock.json','netlify.toml','build-site.mjs']);
for(const entry of await readdir('.', {withFileTypes:true})){
if(entry.name.startsWith('.')||excluded.has(entry.name))continue;
await cp(entry.name,'dist/'+entry.name,{recursive:true});
}
