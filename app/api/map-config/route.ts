import {env} from 'cloudflare:workers';
export const dynamic='force-dynamic';
export async function GET(){
 const enabled=env.BAIDU_MAP_ENABLED==='true';
 const ak=enabled?env.BAIDU_MAP_BROWSER_AK?.trim():undefined;
 // 浏览器端 AK 本来会公开；服务端密钥不得通过这个接口返回。
 return Response.json({enabled:!!ak,ak:ak||null},{headers:{'Cache-Control':'no-store'}});
}
