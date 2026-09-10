(() => {
const letters=["C","D","E","F","G","A","B"], li={C:0,D:1,E:2,F:3,G:4,A:5,B:6};
const idx=(l,o)=>o*7+li[l], fromIdx=n=>({letter:letters[((n%7)+7)%7],octave:Math.floor(n/7)});
const $=id=>document.getElementById(id), root=$("app"), clef=$("clef"), range=$("range"), label=$("clefLabel"), symbol=$("clefSymbol"), note=$("note"), stem=$("stem"), ledger=$("ledger"), feedback=$("feedback");
let current,currentClef,shownAt,correct=0,wrong=0,streak=0,times=[],locked=false,last="";
function limits(c){if(range.value==="basic")return c==="treble"?[idx("E",4),idx("F",5)]:[idx("G",2),idx("A",3)];return c==="treble"?[idx("C",4),idx("C",6)]:[idx("E",2),idx("E",4)]}
function pickClef(){return clef.value==="both"?(Math.random()<.5?"treble":"bass"):clef.value}
function drawLedger(y){ledger.replaceChildren();let ys=[];if(y>=140)for(let v=140;v<=y+1;v+=20)ys.push(v);else if(y<=20)for(let v=20;v>=y-1;v-=20)ys.push(v);ys.forEach(v=>{let l=document.createElementNS("http://www.w3.org/2000/svg","line");l.setAttribute("x1","198");l.setAttribute("x2","242");l.setAttribute("y1",v);l.setAttribute("y2",v);ledger.appendChild(l)})}
function next(){currentClef=pickClef();let[a,b]=limits(currentClef),n;do{n=a+Math.floor(Math.random()*(b-a+1))}while(`${currentClef}-${n}`===last&&b>a);last=`${currentClef}-${n}`;current=fromIdx(n);let bottom=currentClef==="treble"?idx("E",4):idx("G",2),y=120-(n-bottom)*10;note.setAttribute("cy",y);note.setAttribute("transform",`rotate(-18 220 ${y})`);let up=y>=80;stem.setAttribute("x1",up?"231":"209");stem.setAttribute("x2",up?"231":"209");stem.setAttribute("y1",y);stem.setAttribute("y2",up?y-43:y+43);drawLedger(y);symbol.textContent=currentClef==="treble"?"𝄞":"𝄢";symbol.setAttribute("font-size",currentClef==="treble"?"74":"60");symbol.setAttribute("y",currentClef==="treble"?"112":"100");label.textContent=currentClef==="treble"?"高音谱号":"低音谱号";feedback.textContent="看到就按";feedback.style.color="";shownAt=performance.now();locked=false}
function stats(){ $("correct").textContent=correct;$("wrong").textContent=wrong;$("streak").textContent=streak;if(!times.length){$("avg").textContent="—";return}let r=times.slice(-10),a=r.reduce((x,y)=>x+y,0)/r.length;$("avg").textContent=a<1000?Math.round(a)+" ms":(a/1000).toFixed(2)+" s"}
function answer(l){if(locked||!current)return;locked=true;let t=performance.now()-shownAt;if(l===current.letter){correct++;streak++;times.push(t);feedback.textContent=`✓ ${current.letter} · ${Math.round(t)} ms`;feedback.style.color="var(--good)";stats();setTimeout(next,220)}else{wrong++;streak=0;feedback.textContent=`✗ 这是 ${current.letter}`;feedback.style.color="var(--bad)";stats();setTimeout(next,650)}}
document.querySelectorAll("[data-note]").forEach(b=>b.addEventListener("click",()=>answer(b.dataset.note)));
root.addEventListener("keydown",e=>{if(["INPUT","SELECT","TEXTAREA"].includes(e.target.tagName))return;let k=e.key.toUpperCase();if(letters.includes(k)){e.preventDefault();answer(k)}});
function restart(){correct=wrong=streak=0;times=[];last="";stats();next()}
$("reset").addEventListener("click",restart);clef.addEventListener("change",restart);range.addEventListener("change",restart);
function net(){ $("onlinePill").textContent=navigator.onLine?"在线 · 离线已缓存":"离线模式" } addEventListener("online",net);addEventListener("offline",net);net();
if("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"}).then(r=>navigator.onLine&&r.update()).catch(()=>{});
restart();
})();