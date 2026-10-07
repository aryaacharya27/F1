const DATA_URL="./data/f1-data.json";
const COLORS={"Mercedes":"#00D2BE","Ferrari":"#FF2800","McLaren":"#FF8700","Red Bull Racing":"#3671C6","Racing Bulls":"#6692FF","Alpine":"#0090FF","Aston Martin":"#229971","Williams":"#64C4FF","Haas F1 Team":"#B6BABD","Audi":"#DD0000","Cadillac":"#C8A96B"};
const $=s=>document.querySelector(s);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
async function boot(){
 try{
  const r=await fetch(DATA_URL+"?v="+Date.now()); if(!r.ok)throw Error("data");
  const d=await r.json(); const s=d.standings||[], n=d.news||[];
  if(s[0]){$("#leaderPos").textContent=String(s[0].position).padStart(2,"0");$("#leaderName").textContent=s[0].driver;$("#leaderTeam").textContent=`${s[0].team} · ${s[0].nationality}`;$("#leaderPoints").textContent=s[0].points+" PTS";}
  $("#updated").textContent=d.updated_at?new Date(d.updated_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short"}):"—";
  $("#standings").innerHTML=s.map(x=>`<div class="row"><div class="pos">${String(x.position).padStart(2,"0")}</div><div class="stripe" style="background:${COLORS[x.team]||"#fff"}"></div><div><div class="driver">${esc(x.driver)}</div><div class="team">${esc(x.team)} · ${esc(x.nationality)}</div></div><div class="pts">${x.points}<small>PTS</small></div></div>`).join("");
  $("#news").innerHTML=n.slice(0,5).map(x=>`<a class="card glass" href="${esc(x.url)}" target="_blank" rel="noopener"><img src="${esc(x.image||"")}" onerror="this.style.display='none'" alt=""><div class="cardContent"><div class="source">${esc(x.source||"F1 NEWS")}</div><div class="title">${esc(x.title)}</div><div class="date">${x.published_at?new Date(x.published_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):""}</div></div></a>`).join("");
 }catch(e){$("#standings").innerHTML='<div class="loading">Data unavailable. Run the backend updater first.</div>';$("#news").innerHTML='<div class="loading glass">News unavailable.</div>'}
}
boot();


// Auto-refresh the dashboard so an open page picks up newly published data.
// The updater runs every 15 minutes; this checks the JSON every 5 minutes.
const AUTO_REFRESH_MS = 5 * 60 * 1000;
setInterval(() => boot(), AUTO_REFRESH_MS);
