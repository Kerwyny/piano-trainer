(() => {
const letters=["C","D","E","F","G","A","B"], li={C:0,D:1,E:2,F:3,G:4,A:5,B:6}, semitone={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
const idx=(l,o)=>o*7+li[l], fromIdx=n=>({letter:letters[((n%7)+7)%7],octave:Math.floor(n/7)}), midiFor=(l,o)=>12*(o+1)+semitone[l];
const midiName=n=>{const names=["C","C♯","D","D♯","E","F","F♯","G","G♯","A","A♯","B"];return `${names[((n%12)+12)%12]}${Math.floor(n/12)-1}`};
const $=id=>document.getElementById(id), root=$("app"), clef=$("clef"), range=$("range"), label=$("clefLabel"), symbol=$("clefSymbol"), note=$("note"), stem=$("stem"), ledger=$("ledger"), feedback=$("feedback"), onlinePill=$("onlinePill");
let current,currentMidi=null,currentClef,shownAt,correct=0,wrong=0,streak=0,times=[],locked=false,last="",midiStatus="";
function limits(c){if(range.value==="basic")return c==="treble"?[idx("E",4),idx("F",5)]:[idx("G",2),idx("A",3)];return c==="treble"?[idx("C",4),idx("C",6)]:[idx("E",2),idx("E",4)]}
function pickClef(){return clef.value==="both"?(Math.random()<.5?"treble":"bass"):clef.value}
function drawLedger(y){ledger.replaceChildren();let ys=[];if(y>=140)for(let v=140;v<=y+1;v+=20)ys.push(v);else if(y<=20)for(let v=20;v>=y-1;v-=20)ys.push(v);ys.forEach(v=>{let l=document.createElementNS("http://www.w3.org/2000/svg","line");l.setAttribute("x1","198");l.setAttribute("x2","242");l.setAttribute("y1",v);l.setAttribute("y2",v);ledger.appendChild(l)})}
function next(){currentClef=pickClef();let[a,b]=limits(currentClef),n;do{n=a+Math.floor(Math.random()*(b-a+1))}while(`${currentClef}-${n}`===last&&b>a);last=`${currentClef}-${n}`;current=fromIdx(n);currentMidi=midiFor(current.letter,current.octave);let bottom=currentClef==="treble"?idx("E",4):idx("G",2),y=120-(n-bottom)*10;note.setAttribute("cy",y);note.setAttribute("transform",`rotate(-18 220 ${y})`);let up=y>=80;stem.setAttribute("x1",up?"231":"209");stem.setAttribute("x2",up?"231":"209");stem.setAttribute("y1",y);stem.setAttribute("y2",up?y-43:y+43);drawLedger(y);symbol.textContent=currentClef==="treble"?"𝄞":"𝄢";symbol.setAttribute("font-size",currentClef==="treble"?"74":"60");symbol.setAttribute("y",currentClef==="treble"?"112":"100");label.textContent=currentClef==="treble"?"高音谱号":"低音谱号";feedback.textContent="看到就按";feedback.style.color="";shownAt=performance.now();locked=false}
function stats(){ $("correct").textContent=correct;$("wrong").textContent=wrong;$("streak").textContent=streak;if(!times.length){$("avg").textContent="—";return}let r=times.slice(-10),a=r.reduce((x,y)=>x+y,0)/r.length;$("avg").textContent=a<1000?Math.round(a)+" ms":(a/1000).toFixed(2)+" s"}
function markCorrect(elapsed){correct++;streak++;times.push(elapsed);feedback.textContent=`✓ ${current.letter}${current.octave} · ${Math.round(elapsed)} ms`;feedback.style.color="var(--good)";stats();setTimeout(next,220)}
function markWrong(message){wrong++;streak=0;feedback.textContent=message;feedback.style.color="var(--bad)";stats();setTimeout(next,650)}
function answer(l){if(locked||!current)return;locked=true;let t=performance.now()-shownAt;if(l===current.letter)markCorrect(t);else markWrong(`✗ 这是 ${current.letter}`)}
function answerMidi(noteNumber,velocity=127){const n=Number(noteNumber),v=Number(velocity);if(!Number.isInteger(n)||n<0||n>127||!Number.isFinite(v)||v<=0||locked||!current)return;locked=true;let t=performance.now()-shownAt;if(n===currentMidi)markCorrect(t);else markWrong(`✗ 你弹了 ${midiName(n)}；目标是 ${current.letter}${current.octave}`)}
document.querySelectorAll("[data-note]").forEach(b=>b.addEventListener("click",()=>answer(b.dataset.note)));
root.addEventListener("keydown",e=>{if(["INPUT","SELECT","TEXTAREA"].includes(e.target.tagName))return;let k=e.key.toUpperCase();if(letters.includes(k)){e.preventDefault();answer(k)}});
function restart(){correct=wrong=streak=0;times=[];last="";stats();next()}
$("reset").addEventListener("click",restart);clef.addEventListener("change",restart);range.addEventListener("change",restart);
function net(){onlinePill.textContent=midiStatus||(navigator.onLine?"在线 · 离线已缓存":"离线模式")} addEventListener("online",net);addEventListener("offline",net);net();
window.pianoTrainer=Object.freeze({receiveMIDINote:(noteNumber,velocity=127)=>answerMidi(noteNumber,velocity),getTargetMIDINote:()=>currentMidi,setMIDIStatus:text=>{midiStatus=String(text||"");net()}});
if("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"}).then(r=>navigator.onLine&&r.update()).catch(()=>{});
restart();
})();