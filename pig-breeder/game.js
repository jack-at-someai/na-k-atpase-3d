(function() {
"use strict";

// === Constants ===
const BREEDS = [
  "Berkshire","Chester White","Duroc","Hampshire","Hereford","Landrace",
  "Large Black","Mangalitsa","Meishan","Pietrain","Poland China",
  "Spotted","Tamworth","Yorkshire"
];
const SHOW_CLASSES = [
  "Market Gilt","Market Barrow","Breeding Gilt","Junior Boar","Senior Boar",
  "Junior Sow","Senior Sow","Pair","Pen of Three","Champion Drive",
  "Showmanship Junior","Showmanship Senior","Supreme Champion","People's Choice"
];
const AVATARS = ["🐷","🐖","🐽","🐗","🐾","🏆","⭐","💎","🎀","🌾","🔱","👑"];
const GESTATION_DAYS = 114;
const PLACING_REP = {0:100,1:50,2:35,3:25,4:18,5:14,6:11,7:9,8:6,9:4,10:2};
const ACHIEVEMENT_DEFS = [
  {id:"first_pig",      name:"First Pig",         icon:"🐷", desc:"Add your first pig to the herd"},
  {id:"growing_herd",   name:"Growing Herd",      icon:"🐖", desc:"Have 10 pigs in the herd"},
  {id:"matchmaker",     name:"Matchmaker",        icon:"💕", desc:"Create your first breeding"},
  {id:"proud_breeder",  name:"Proud Breeder",     icon:"🍼", desc:"Record your first litter"},
  {id:"100_piglets",    name:"100 Piglets",       icon:"💯", desc:"Born 100 piglets total"},
  {id:"show_debut",     name:"Show Ring Debut",   icon:"🎪", desc:"Enter your first show"},
  {id:"first_champ",    name:"First Champion",    icon:"🏆", desc:"Win Champion placing at a show"},
  {id:"grand_sire",     name:"Grand Champion Sire",icon:"👑",desc:"A sire with 3+ champion offspring"},
  {id:"rising_star",    name:"Rising Star",       icon:"⭐", desc:"Reach 500 reputation"},
  {id:"champ_breeder",  name:"Champion Breeder",  icon:"🌟", desc:"Reach 2000 reputation"},
  {id:"show_veteran",   name:"Show Circuit Veteran",icon:"🎖️",desc:"Record 10 shows"},
  {id:"full_house",     name:"Full House",        icon:"🏠", desc:"A litter with 12+ born alive"}
];

// === State ===
let state;
const DEFAULT_STATE = () => ({
  pigs:[], breedings:[], litters:[], shows:[],
  reputation:0, achievements:[], activeTab:"dashboard"
});

function load() {
  try {
    const raw = localStorage.getItem("pigbreeder-state");
    state = raw ? JSON.parse(raw) : DEFAULT_STATE();
  } catch(e) { state = DEFAULT_STATE(); }
  // Patch missing fields
  if(!state.pigs) state.pigs=[];
  if(!state.breedings) state.breedings=[];
  if(!state.litters) state.litters=[];
  if(!state.shows) state.shows=[];
  if(state.reputation==null) state.reputation=0;
  if(!state.achievements) state.achievements=[];
  if(!state.activeTab) state.activeTab="dashboard";
}
function save() {
  localStorage.setItem("pigbreeder-state", JSON.stringify(state));
}

// === Helpers ===
function uuid() {
  if(crypto.randomUUID) return crypto.randomUUID();
  return 'xxxx-xxxx-xxxx'.replace(/x/g,()=>(Math.random()*16|0).toString(16));
}
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if(cls) e.className = cls;
  if(text!=null) e.textContent = text;
  return e;
}
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }
function fmtDate(d) {
  if(!d) return "—";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
}
function daysBetween(a,b) {
  return Math.round((new Date(b)-new Date(a))/(1000*60*60*24));
}
function ageText(dob) {
  if(!dob) return "";
  const days = daysBetween(dob, new Date().toISOString().slice(0,10));
  if(days<0) return "";
  if(days<60) return days+"d";
  const mo = Math.floor(days/30.44);
  if(mo<24) return mo+"mo";
  return (mo/12|0)+"yr "+(mo%12)+"mo";
}
function pigById(id) { return state.pigs.find(p=>p.id===id); }
function activePigs() { return state.pigs.filter(p=>p.active!==false); }
function activeSires() { return activePigs().filter(p=>p.type==="sire"); }
function activeSows() { return activePigs().filter(p=>p.type==="sow"); }

function addRep(pts) {
  state.reputation += pts;
  save();
  updateRepDisplay();
  checkAchievements();
}
function updateRepDisplay() {
  $("#rep-count").textContent = state.reputation;
}

// === Toast ===
function showToast(msg) {
  const t = el("div","toast",msg);
  $("#toast-container").appendChild(t);
  setTimeout(()=>t.remove(), 3100);
}

