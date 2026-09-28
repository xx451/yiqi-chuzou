'use client';
import {useState,useEffect} from 'react';
import {X,MapPin} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from '@/components/ui/select';
import type {Place} from '@/lib/types';
export function Picker({value,onChange,options,label}:{value:string;onChange:(s:string)=>void;options:string[];label:string}){return <Select value={value} onValueChange={onChange}><SelectTrigger className="picker" aria-label={label}><SelectValue/></SelectTrigger><SelectContent>{options.map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>;}
export function Photo({place}:{place:Place}){const[failed,setFailed]=useState(false);useEffect(()=>setFailed(false),[place.id]);return <div className="photo">{!failed&&(place.localImage||place.imageUrl)?<img src={place.localImage||place.imageUrl} alt={place.name} loading="lazy" onError={()=>setFailed(true)}/>:<div className="photo-empty"><MapPin size={28}/><span>暂无图片</span></div>}<span className="photo-caption">{place.city} · {place.name}</span></div>;}
export function Modal({title,description,children,onClose}:{title:string;description?:string;children:React.ReactNode;onClose:()=>void}){return <Dialog open onOpenChange={v=>!v&&onClose()}><DialogContent className="travel-modal" showCloseButton={false}><button className="close-modal" aria-label="关闭" onClick={onClose}><X size={20}/></button><DialogTitle>{title}</DialogTitle><DialogDescription>{description||'一起把旅行安排好。'}</DialogDescription>{children}</DialogContent></Dialog>;}
export function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="field"><span>{label}</span>{children}</label>;}
export function Input({label,name,value,type='text',required=false,placeholder}:{label:string;name:string;value?:string|number;type?:string;required?:boolean;placeholder?:string}){return <Field label={label}><input name={name} defaultValue={value} type={type} required={required} placeholder={placeholder}/></Field>;}
