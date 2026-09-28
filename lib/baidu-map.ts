import type {View} from './types';

type Point={lng:number;lat:number};
export type MapApi=any;
let loading:Promise<MapApi>|undefined;
export function loadMap(ak:string):Promise<MapApi>{
 if(loading)return loading;
 loading=new Promise((resolve,reject)=>{
  const scope=window as any;
  if(scope.BMap?.Map){resolve(scope.BMap);return;}
  const script=document.createElement('script');
  const finish=(error?:Error)=>{clearTimeout(timer);script.onerror=null;delete scope.travelMapReady;if(error){script.remove();loading=undefined;reject(error);}else resolve(scope.BMap);};
  const timer=setTimeout(()=>finish(new Error('地图加载超时，请检查网络和地图账号配置。')),15000);
  scope.travelMapReady=()=>scope.BMap?.Map?finish():finish(new Error('地图服务尚未准备好。'));
  script.onerror=()=>finish(new Error('地图加载失败，请检查网络和域名白名单。'));
  script.src=`https://api.map.baidu.com/api?v=4.0&ak=${encodeURIComponent(ak)}&callback=travelMapReady`;
  document.head.appendChild(script);
 });
 return loading;
}

const conversions=new Map<string,Point>();
let queue:Promise<unknown>=Promise.resolve();
// 只缓存本次页面使用的转换结果，按十个点分批串行请求，避免重复消耗配额。
export function mapPoints(api:MapApi,points:Array<Pick<View,'latitude'|'longitude'|'coordinateSystem'>>):Promise<Point[]>{
 const task=queue.catch(()=>{}).then(async()=>{
  const key=(p:typeof points[number])=>`${p.longitude},${p.latitude}`;
  const missing=[...new Map(points.filter(p=>p.coordinateSystem!=='BD09'&&!conversions.has(key(p))).map(p=>[key(p),p])).values()];
  for(let i=0;i<missing.length;i+=10){
   const batch=missing.slice(i,i+10);
   const converted=await new Promise<Point[]>((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error('地点坐标转换超时，请稍后重试。')),10000);
    new api.Convertor().translate(batch.map(p=>new api.Point(p.longitude,p.latitude)),1,5,(result?:{status:number;points:Point[];message?:string})=>{
     clearTimeout(timer);
     if(result?.status===0&&result.points?.length===batch.length)resolve(result.points);
     else {const code=Number.isFinite(result?.status)?`（状态码 ${result!.status}）`:'';reject(new Error(`地点坐标转换未完成${code}。请在百度控制台检查此应用的启用服务、域名白名单和调用额度，保存后刷新页面。`));}
    });
   });
   batch.forEach((p,j)=>conversions.set(key(p),converted[j]));
   await new Promise(resolve=>setTimeout(resolve,400));
  }
  return points.map(p=>p.coordinateSystem==='BD09'?{lng:p.longitude,lat:p.latitude}:conversions.get(key(p))!);
 });
 queue=task;return task;
}