// === Achievements ===
function grantAchievement(id) {
  if(state.achievements.includes(id)) return;
  state.achievements.push(id);
  save();
  const def = ACHIEVEMENT_DEFS.find(a=>a.id===id);
  if(def) showToast(`🏅 Achievement Unlocked: ${def.name}!`);
}
function checkAchievements() {
  const ap = activePigs();
  if(state.pigs.length>=1) grantAchievement("first_pig");
  if(ap.length>=10) grantAchievement("growing_herd");
  if(state.breedings.length>=1) grantAchievement("matchmaker");
  if(state.litters.length>=1) grantAchievement("proud_breeder");
  const totalPiglets = state.litters.reduce((s,l)=>s+(l.bornAlive||0),0);
  if(totalPiglets>=100) grantAchievement("100_piglets");
  if(state.shows.length>=1) grantAchievement("show_debut");
  if(state.shows.some(s=>s.placing===0)) grantAchievement("first_champ");
  // Grand Champion Sire: a sire with 3+ champion piglet shows
  const sireChamps = {};
  state.shows.filter(s=>s.placing===0).forEach(s=>{
    const pig = pigById(s.pigId);
    if(pig && pig.sireId) sireChamps[pig.sireId] = (sireChamps[pig.sireId]||0)+1;
  });
  if(Object.values(sireChamps).some(c=>c>=3)) grantAchievement("grand_sire");
  if(state.reputation>=500) grantAchievement("rising_star");
  if(state.reputation>=2000) grantAchievement("champ_breeder");
  if(state.shows.length>=10) grantAchievement("show_veteran");
  if(state.litters.some(l=>(l.bornAlive||0)>=12)) grantAchievement("full_house");
}

// === Tab Switching ===
function switchTab(name) {
  state.activeTab = name;
  save();
  $$(".tab").forEach(t=>t.classList.toggle("active", t.dataset.tab===name));
  $$(".panel").forEach(p=>p.classList.toggle("active", p.id==="panel-"+name));
  const renderers = {
    dashboard:renderDashboard, herd:renderHerd, breeding:renderBreeding,
    litters:renderLitters, shows:renderShows, pedigree:renderPedigree
  };
  if(renderers[name]) renderers[name]();
}

// === Modal System ===
function openModal(title, fields, data, onSave, onDelete) {
  $("#modal-title").textContent = title;
  const body = $("#modal-body");
  const footer = $("#modal-footer");
  body.innerHTML = "";
  footer.innerHTML = "";

  const inputs = {};
  fields.forEach(f => {
    const grp = el("div","form-group");
    const lbl = el("label","",f.label);
    grp.appendChild(lbl);

    if(f.type==="avatar-picker") {
      const wrap = el("div","avatar-picker");
      AVATARS.forEach((av,i) => {
        const opt = el("span","avatar-opt",av);
        opt.dataset.idx = i;
        if((data[f.key]??0)===i) opt.classList.add("selected");
        opt.onclick = () => {
          wrap.querySelectorAll(".avatar-opt").forEach(o=>o.classList.remove("selected"));
          opt.classList.add("selected");
        };
        wrap.appendChild(opt);
      });
      grp.appendChild(wrap);
      inputs[f.key] = { type:"avatar-picker", el:wrap };
    } else if(f.type==="select") {
      const sel = document.createElement("select");
      (f.options||[]).forEach(o => {
        const opt = document.createElement("option");
        opt.value = o.value; opt.textContent = o.label;
        sel.appendChild(opt);
      });
      sel.value = data[f.key]||"";
      grp.appendChild(sel);
      inputs[f.key] = { type:"select", el:sel };
    } else if(f.type==="textarea") {
      const ta = document.createElement("textarea");
      ta.value = data[f.key]||"";
      ta.rows = 3;
      grp.appendChild(ta);
      inputs[f.key] = { type:"textarea", el:ta };
    } else {
      const inp = document.createElement("input");
      inp.type = f.type||"text";
      inp.value = data[f.key]??"";
      if(f.step) inp.step = f.step;
      if(f.min!=null) inp.min = f.min;
      grp.appendChild(inp);
      inputs[f.key] = { type:"input", el:inp };
    }
    body.appendChild(grp);
  });

  const saveBtn = el("button","btn btn-primary","Save");
  saveBtn.onclick = () => {
    const result = {};
    for(const [key,inp] of Object.entries(inputs)) {
      if(inp.type==="avatar-picker") {
        const sel = inp.el.querySelector(".selected");
        result[key] = sel ? parseInt(sel.dataset.idx) : 0;
      } else {
        result[key] = inp.el.value;
      }
    }
    onSave(result);
    closeModal();
  };
  footer.appendChild(saveBtn);

  if(onDelete) {
    const delBtn = el("button","btn btn-danger","Delete");
    delBtn.onclick = () => { onDelete(); closeModal(); };
    footer.appendChild(delBtn);
  }

  const cancelBtn = el("button","btn btn-ghost","Cancel");
  cancelBtn.onclick = closeModal;
  footer.appendChild(cancelBtn);

  $("#modal-overlay").classList.remove("hidden");
}
function closeModal() {
  $("#modal-overlay").classList.add("hidden");
}

