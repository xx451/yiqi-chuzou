'use client';
import {useEffect,useRef,useState} from 'react';
import {loadMap,mapPoints,type MapApi} from '@/lib/baidu-map';
import type {Place,View} from '@/lib/types';
type Props={ak:string;places:Place[];view:View;onView:(view:View)=>void;selected:string|null;onSelect:(place:Place)=>void;onStopFollow:()=>void};
export function BaiduMap(props:Props){
 const container=useRef<HTMLDivElement>(null),map=useRef<any>(null),latest=useRef(props);latest.current=props;
 const placesKey=JSON.stringify(props.places.map(p=>[p.id,p.latitude,p.longitude,p.coordinateSystem]));
 const[api,setApi]=useState<MapApi>(null),[error,setError]=useState(''),[ready,setReady]=useState(false);
 useEffect(()=>{
  let cancelled=false,instance:any;
  loadMap(props.ak).then(async b=>{
   const [center]=await mapPoints(b,[latest.current.view]);
   if(cancelled||!container.current)return;
   instance=new b.Map(container.current,{center:new b.Point(center.lng,center.lat),zoom:latest.current.view.zoom,enableScrollWheelZoom:true,displayOptions:{building:true}});
   map.current=instance;
   instance.addEventListener('tilesloaded',()=>{if(!cancelled)setReady(true);});
   const publish=()=>{const p=instance.getCenter(),v=latest.current.view,z=instance.getZoom();if(v.coordinateSystem==='BD09'&&Math.abs(p.lat-v.latitude)<1e-7&&Math.abs(p.lng-v.longitude)<1e-7&&z===v.zoom)return;latest.current.onView({...v,latitude:p.lat,longitude:p.lng,zoom:z,coordinateSystem:'BD09'});};
   instance.addEventListener('moveend',publish);instance.addEventListener('zoomend',publish);
   setApi(b);
  }).catch(e=>{if(!cancelled)setError(e.message);});
  return()=>{cancelled=true;instance?.destroy();map.current=null;};
 },[props.ak]);
 useEffect(()=>{
  if(!api)return;let cancelled=false;
  mapPoints(api,[props.view]).then(([p])=>{if(cancelled||!map.current)return;const current=map.current.getCenter();if(Math.abs(current.lng-p.lng)>1e-7||Math.abs(current.lat-p.lat)>1e-7||map.current.getZoom()!==props.view.zoom)map.current.centerAndZoom(new api.Point(p.lng,p.lat),props.view.zoom);}).catch(e=>{if(!cancelled)setError(e.message);});
  return()=>{cancelled=true;};
 },[api,props.view.latitude,props.view.longitude,props.view.coordinateSystem,props.view.zoom]);
 useEffect(()=>{
  if(!api)return;let cancelled=false;const markers:any[]=[];
  mapPoints(api,props.places).then(points=>{if(cancelled||!map.current)return;props.places.forEach((p,i)=>{const marker=new api.Marker(new api.Point(points[i].lng,points[i].lat),{title:p.name});marker.addEventListener('click',()=>latest.current.onSelect(p));map.current.addOverlay(marker);markers.push(marker);});setError('');}).catch(e=>{if(!cancelled)setError(e.message);});
  return()=>{cancelled=true;markers.forEach(marker=>map.current?.removeOverlay(marker));};
 },[api,placesKey]);
 return <div className="baidu-map-shell" onPointerDown={props.onStopFollow} onWheel={props.onStopFollow}>
  <div ref={container} className="baidu-map-canvas" aria-label={`${props.view.city}真实地图`}/>
  {(!ready||error)&&<div className="map-service-status" role="status">{error||'正在加载真实地图；长时间未显示时，请检查密钥权限、域名白名单和网络。'}</div>}
  <div className="map-controls"><button aria-label="放大地图" onClick={()=>map.current?.setZoom(Math.min(20,map.current.getZoom()+1))}>＋</button><button aria-label="缩小地图" onClick={()=>map.current?.setZoom(Math.max(3,map.current.getZoom()-1))}>−</button><button aria-label="查看建筑立体效果" onClick={()=>{if(map.current)map.current.flyTo(map.current.getCenter(),Math.max(17,map.current.getZoom()),{tilt:55,duration:600});}}>立体</button><button aria-label="恢复平面地图" onClick={()=>map.current?.setTilt(0)}>平面</button></div>
 </div>;
}
