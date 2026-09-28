import photos from '@/data/photos.json';
import type {Place} from './types';
const notes:Record<string,[string,string,number]>={
 '天坛':['古建 · 公园','看看祈年殿，也给园中的散步留一点时间。',150],
 '外滩':['滨江 · 城市漫步','沿着江岸走一走，看两岸建筑与城市灯火。',90],
 '西湖':['湖泊 · 城市漫步','沿着湖岸散步，把时间留给风景。',180],
 '灵隐寺':['古寺 · 山林','在山林与古寺之间，慢慢走一段路。',150],
 '雷峰塔':['古建 · 湖景','换个角度看看西湖，把登塔安排进旅程。',90],
 '中山陵':['人文 · 建筑','沿着中轴线拾级而上，感受建筑与山林。',150],
 '拙政园':['园林 · 人文','走过廊桥与花窗，留意每一处借景。',120],
 '武侯祠':['人文 · 古迹','在院落里读一段三国故事。',120],
 '洪崖洞':['城市 · 夜景','沿江欣赏层叠的建筑，晚间预留人流时间。',90],
 '钟楼':['古建 · 城市中心','从城市中心出发，看看白天与夜晚的钟楼。',60],
 '鼓浪屿·菽庄花园':['海岛 · 园林','在临海的花园里慢慢散步。',90],
 '广州塔':['建筑 · 城市景观','沿江看塔，登塔行程需另外核实预约与票务。',120],
};
export const catalogue:Place[]=photos.map(p=>({...p,coordinateSystem:'WGS84'}));
export const cities=['杭州','北京','上海','南京','苏州','成都','重庆','西安','厦门','广州'];
export const cityCenter=(city:string):import('./types').View=>{const p=catalogue.find(p=>p.city===city);return {city,latitude:p?.latitude||30.24,longitude:p?.longitude||120.15,zoom:12,coordinateSystem:'WGS84'};};