// === Dashboard ===
function renderDashboard() {
  const panel = $("#panel-dashboard");
  panel.innerHTML = "";

  // Stat cards
  const ap = activePigs();
  const gestating = state.breedings.filter(b=>b.status==="gestating");
  const totalPiglets = state.litters.reduce((s,l)=>s+(l.bornAlive||0),0);

  const row = el("div","card-row");
  [{v:ap.length,l:"Total Herd"},{v:gestating.length,l:"Active Breedings"},
   {v:totalPiglets,l:"Total Piglets"},{v:state.reputation,l:"Reputation ⭐"}
  ].forEach(s => {
    const c = el("div","stat-card");
    c.appendChild(el("div","stat-val",s.v));
    c.appendChild(el("div","stat-label",s.l));
    row.appendChild(c);
  });
  panel.appendChild(row);

  // Pig Pen
  panel.appendChild(el("div","section-title","🐷 Pig Pen"));
  const pen = el("div","pig-pen");
  if(ap.length===0) {
    pen.appendChild(el("div","",`No pigs yet — go to the Herd tab to add some!`));
    pen.style.color = "var(--muted)";
    pen.style.padding = "16px";
  }
  ap.forEach(p => {
    const item = el("div","pig-pen-item "+(p.type||"sow"));
    item.appendChild(el("span","pig-emoji",AVATARS[p.avatar||0]));
    item.appendChild(el("span","pig-name",p.name));
    item.onclick = () => { switchTab("herd"); setTimeout(()=>openPigModal(p),100); };
    pen.appendChild(item);
  });
  panel.appendChild(pen);

  // Upcoming Due Dates
  if(gestating.length>0) {
    panel.appendChild(el("div","section-title","📅 Upcoming Due Dates"));
    const sorted = [...gestating].sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate));
    sorted.forEach(b => {
      const sire = pigById(b.sireId);
      const sow = pigById(b.sowId);
      const daysLeft = daysBetween(new Date().toISOString().slice(0,10), b.dueDate);
      const c = el("div","card");
      const urgency = daysLeft<=7?"due-soon":daysLeft<=30?"due-mid":"due-far";
      c.innerHTML = `<strong>${sire?sire.name:"??"} × ${sow?sow.name:"??"}</strong>
        — Due: <span class="${urgency}">${fmtDate(b.dueDate)} (${daysLeft>0?daysLeft+'d away':'Overdue!'})</span>`;
      panel.appendChild(c);
    });
  }

  // Recent Litters
  if(state.litters.length>0) {
    panel.appendChild(el("div","section-title","🍼 Recent Litters"));
    const recent = [...state.litters].sort((a,b)=>new Date(b.birthDate)-new Date(a.birthDate)).slice(0,5);
    recent.forEach(l => {
      const sire = pigById(l.sireId);
      const sow = pigById(l.sowId);
      const c = el("div","card");
      c.innerHTML = `${fmtDate(l.birthDate)} — <strong>${sire?sire.name:"??"} × ${sow?sow.name:"??"}</strong>
        — ${l.bornAlive||0} alive, ${l.stillborn||0} stillborn`;
      panel.appendChild(c);
    });
  }

  // Achievements
  panel.appendChild(el("div","section-title","🏅 Achievements"));
  const achGrid = el("div","ach-grid");
  ACHIEVEMENT_DEFS.forEach(a => {
    const earned = state.achievements.includes(a.id);
    const badge = el("div","ach-badge"+(earned?" earned":""));
    badge.appendChild(el("span","ach-icon",a.icon));
    badge.appendChild(document.createTextNode(a.name));
    badge.title = a.desc;
    achGrid.appendChild(badge);
  });
  panel.appendChild(achGrid);
}

// === Herd ===
function renderHerd() {
  const panel = $("#panel-herd");
  panel.innerHTML = "";

  // Filter bar
  const bar = el("div","filter-bar");
  const filterSel = document.createElement("select");
  filterSel.innerHTML = `<option value="all">All</option><option value="sire">Sires</option><option value="sow">Sows</option>`;
  bar.appendChild(filterSel);
  const searchInp = document.createElement("input");
  searchInp.type="text"; searchInp.placeholder="Search name…";
  bar.appendChild(searchInp);
  bar.appendChild(el("div","spacer"));
  const addBtn = el("button","btn btn-primary","+ Add Pig");
  addBtn.onclick = () => openPigModal(null);
  bar.appendChild(addBtn);
  panel.appendChild(bar);

  const listEl = el("div","");
  panel.appendChild(listEl);

  function renderList() {
    listEl.innerHTML = "";
    let pigs = activePigs();
    if(filterSel.value!=="all") pigs = pigs.filter(p=>p.type===filterSel.value);
    const q = searchInp.value.toLowerCase();
    if(q) pigs = pigs.filter(p=>p.name.toLowerCase().includes(q));

    if(pigs.length===0) {
      listEl.appendChild(el("div","card","No pigs found."));
      return;
    }
    pigs.forEach(p => {
      const c = el("div","card pig-card");
      c.appendChild(el("div","pig-avatar",AVATARS[p.avatar||0]));
      const info = el("div","pig-info");
      info.appendChild(el("h3","",p.name));
      const showCount = state.shows.filter(s=>s.pigId===p.id).length;
      const litterCount = state.litters.filter(l=>l.sireId===p.id||l.sowId===p.id).length;
      info.appendChild(el("div","pig-meta",
        `${p.breed||"Unknown breed"} · ${ageText(p.dob)||"Age ?"} · ${p.weight?p.weight+"lb":"—"} · ${p.color||""} · Reg: ${p.registrationNum||"—"} · ${showCount} shows · ${litterCount} litters`
      ));
      c.appendChild(info);
      const badge = el("span","pig-badge "+(p.type==="sire"?"sire-badge":"sow-badge"),p.type==="sire"?"♂ Sire":"♀ Sow");
      c.appendChild(badge);
      c.onclick = () => openPigModal(p);
      listEl.appendChild(c);
    });
  }
  filterSel.onchange = renderList;
  searchInp.oninput = renderList;
  renderList();
}

