function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function shuffle(arr,r){for(let i=arr.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr}
const D4=[[1,0],[-1,0],[0,1],[0,-1]];
function perm(n,r){const p=[],used=new Array(n).fill(false);
  function bt(i){if(i===n)return true;for(const c of shuffle([...Array(n).keys()],r)){if(used[c])continue;if(i>0&&Math.abs(p[i-1]-c)<=1)continue;used[c]=true;p[i]=c;if(bt(i+1))return true;used[c]=false}return false}
  bt(0);return p}
function grow(n,p,r){const g=Array.from({length:n},()=>new Array(n).fill(-1));
  for(let i=0;i<n;i++)g[i][p[i]]=i;let left=n*n-n;
  while(left>0){const k=Math.floor(r()*n);const cells=[];
    for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(g[y][x]===k)for(const[dy,dx]of D4){const yy=y+dy,xx=x+dx;if(yy>=0&&yy<n&&xx>=0&&xx<n&&g[yy][xx]===-1)cells.push([yy,xx])}
    if(!cells.length)continue;const[yy,xx]=cells[Math.floor(r()*cells.length)];g[yy][xx]=k;left--}
  return g}
// returns up to `limit` solutions
function solve(n,g,limit){const out=[];const uc=new Array(n).fill(false),ur=new Array(n).fill(false),p=[];
  function bt(i){if(out.length>=limit)return;if(i===n){out.push(p.slice());return}for(let x=0;x<n;x++){if(uc[x])continue;if(i>0&&Math.abs(p[i-1]-x)<=1)continue;const k=g[i][x];if(ur[k])continue;uc[x]=ur[k]=true;p[i]=x;bt(i+1);uc[x]=ur[k]=false}}
  bt(0);return out}
function connected(n,g,k){let start=null,total=0;for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(g[y][x]===k){total++;if(!start)start=[y,x]}
  if(!start)return false;const seen=new Set([start[0]*n+start[1]]),st=[start];
  while(st.length){const[y,x]=st.pop();for(const[dy,dx]of D4){const yy=y+dy,xx=x+dx;if(yy>=0&&yy<n&&xx>=0&&xx<n&&g[yy][xx]===k&&!seen.has(yy*n+xx)){seen.add(yy*n+xx);st.push([yy,xx])}}}
  return seen.size===total}
function makePuzzle(n,seed){const r=mulberry32(seed);
  for(let t=0;t<200;t++){const p=perm(n,r);const g=grow(n,p,r);
    for(let fix=0;fix<300;fix++){const sols=solve(n,g,2);if(sols.length===1)return{n,regions:g,sol:p};
      const alt=sols.find(s=>s.some((x,i)=>x!==p[i]));
      const rows=shuffle([...Array(n).keys()].filter(i=>alt[i]!==p[i]),r);let done=false;
      for(const i of rows){const x=alt[i],k=g[i][x];if(x===p[i])continue;
        const nb=shuffle(D4.map(([dy,dx])=>[i+dy,x+dx]).filter(([y,xx])=>y>=0&&y<n&&xx>=0&&xx<n&&g[y][xx]!==k),r);
        for(const[y,xx]of nb){const k2=g[y][xx];g[i][x]=k2;if(connected(n,g,k)){done=true;break}g[i][x]=k}
        if(done)break}
      if(!done)break}}
  return null}
if(typeof module!=='undefined')module.exports={makePuzzle,solve};
