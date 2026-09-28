'use client';
import {useRef,useEffect,useState} from 'react';
import {Plus,Minus,LocateFixed,MapPin} from 'lucide-react';
import type {Place,View} from '@/lib/types';
import {BaiduMap} from './baidu-map';
import {cityCenter} from '@/lib/catalogue';
type Props={places:Place[];view:View;onView:(v:View)=>void;selected:string|null;onSelect:(p:Place)=>void;following:string|null;onStopFollow:()=>void};
export function TravelMap(props:Props){
 const[ak,setAk]=useState(''),[status,setStatus]=useState('正在检查地图服务…');
 useEffect(()=>{let active=true;fetch('/api/map-config').then(r=>{if(!r.ok)throw new Error();return r.json() as Promise<{enabled:boolean;ak:string|null}>;}).then(config=>{if(!active)return;if(config.enabled&&config.ak)setAk(config.ak);else setStatus('真实地图待开通 · 当前仅展示地点分布');}).catch(()=>{if(active)setStatus('地图配置暂时不可用 · 当前仅展示地点分布');});return()=>{active=false;};},[]);
 if(ak)return <><BaiduMap {...props} ak={ak}/>{props.following&&<button className="following-chip" onClick={props.onStopFollow}>正在跟随 {props.following} · 点击退出</button>}</>;
 return <><SchematicMap {...props} view={props.view.coordinateSystem==='BD09'?cityCenter(props.view.city):props.view}/><div className="map-setup-note" role="status"><strong>{status}</strong><span>道路、建筑和水系将在配置地图账号后显示。</span></div></>;
}
function SchematicMap({places,view,onView,selected,onSelect,following,onStopFollow}:Props){
 const container=useRef<HTMLDivElement>(null),drag=useRef<{x:number;y:number;view:View}|null>(null);const[size,setSize]=useState({width:700,height:700});
 useEffect(()=>{if(!container.current)return;const observer=new ResizeObserver(([e])=>setSize({width:e.contentRect.width,height:e.contentRect.height}));observer.observe(container.current);return()=>observer.disconnect();},[]);
 const scale=Math.pow(2,view.zoom-12)*Math.min(4500,Math.max(1,size.width-100)/.1);
 return <div className="map-paper interactive-map" ref={container} onPointerDown={e=>{if((e.target as HTMLElement).closest('button'))return;drag.current={x:e.clientX,y:e.clientY,view};e.currentTarget.setPointerCapture(e.pointerId);onStopFollow();}} onPointerMove={e=>{const d=drag.current;if(d)onView({...d.view,longitude:Math.max(-180,Math.min(180,d.view.longitude-(e.clientX-d.x)/scale)),latitude:Math.max(-85,Math.min(85,d.view.latitude+(e.clientY-d.y)/scale))});}} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}}>
 <div className="map-label">{view.city}</div><span className="map-coordinate">{view.latitude.toFixed(3)}° N · {view.longitude.toFixed(3)}° E</span>
 {places.map((p,i)=><button key={p.id} className={`demo-pin real-pin ${selected===p.id?'selected':''}`} style={{left:size.width/2+(p.longitude-view.longitude)*scale,top:size.height*.4-(p.latitude-view.latitude)*scale}} onClick={()=>onSelect(p)} aria-label={`查看${p.name}`}><span>{i+1}</span>{p.name}</button>)}
 <div className="map-controls"><button aria-label="放大" onClick={()=>{onStopFollow();onView({...view,zoom:Math.min(16,view.zoom+1)});}}><Plus size={19}/></button><button aria-label="缩小" onClick={()=>{onStopFollow();onView({...view,zoom:Math.max(8,view.zoom-1)});}}><Minus size={19}/></button><button aria-label="回到地点中心" onClick={()=>{onStopFollow();if(places.length)onView({...view,latitude:places[0].latitude,longitude:places[0].longitude,zoom:12});}}><LocateFixed size={19}/></button></div>
 {following&&<button className="following-chip" onClick={onStopFollow}>正在跟随 {following} · 点击退出</button>}
 <div className="map-disclaimer"><MapPin size={12}/>地点分布示意 · 底图与导航待接入</div></div>;
}