function pigFields(data) {
  return [
    {key:"name",label:"Name",type:"text"},
    {key:"type",label:"Type",type:"select",options:[{value:"sire",label:"♂ Sire"},{value:"sow",label:"♀ Sow"}]},
    {key:"breed",label:"Breed",type:"select",options:BREEDS.map(b=>({value:b,label:b}))},
    {key:"dob",label:"Date of Birth",type:"date"},
    {key:"weight",label:"Weight (lb)",type:"number",min:0,step:"0.1"},
    {key:"color",label:"Color / Markings",type:"text"},
    {key:"registrationNum",label:"Registration #",type:"text"},
    {key:"sireId",label:"Sire (Father)",type:"select",options:[{value:"",label:"— Unknown —"},...state.pigs.filter(p=>p.type==="sire"&&p.id!==(data&&data.id)).map(p=>({value:p.id,label:p.name}))]},
    {key:"damId",label:"Dam (Mother)",type:"select",options:[{value:"",label:"— Unknown —"},...state.pigs.filter(p=>p.type==="sow"&&p.id!==(data&&data.id)).map(p=>({value:p.id,label:p.name}))]},
    {key:"avatar",label:"Avatar",type:"avatar-picker"},
    {key:"notes",label:"Notes",type:"textarea"}
  ];
}

function openPigModal(pig) {
  const isEdit = !!pig;
  const data = pig ? {...pig} : {name:"",type:"sow",breed:BREEDS[0],dob:"",weight:"",color:"",registrationNum:"",sireId:"",damId:"",avatar:0,notes:""};

  openModal(
    isEdit ? "Edit Pig" : "Add Pig",
    pigFields(data),
    data,
    (result) => {
      if(!result.name.trim()) return;
      if(isEdit) {
        Object.assign(pig, result);
        if(result.weight) pig.weight = parseFloat(result.weight);
      } else {
        state.pigs.push({
          id:uuid(), ...result, weight:result.weight?parseFloat(result.weight):"", active:true
        });
      }
      save();
      checkAchievements();
      switchTab(state.activeTab);
    },
    isEdit ? () => {
      pig.active = false;
      save();
      switchTab(state.activeTab);
    } : null
  );
}

