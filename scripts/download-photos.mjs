import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
const photos=JSON.parse(await readFile(new URL('../data/photos.json',import.meta.url),'utf8'));
for(let i=0;i<photos.length;i++){
 const p=photos[i], destination=new URL(`../public/photos/place-${i}.jpg`,import.meta.url).pathname;
 const result=spawnSync('curl',['-L','--fail','--max-time','45','--retry','1','-A','TravelPlanner/1.0 personal project',p.imageUrl,'-o',destination],{encoding:'utf8'});
 if(result.status===0){spawnSync('sips',['-Z','1000',destination],{encoding:'utf8'});p.localImage=`/photos/place-${i}.jpg`;console.log(`${p.city} ${p.name}：已保存`);}
 else console.log(`${p.city} ${p.name}：下载未成功`);
}
await writeFile(new URL('../data/photos.json',import.meta.url),JSON.stringify(photos,null,2)+'\n');
