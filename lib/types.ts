export type User={id:string;username:string;nickname:string};
export type CoordinateSystem='WGS84'|'BD09';
export type Place={id:string;name:string;city:string;latitude:number;longitude:number;coordinateSystem?:CoordinateSystem;description:string;duration:number;category:string;imageUrl?:string;localImage?:string;sourceUrl?:string;author?:string;license?:string;licenseUrl?:string;coordinateStatus?:string;coordinateSource?:string;infoUrl?:string;openingHours?:string;bookingUrl?:string;price?:string;verifiedAt?:string};
export type Item={id:string;placeId:string;name:string;city:string;latitude:number|null;longitude:number|null;coordinateSystem?:CoordinateSystem;day:number|null;start:string;duration:number;transport:string;travelMinutes:number|null;notes:string;version:number;creator:string;order:number;deleted?:boolean};
export type TripState={name:string;city:string;date:string;days:number;buffer:number;items:Item[];metaVersion:number};
export type Trip={id:string;owner:string;state:TripState;revision:number};
export type Member=User&{seen?:number;view?:View};
export type View={city:string;latitude:number;longitude:number;coordinateSystem?:CoordinateSystem;zoom:number};
export type Operation={id:string;user_id:string;label:string;target:string;before:string|null;after:string|null;created:number;revision:number;nickname:string};
export function minutes(value:string){if(!value)return null;const [h,m]=value.split(':').map(Number);return h*60+m;}
export function clockLabel(n:number){return `${n>=1440?'次日 ':''}${String(Math.floor(n/60)%24).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;}
export function conflict(previous:Item,current:Item,buffer:number){const a=minutes(previous.start),b=minutes(current.start);if(a===null||b===null||current.travelMinutes===null)return null;return Math.max(0,a+previous.duration+current.travelMinutes+buffer-b);}