// === Breeding ===
function renderBreeding() {
  const panel = $("#panel-breeding");
  panel.innerHTML = "";

  // Pair builder
  panel.appendChild(el("div","section-title","💕 Pair Builder"));
  const builder = el("div","card");
  const grid = el("div","pair-builder");

  // Sire selector
  const sireGrp = el("div","");
  sireGrp.appendChild(el("label","","Sire"));
  const sireSel = document.createElement("select");
  sireSel.innerHTML = `<option value="">— Select Sire —</option>` +
    activeSires().map(p=>`<option value="${p.id}">${p.name} (${p.breed})</option>`).join("");
  sireGrp.appendChild(sireSel);
  grid.appendChild(sireGrp);

  grid.appendChild(el("div","pair-x","×"));

  // Sow selector
  const sowGrp = el("div","");
  sowGrp.appendChild(el("label","","Sow"));
  const sowSel = document.createElement("select");
  sowSel.innerHTML = `<option value="">— Select Sow —</option>` +
    activeSows().map(p=>`<option value="${p.id}">${p.name} (${p.breed})</option>`).join("");
  sowGrp.appendChild(sowSel);
  grid.appendChild(sowGrp);

  builder.appendChild(grid);

  // Date + due
  const dateRow = el("div","pair-builder");
  const dateGrp = el("div","");
  dateGrp.appendChild(el("label","","Breed Date"));
  const dateInp = document.createElement("input");
  dateInp.type="date"; dateInp.value = new Date().toISOString().slice(0,10);
  dateGrp.appendChild(dateInp);
  dateRow.appendChild(dateGrp);
  dateRow.appendChild(el("div","pair-x","→"));
  const dueGrp = el("div","");
  dueGrp.appendChild(el("label","","Due Date (auto)"));
  const dueDisp = el("div","","—");
  dueDisp.style.cssText = "padding:8px 10px;font-weight:600;color:var(--cyan)";
  dueGrp.appendChild(dueDisp);
  dateRow.appendChild(dueGrp);
  builder.appendChild(dateRow);

  function updateDue() {
    const d = new Date(dateInp.value);
    if(!isNaN(d)) {
      d.setDate(d.getDate()+GESTATION_DAYS);
      dueDisp.textContent = fmtDate(d.toISOString().slice(0,10));
    }
  }
  dateInp.onchange = updateDue;
  updateDue();

  // Compat box
  const compat = el("div","compat-box");
  compat.innerHTML = "Select a sire and sow to see compatibility.";
  builder.appendChild(compat);

  function updateCompat() {
    const sire = pigById(sireSel.value);
    const sow = pigById(sowSel.value);
    if(!sire||!sow) { compat.innerHTML="Select a sire and sow to see compatibility."; return; }
    let stars = 3;
    let notes = [];
    // Inbreeding check
    if(sire.sireId && sow.sireId && sire.sireId===sow.sireId) {
      notes.push("⚠️ Share the same sire — inbreeding risk!");
      stars = 1;
    }
    if(sire.damId && sow.damId && sire.damId===sow.damId) {
      notes.push("⚠️ Share the same dam — inbreeding risk!");
      stars = 1;
    }
    if(sire.sireId===sow.id || sire.damId===sow.id || sow.sireId===sire.id || sow.damId===sire.id) {
      notes.push("🚫 Parent-offspring match — high inbreeding risk!");
      stars = 0;
    }
    // Breed match
    if(sire.breed===sow.breed) {
      notes.push(`✅ Same breed (${sire.breed}) — purebred litter`);
      stars = Math.min(stars+1,5);
    } else {
      notes.push(`🔀 Crossbreed: ${sire.breed} × ${sow.breed}`);
    }
    // Show winner bonus
    const sireShows = state.shows.filter(s=>s.pigId===sire.id);
    const sowShows = state.shows.filter(s=>s.pigId===sow.id);
    if(sireShows.some(s=>s.placing===0) || sowShows.some(s=>s.placing===0)) {
      notes.push("🏆 Champion parent — great genetics!");
      stars = Math.min(stars+1,5);
    }
    if(sireShows.length>0||sowShows.length>0) {
      notes.push(`📊 Combined show record: ${sireShows.length+sowShows.length} entries`);
      stars = Math.min(stars+1,5);
    }
    compat.innerHTML = `<div class="compat-stars">${"★".repeat(Math.max(stars,0))}${"☆".repeat(Math.max(5-stars,0))}</div>`
      + notes.join("<br>");
  }
  sireSel.onchange = updateCompat;
  sowSel.onchange = updateCompat;

  // Create button
  const createBtn = el("button","btn btn-primary","Create Breeding");
  createBtn.onclick = () => {
    if(!sireSel.value||!sowSel.value) return;
    const d = new Date(dateInp.value);
    const due = new Date(d); due.setDate(due.getDate()+GESTATION_DAYS);
    state.breedings.push({
      id:uuid(), sireId:sireSel.value, sowId:sowSel.value,
      breedDate:dateInp.value, dueDate:due.toISOString().slice(0,10),
      status:"gestating", litterId:null, notes:""
    });
    save();
    checkAchievements();
    renderBreeding();
  };
  builder.appendChild(createBtn);
  panel.appendChild(builder);

  // Active breedings
  const gestating = state.breedings.filter(b=>b.status==="gestating");
  if(gestating.length>0) {
    panel.appendChild(el("div","section-title","🐖 Active Breedings"));
    gestating.forEach(b => renderBreedingCard(panel, b, true));
  }

  // Past breedings
  const past = state.breedings.filter(b=>b.status!=="gestating");
  if(past.length>0) {
    const hdr = el("div","section-title collapse-toggle","📋 Past Breedings");
    const wrap = el("div","");
    wrap.style.display="none";
    hdr.onclick = () => {
      hdr.classList.toggle("open");
      wrap.style.display = wrap.style.display==="none"?"block":"none";
    };
    panel.appendChild(hdr);
    past.forEach(b => renderBreedingCard(wrap, b, false));
    panel.appendChild(wrap);
  }
}

function renderBreedingCard(parent, b, active) {
  const c = el("div","card breeding-card");
  const sire = pigById(b.sireId);
  const sow = pigById(b.sowId);
  c.appendChild(el("div","breed-pair",`${sire?sire.name:"??"} × ${sow?sow.name:"??"}`));

  if(active) {
    const today = new Date().toISOString().slice(0,10);
    const elapsed = daysBetween(b.breedDate, today);
    const pct = Math.min(100, Math.max(0, (elapsed/GESTATION_DAYS)*100));
    const barWrap = el("div","breed-bar-wrap");
    const bar = el("div","breed-bar");
    bar.style.width = pct+"%";
    const barLabel = el("div","breed-bar-label",`${elapsed}/${GESTATION_DAYS}d`);
    barWrap.appendChild(bar);
    barWrap.appendChild(barLabel);
    c.appendChild(barWrap);

    const daysLeft = daysBetween(today, b.dueDate);
    const urgency = daysLeft<=7?"due-soon":daysLeft<=30?"due-mid":"due-far";
    c.appendChild(el("div","breed-due "+(urgency),`Due ${fmtDate(b.dueDate)}`));

    const actions = el("div","breed-actions");
    const birthBtn = el("button","btn btn-sm btn-primary","🍼 Record Birth");
    birthBtn.onclick = (e) => { e.stopPropagation(); openLitterModal(b); };
    actions.appendChild(birthBtn);
    const failBtn = el("button","btn btn-sm btn-danger","✗ Failed");
    failBtn.onclick = (e) => { e.stopPropagation(); b.status="failed"; save(); renderBreeding(); };
    actions.appendChild(failBtn);
    c.appendChild(actions);
  } else {
    c.appendChild(el("div","breed-due",`${b.status==="delivered"?"✅ Delivered":"❌ Failed"} — Bred ${fmtDate(b.breedDate)}`));
  }
  parent.appendChild(c);
}

// === Litters ===
function openLitterModal(breeding) {
  const fields = [
    {key:"birthDate",label:"Birth Date",type:"date"},
    {key:"bornAlive",label:"Born Alive",type:"number",min:0},
    {key:"stillborn",label:"Stillborn",type:"number",min:0},
    {key:"notes",label:"Notes",type:"textarea"}
  ];
  const data = {birthDate:new Date().toISOString().slice(0,10), bornAlive:"", stillborn:"0", notes:""};

  openModal("Record Litter", fields, data, (result) => {
    const bornAlive = parseInt(result.bornAlive)||0;
    const stillborn = parseInt(result.stillborn)||0;
    const piglets = [];
    for(let i=0; i<bornAlive; i++) {
      piglets.push({id:uuid(), name:`Piglet ${i+1}`, sex:i%2===0?"gilt":"boar", birthWeight:"", color:"", promotedToPigId:null});
    }
    const litter = {
      id:uuid(), breedingId:breeding.id, sireId:breeding.sireId, sowId:breeding.sowId,
      birthDate:result.birthDate, bornAlive, stillborn, weanDate:null,
      piglets, notes:result.notes
    };
    state.litters.push(litter);
    breeding.status = "delivered";
    breeding.litterId = litter.id;
    // Rep for litter
    addRep(10 + 2*bornAlive);
    save();
    checkAchievements();
    switchTab(state.activeTab);
  });
}

function renderLitters() {
  const panel = $("#panel-litters");
  panel.innerHTML = "";
  panel.appendChild(el("div","section-title","🍼 Litters"));

  if(state.litters.length===0) {
    panel.appendChild(el("div","card","No litters recorded yet. Create a breeding and record a birth!"));
    return;
  }

  const sorted = [...state.litters].sort((a,b)=>new Date(b.birthDate)-new Date(a.birthDate));
  sorted.forEach(l => {
    const c = el("div","card litter-card");
    const sire = pigById(l.sireId);
    const sow = pigById(l.sowId);

    // Header
    const hdr = el("div","litter-header");
    const h3 = el("h3","",`${sire?sire.name:"??"} × ${sow?sow.name:"??"}`);
    hdr.appendChild(h3);
    const stats = el("div","litter-stats",
      `${fmtDate(l.birthDate)} · ${l.bornAlive} alive · ${l.stillborn||0} stillborn${l.weanDate?" · Weaned "+fmtDate(l.weanDate):""}`
    );
    hdr.appendChild(stats);
    c.appendChild(hdr);

    // Piglet list (expandable)
    const pigletDiv = el("div","piglet-list");
    pigletDiv.style.display="none";
    hdr.style.cursor="pointer";
    hdr.onclick = () => {
      pigletDiv.style.display = pigletDiv.style.display==="none"?"block":"none";
    };

    if(l.piglets && l.piglets.length>0) {
      l.piglets.forEach(pl => {
        const row = el("div","piglet-row");
        row.appendChild(el("span","piglet-sex",pl.sex==="boar"?"♂":"♀"));
        const info = el("div","piglet-info");
        info.textContent = `${pl.name}${pl.birthWeight?" · "+pl.birthWeight+"lb":""}${pl.color?" · "+pl.color:""}`;
        row.appendChild(info);

        if(pl.promotedToPigId) {
          row.appendChild(el("span","piglet-promoted","✅ In Herd"));
        } else {
          const promBtn = el("button","btn btn-sm btn-primary","Promote to Herd");
          promBtn.onclick = (e) => {
            e.stopPropagation();
            promotePiglet(l, pl);
          };
          row.appendChild(promBtn);
        }
        pigletDiv.appendChild(row);
      });

      // Edit piglets button
      const editBtn = el("button","btn btn-sm btn-ghost","✏️ Edit Piglets");
      editBtn.style.marginTop = "8px";
      editBtn.onclick = (e) => { e.stopPropagation(); openEditPigletsModal(l); };
      pigletDiv.appendChild(editBtn);

      // Wean button
      if(!l.weanDate) {
        const weanBtn = el("button","btn btn-sm btn-ghost","📋 Record Wean Date");
        weanBtn.style.marginTop = "4px";
        weanBtn.onclick = (e) => {
          e.stopPropagation();
          openModal("Record Wean Date",[{key:"weanDate",label:"Wean Date",type:"date"}],
            {weanDate:new Date().toISOString().slice(0,10)},
            (r)=>{ l.weanDate=r.weanDate; save(); renderLitters(); });
        };
        pigletDiv.appendChild(weanBtn);
      }
    }

    c.appendChild(pigletDiv);
    panel.appendChild(c);
  });
}

function openEditPigletsModal(litter) {
  const body = $("#modal-body");
  const footer = $("#modal-footer");
  body.innerHTML = "";
  footer.innerHTML = "";
  $("#modal-title").textContent = "Edit Piglets";

  const inputs = [];
  litter.piglets.forEach((pl,i) => {
    const row = el("div","form-group");
    row.style.cssText = "display:flex;gap:6px;align-items:end";

    const nameWrap = el("div","");
    nameWrap.style.flex = "2";
    nameWrap.appendChild(el("label","",`Piglet ${i+1} Name`));
    const nameInp = document.createElement("input");
    nameInp.value = pl.name;
    nameWrap.appendChild(nameInp);
    row.appendChild(nameWrap);

    const sexWrap = el("div","");
    sexWrap.style.flex = "1";
    sexWrap.appendChild(el("label","","Sex"));
    const sexSel = document.createElement("select");
    sexSel.innerHTML = `<option value="gilt">♀ Gilt</option><option value="boar">♂ Boar</option>`;
    sexSel.value = pl.sex;
    sexWrap.appendChild(sexSel);
    row.appendChild(sexWrap);

    const wWrap = el("div","");
    wWrap.style.flex = "1";
    wWrap.appendChild(el("label","","Weight (lb)"));
    const wInp = document.createElement("input");
    wInp.type="number"; wInp.step="0.1"; wInp.value=pl.birthWeight||"";
    wWrap.appendChild(wInp);
    row.appendChild(wWrap);

    const cWrap = el("div","");
    cWrap.style.flex = "1";
    cWrap.appendChild(el("label","","Color"));
    const cInp = document.createElement("input");
    cInp.value = pl.color||"";
    cWrap.appendChild(cInp);
    row.appendChild(cWrap);

    inputs.push({piglet:pl, nameInp, sexSel, wInp, cInp});
    body.appendChild(row);
  });

  const saveBtn = el("button","btn btn-primary","Save");
  saveBtn.onclick = () => {
    inputs.forEach(inp => {
      inp.piglet.name = inp.nameInp.value;
      inp.piglet.sex = inp.sexSel.value;
      inp.piglet.birthWeight = inp.wInp.value;
      inp.piglet.color = inp.cInp.value;
    });
    save();
    closeModal();
    renderLitters();
  };
  footer.appendChild(saveBtn);
  const cancelBtn = el("button","btn btn-ghost","Cancel");
  cancelBtn.onclick = closeModal;
  footer.appendChild(cancelBtn);
  $("#modal-overlay").classList.remove("hidden");
}

function promotePiglet(litter, piglet) {
  const newPig = {
    id:uuid(),
    name:piglet.name,
    type:piglet.sex==="boar"?"sire":"sow",
    breed: determineLitterBreed(litter),
    dob:litter.birthDate,
    weight:piglet.birthWeight||"",
    color:piglet.color||"",
    registrationNum:"",
    notes:`Promoted from litter born ${fmtDate(litter.birthDate)}`,
    sireId:litter.sireId,
    damId:litter.sowId,
    avatar: piglet.sex==="boar"?1:0,
    active:true
  };
  state.pigs.push(newPig);
  piglet.promotedToPigId = newPig.id;
  save();
  checkAchievements();
  showToast(`${piglet.name} promoted to herd!`);
  renderLitters();
}

function determineLitterBreed(litter) {
  const sire = pigById(litter.sireId);
  const sow = pigById(litter.sowId);
  if(sire && sow && sire.breed===sow.breed) return sire.breed;
  if(sire && sow) return `${sire.breed}/${sow.breed}`;
  return sire?sire.breed:sow?sow.breed:"Unknown";
}

// === Shows ===
function renderShows() {
  const panel = $("#panel-shows");
  panel.innerHTML = "";

  // Filter + Add
  const bar = el("div","filter-bar");
  const pigFilter = document.createElement("select");
  pigFilter.innerHTML = `<option value="">All Pigs</option>` +
    activePigs().map(p=>`<option value="${p.id}">${p.name}</option>`).join("");
  bar.appendChild(pigFilter);
  bar.appendChild(el("div","spacer"));
  const addBtn = el("button","btn btn-primary","+ Add Show Record");
  addBtn.onclick = () => openShowModal(null);
  bar.appendChild(addBtn);
  panel.appendChild(bar);

  const listEl = el("div","");
  panel.appendChild(listEl);

  function renderList() {
    listEl.innerHTML = "";
    let shows = [...state.shows].sort((a,b)=>new Date(b.date)-new Date(a.date));
    if(pigFilter.value) shows = shows.filter(s=>s.pigId===pigFilter.value);
    if(shows.length===0) {
      listEl.appendChild(el("div","card","No show records yet."));
      return;
    }
    shows.forEach(s => {
      const c = el("div","card show-card");
      c.style.cursor = "pointer";
      const pig = pigById(s.pigId);

      // Placing
      const placingEl = el("div","show-placing");
      if(s.placing===0) { placingEl.textContent="🏆"; placingEl.className+=" placing-champion"; }
      else if(s.placing===1) { placingEl.textContent="🥇"; placingEl.className+=" placing-1"; }
      else if(s.placing===2) { placingEl.textContent="🥈"; placingEl.className+=" placing-2"; }
      else if(s.placing===3) { placingEl.textContent="🥉"; placingEl.className+=" placing-3"; }
      else { placingEl.textContent="#"+s.placing; }
      c.appendChild(placingEl);

      // Info
      const info = el("div","pig-info");
      info.style.flex = "1";
      info.appendChild(el("h3","",`${s.showName}`));
      info.appendChild(el("div","pig-meta",
        `${pig?AVATARS[pig.avatar||0]+" "+pig.name:"Unknown Pig"} · ${fmtDate(s.date)} · ${s.class||""} · +${s.reputationEarned} rep`
      ));
      if(s.judgeNotes) info.appendChild(el("div","pig-meta","Notes: "+s.judgeNotes));
      c.appendChild(info);

      c.onclick = () => openShowModal(s);
      listEl.appendChild(c);
    });
  }
  pigFilter.onchange = renderList;
  renderList();
}

function openShowModal(show) {
  const isEdit = !!show;
  const data = show ? {...show, placing:String(show.placing)} : {pigId:"",showName:"",date:new Date().toISOString().slice(0,10),class:SHOW_CLASSES[0],placing:"1",judgeNotes:""};

  const placingOpts = [{value:"0",label:"🏆 Champion"}];
  for(let i=1;i<=10;i++) placingOpts.push({value:String(i),label:`#${i}`});

  const fields = [
    {key:"pigId",label:"Pig",type:"select",options:activePigs().map(p=>({value:p.id,label:p.name+" ("+p.breed+")"}))},
    {key:"showName",label:"Show Name",type:"text"},
    {key:"date",label:"Date",type:"date"},
    {key:"class",label:"Class",type:"select",options:SHOW_CLASSES.map(c=>({value:c,label:c}))},
    {key:"placing",label:"Placing",type:"select",options:placingOpts},
    {key:"judgeNotes",label:"Judge Notes",type:"textarea"}
  ];

  openModal(
    isEdit ? "Edit Show Record" : "Add Show Record",
    fields, data,
    (result) => {
      if(!result.pigId||!result.showName.trim()) return;
      const placing = parseInt(result.placing);
      const repEarned = PLACING_REP[placing]??1;
      if(isEdit) {
        // Remove old rep, add new
        addRep(-show.reputationEarned);
        Object.assign(show, result);
        show.placing = placing;
        show.reputationEarned = repEarned;
        addRep(repEarned);
      } else {
        state.shows.push({
          id:uuid(), pigId:result.pigId, showName:result.showName, date:result.date,
          class:result.class, placing, judgeNotes:result.judgeNotes, reputationEarned:repEarned
        });
        addRep(repEarned);
      }
      save();
      checkAchievements();
      switchTab(state.activeTab);
    },
    isEdit ? () => {
      addRep(-show.reputationEarned);
      state.shows = state.shows.filter(s=>s.id!==show.id);
      save();
      switchTab(state.activeTab);
    } : null
  );
}

// === Pedigree ===
function renderPedigree() {
  const panel = $("#panel-pedigree");
  panel.innerHTML = "";
  panel.appendChild(el("div","section-title","🌳 Pedigree Viewer"));

  // Pig selector
  const bar = el("div","filter-bar");
  const sel = document.createElement("select");
  sel.innerHTML = `<option value="">— Select a Pig —</option>` +
    activePigs().map(p=>`<option value="${p.id}">${p.name} (${p.breed})</option>`).join("");
  bar.appendChild(sel);
  panel.appendChild(bar);

  const wrap = el("div","pedigree-wrap");
  panel.appendChild(wrap);

  sel.onchange = () => {
    wrap.innerHTML = "";
    const pig = pigById(sel.value);
    if(!pig) return;
    renderPedigreeTree(wrap, pig);
  };
}

function renderPedigreeTree(container, pig) {
  const tree = el("div","ped-tree");

  // Subject column
  const subjectCol = el("div","ped-col");
  subjectCol.appendChild(pedNode(pig, true));
  tree.appendChild(subjectCol);

  // Connectors + Parents
  tree.appendChild(el("div","ped-line"));

  const sire = pigById(pig.sireId);
  const dam = pigById(pig.damId);
  const parentCol = el("div","ped-col");
  parentCol.appendChild(pedNode(sire, false, "Sire"));
  parentCol.appendChild(pedNode(dam, false, "Dam"));
  tree.appendChild(parentCol);

  // Connectors + Grandparents
  tree.appendChild(el("div","ped-line"));

  const gpCol = el("div","ped-col");
  // Paternal grandparents
  const pgs = sire ? pigById(sire.sireId) : null;
  const pgd = sire ? pigById(sire.damId) : null;
  gpCol.appendChild(pedNode(pgs, false, "Paternal G-Sire"));
  gpCol.appendChild(pedNode(pgd, false, "Paternal G-Dam"));
  // Maternal grandparents
  const mgs = dam ? pigById(dam.sireId) : null;
  const mgd = dam ? pigById(dam.damId) : null;
  gpCol.appendChild(pedNode(mgs, false, "Maternal G-Sire"));
  gpCol.appendChild(pedNode(mgd, false, "Maternal G-Dam"));
  tree.appendChild(gpCol);

  container.appendChild(tree);
}

function pedNode(pig, isSubject, placeholder) {
  if(!pig) {
    const n = el("div","ped-node unknown");
    n.appendChild(el("h4","",placeholder||"Unknown"));
    n.appendChild(el("div","ped-breed","—"));
    return n;
  }
  const n = el("div","ped-node"+(isSubject?" ped-subject":""));
  n.appendChild(el("h4","",pig.name));
  n.appendChild(el("div","ped-breed",pig.breed||"Unknown breed"));
  if(pig.registrationNum) n.appendChild(el("div","ped-reg","Reg: "+pig.registrationNum));
  return n;
}

// === Init ===
function init() {
  load();
  updateRepDisplay();

  // Tab clicks
  $$(".tab").forEach(t => {
    t.addEventListener("click", () => switchTab(t.dataset.tab));
  });

  // Modal close
  $("#modal-close").addEventListener("click", closeModal);
  $("#modal-overlay").addEventListener("click", (e) => {
    if(e.target===$("#modal-overlay")) closeModal();
  });

  // Render initial tab
  switchTab(state.activeTab);
  checkAchievements();
}

init();
})();
