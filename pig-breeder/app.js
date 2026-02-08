(function(){
"use strict";

// ============================================================
// CONSTANTS
// ============================================================
const GESTATION_DAYS = 114;
const CONFIRM_BRED_DAYS = 21;
const WEAN_AGE_DAYS = 21;
const BREEDS = [
  "Berkshire","Chester White","Duroc","Hampshire","Hereford","Landrace",
  "Large Black","Mangalitsa","Meishan","Pietrain","Poland China",
  "Spotted","Tamworth","Yorkshire","Cross"
];
const SOW_STATUSES = ["Open","Bred","Confirmed","Farrowing","Nursing","Weaned","Dry","Retired"];
const FACILITY_TYPES = [
  {key:"breeding",label:"Breeding Barn",icon:"\u2764",defaultCrates:12},
  {key:"gestation",label:"Gestation Crates",icon:"\uD83E\uDD30",defaultCrates:24},
  {key:"farrowing",label:"Farrowing House",icon:"\uD83D\uDC37",defaultCrates:16},
  {key:"nursery",label:"Nursery Pens",icon:"\uD83D\uDC3D",defaultCrates:20},
  {key:"finisher",label:"Finisher Barn",icon:"\uD83D\uDC16",defaultCrates:30},
  {key:"quarantine",label:"Quarantine",icon:"\u26A0\uFE0F",defaultCrates:6}
];

// ============================================================
// STATE
// ============================================================
let S;
const DEFAULT = () => ({
  sows:[], boars:[], breedings:[], litters:[], semen:[],
  facilities: FACILITY_TYPES.map(f=>({
    id:uid(), type:f.key, name:f.label, capacity:f.defaultCrates,
    occupants:[] // [{sowId,since}]
  })),
  sales:[], photos:[], contacts:[], activeTab:"dashboard"
});

function load(){
  try{ const r=localStorage.getItem("porkpal"); S=r?JSON.parse(r):DEFAULT(); }
  catch(e){ S=DEFAULT(); }
  // patch
  if(!S.sows)S.sows=[];if(!S.boars)S.boars=[];if(!S.breedings)S.breedings=[];
  if(!S.litters)S.litters=[];if(!S.semen)S.semen=[];if(!S.sales)S.sales=[];
  if(!S.photos)S.photos=[];if(!S.contacts)S.contacts=[];
  if(!S.facilities)S.facilities=DEFAULT().facilities;
}
function save(){ localStorage.setItem("porkpal",JSON.stringify(S)); updateHeader(); }

// ============================================================
// HELPERS
// ============================================================
function uid(){
  if(crypto.randomUUID) return crypto.randomUUID();
  return 'xxxx-xxxx-xxxx'.replace(/x/g,()=>(Math.random()*16|0).toString(16));
}
function $(s){return document.querySelector(s)}
function $$(s){return document.querySelectorAll(s)}
function h(tag,cls,text){
  const e=document.createElement(tag);
  if(cls)e.className=cls;
  if(text!=null)e.textContent=text;
  return e;
}
function fmtDate(d){
  if(!d)return"\u2014";
  return new Date(d+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
}
function fmtShort(d){
  if(!d)return"\u2014";
  return new Date(d+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"});
}
function today(){ return new Date().toISOString().slice(0,10); }
function daysDiff(a,b){ return Math.round((new Date(b+"T00:00:00")-new Date(a+"T00:00:00"))/(864e5)); }
function addDays(d,n){ const dt=new Date(d+"T00:00:00"); dt.setDate(dt.getDate()+n); return dt.toISOString().slice(0,10); }
function ageText(dob){
  if(!dob)return"";
  const days=daysDiff(dob,today());
  if(days<0)return"";
  if(days<60)return days+"d";
  const mo=Math.floor(days/30.44);
  if(mo<24)return mo+"mo";
  return (mo/12|0)+"yr "+(mo%12)+"mo";
}
function fmtMoney(n){ return "$"+Number(n||0).toFixed(2); }
function timeAgo(ts){
  const mins=Math.floor((Date.now()-new Date(ts))/60000);
  if(mins<1)return"just now";
  if(mins<60)return mins+"m ago";
  const hrs=Math.floor(mins/60);
  if(hrs<24)return hrs+"h ago";
  const d=Math.floor(hrs/24);
  return d+"d ago";
}

function sowById(id){return S.sows.find(s=>s.id===id)}
function boarById(id){return S.boars.find(b=>b.id===id)}
function activeSows(){return S.sows.filter(s=>s.active!==false)}
function activeBoars(){return S.boars.filter(b=>b.active!==false)}

function showToast(msg){
  const t=h("div","toast",msg);
  $("#toast-container").appendChild(t);
  setTimeout(()=>t.remove(),3100);
}

function updateHeader(){
  const as=activeSows().length;
  const ab=S.breedings.filter(b=>b.status==="gestating"||b.status==="confirmed").length;
  $("#hdr-sow-count").textContent=as+" Sow"+(as!==1?"s":"");
  $("#hdr-breed-count").textContent=ab+" Active";
}

// ============================================================
// TAB SWITCHING
// ============================================================
function switchTab(name){
  S.activeTab=name; save();
  $$(".tab").forEach(t=>t.classList.toggle("active",t.dataset.tab===name));
  $$(".panel").forEach(p=>p.classList.toggle("active",p.id==="panel-"+name));
  const renderers={
    dashboard:renderDashboard, sows:renderSows, breeding:renderBreeding,
    litters:renderLitters, semen:renderSemen, operations:renderOperations,
    sales:renderSales, feed:renderFeed
  };
  if(renderers[name])renderers[name]();
}

// ============================================================
// MODAL SYSTEM
// ============================================================
function openModal(title,bodyFn,footerFn){
  $("#modal-title").textContent=title;
  const body=$("#modal-body"); body.innerHTML="";
  const footer=$("#modal-footer"); footer.innerHTML="";
  if(bodyFn)bodyFn(body);
  if(footerFn)footerFn(footer);
  $("#modal-overlay").classList.remove("hidden");
}
function closeModal(){ $("#modal-overlay").classList.add("hidden"); }

function formField(parent,label,type,value,opts){
  const grp=h("div","form-group");
  grp.appendChild(h("label","",label));
  let inp;
  if(type==="select"){
    inp=document.createElement("select");
    (opts||[]).forEach(o=>{
      const opt=document.createElement("option");
      opt.value=o.value; opt.textContent=o.label;
      inp.appendChild(opt);
    });
    inp.value=value||"";
  } else if(type==="textarea"){
    inp=document.createElement("textarea");
    inp.value=value||""; inp.rows=3;
  } else {
    inp=document.createElement("input");
    inp.type=type||"text";
    inp.value=value??"";
    if(opts&&opts.step)inp.step=opts.step;
    if(opts&&opts.min!=null)inp.min=opts.min;
    if(opts&&opts.max!=null)inp.max=opts.max;
    if(opts&&opts.placeholder)inp.placeholder=opts.placeholder;
  }
  grp.appendChild(inp);
  parent.appendChild(grp);
  return inp;
}

function formRow(parent){
  const r=h("div","form-row");
  parent.appendChild(r);
  return r;
}

// ============================================================
// DASHBOARD
// ============================================================
function renderDashboard(){
  const P=$("#panel-dashboard"); P.innerHTML="";

  // --- Stats row ---
  const row=h("div","card-row");
  const totalSows=activeSows().length;
  const totalBoars=activeBoars().length;
  const gestating=S.breedings.filter(b=>b.status==="gestating"||b.status==="confirmed").length;
  const totalPiglets=S.litters.reduce((s,l)=>s+(l.bornAlive||0),0);
  const totalRevenue=S.sales.reduce((s,sl)=>s+(sl.totalPrice||0),0);
  const semenDoses=S.semen.reduce((s,d)=>s+Math.max(0,(d.doses||0)-(d.usedDoses||0)),0);

  [{v:totalSows,l:"Active Sows",c:"stat-magenta"},
   {v:totalBoars,l:"Boars",c:"stat-cyan"},
   {v:gestating,l:"Gestating",c:"stat-green"},
   {v:totalPiglets,l:"Total Born",c:"stat-amber"},
   {v:semenDoses,l:"Semen Doses",c:"stat-cyan"},
   {v:fmtMoney(totalRevenue),l:"Total Revenue",c:"stat-green"}
  ].forEach(s=>{
    const c=h("div","stat-card "+s.c);
    c.appendChild(h("div","stat-val",String(s.v)));
    c.appendChild(h("div","stat-label",s.l));
    row.appendChild(c);
  });
  P.appendChild(row);

  // --- Week Calendar ---
  P.appendChild(h("div","section-title","This Week"));
  const cal=h("div","week-cal");
  const now=new Date();
  const startOfWeek=new Date(now);
  startOfWeek.setDate(now.getDate()-now.getDay());
  const dayNames=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  for(let i=0;i<7;i++){
    const d=new Date(startOfWeek);
    d.setDate(startOfWeek.getDate()+i);
    const ds=d.toISOString().slice(0,10);
    const isToday=ds===today();
    const wd=h("div","week-day"+(isToday?" today":""));
    wd.appendChild(h("div","wd-label",dayNames[i]));
    wd.appendChild(h("div","wd-num",String(d.getDate())));

    // Events for this day
    const events=[];
    S.breedings.filter(b=>(b.status==="gestating"||b.status==="confirmed")&&b.dueDate===ds).forEach(b=>{
      const sow=sowById(b.sowId);
      events.push("Due: "+(sow?sow.name:"?"));
    });
    S.breedings.filter(b=>b.status==="gestating"&&b.confirmDate===ds).forEach(b=>{
      const sow=sowById(b.sowId);
      events.push("Confirm: "+(sow?sow.name:"?"));
    });
    S.litters.filter(l=>!l.weanDate&&l.birthDate&&addDays(l.birthDate,WEAN_AGE_DAYS)===ds).forEach(l=>{
      const sow=sowById(l.sowId);
      events.push("Wean: "+(sow?sow.name:"?"));
    });

    if(events.length>0){
      const ev=h("div","wd-events");
      ev.textContent=events.join(", ");
      wd.appendChild(ev);
    }
    cal.appendChild(wd);
  }
  P.appendChild(cal);

  // --- Upcoming Due Dates ---
  const upcoming=S.breedings.filter(b=>b.status==="gestating"||b.status==="confirmed")
    .sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate)).slice(0,8);
  if(upcoming.length>0){
    P.appendChild(h("div","section-title","Upcoming Farrowings"));
    const tbl=h("table","data-table");
    tbl.innerHTML=`<thead><tr><th>Sow</th><th>Sire / Semen</th><th>Bred</th><th>Due</th><th>Days Left</th><th>Progress</th></tr></thead>`;
    const tbody=document.createElement("tbody");
    upcoming.forEach(b=>{
      const sow=sowById(b.sowId);
      const sire=b.boarId?boarById(b.boarId):null;
      const semenItem=b.semenId?S.semen.find(s=>s.id===b.semenId):null;
      const daysLeft=daysDiff(today(),b.dueDate);
      const elapsed=daysDiff(b.breedDate,today());
      const pct=Math.min(100,Math.max(0,(elapsed/GESTATION_DAYS)*100));
      const urgency=daysLeft<=7?"due-soon":daysLeft<=21?"due-mid":"due-far";
      const tr=document.createElement("tr");
      tr.innerHTML=`
        <td><strong>${sow?sow.name:"?"}</strong> <span class="badge badge-${(sow?sow.status:"").toLowerCase().replace(/\s/g,"")}">${sow?sow.status:""}</span></td>
        <td>${sire?sire.name:semenItem?semenItem.boarName:"?"}</td>
        <td>${fmtShort(b.breedDate)}</td>
        <td class="${urgency}">${fmtShort(b.dueDate)}</td>
        <td class="${urgency}">${daysLeft>0?daysLeft+"d":"Overdue!"}</td>
        <td><div class="progress-wrap"><div class="progress-bar gest" style="width:${pct}%"></div><div class="progress-label">${Math.round(pct)}%</div></div></td>
      `;
      tbody.appendChild(tr);
    });
    tbl.appendChild(tbody);
    P.appendChild(tbl);
  }

  // --- Recent Activity ---
  const activities=[];
  S.litters.slice(-10).forEach(l=>{
    const sow=sowById(l.sowId);
    activities.push({time:l.birthDate+"T12:00:00",color:"var(--magenta)",
      text:`${sow?sow.name:"?"} farrowed ${l.bornAlive} piglets (${l.stillborn||0} stillborn)`,date:l.birthDate});
  });
  S.sales.slice(-10).forEach(sl=>{
    activities.push({time:sl.saleDate+"T12:00:00",color:"var(--green)",
      text:`Sold ${sl.headCount||0} head to ${sl.buyerName||"?"} for ${fmtMoney(sl.totalPrice)}`,date:sl.saleDate});
  });
  S.breedings.slice(-10).forEach(b=>{
    const sow=sowById(b.sowId);
    activities.push({time:b.breedDate+"T12:00:00",color:"var(--accent)",
      text:`${sow?sow.name:"?"} bred on ${fmtShort(b.breedDate)}`,date:b.breedDate});
  });
  activities.sort((a,b)=>new Date(b.time)-new Date(a.time));

  if(activities.length>0){
    P.appendChild(h("div","section-title","Recent Activity"));
    const timeline=h("div","timeline");
    activities.slice(0,10).forEach(a=>{
      const item=h("div","timeline-item");
      item.querySelector; // noop
      const dot=item; // use ::before styling
      const dateEl=h("div","tl-date",fmtDate(a.date));
      const content=h("div","tl-content",a.text);
      item.appendChild(dateEl);
      item.appendChild(content);
      timeline.appendChild(item);
    });
    P.appendChild(timeline);
  }

  // --- Litters per Month bar chart ---
  if(S.litters.length>0){
    P.appendChild(h("div","section-title","Litters per Month"));
    const chart=h("div","bar-chart");
    const months={};
    S.litters.forEach(l=>{
      const m=l.birthDate?l.birthDate.slice(0,7):"unknown";
      months[m]=(months[m]||0)+1;
    });
    const keys=Object.keys(months).sort().slice(-12);
    const maxVal=Math.max(...keys.map(k=>months[k]),1);
    keys.forEach(k=>{
      const col=h("div","bar-col");
      const fill=h("div","bar-fill");
      fill.style.height=((months[k]/maxVal)*100)+"%";
      fill.style.background="var(--accent)";
      col.appendChild(h("div","bar-val",String(months[k])));
      col.appendChild(fill);
      col.appendChild(h("div","bar-label",k.slice(5)));
      chart.appendChild(col);
    });
    P.appendChild(chart);
  }

  // Empty state
  if(totalSows===0&&totalBoars===0){
    const empty=h("div","empty-state");
    empty.appendChild(h("div","empty-icon","\uD83D\uDC37"));
    empty.appendChild(h("div","empty-text","Welcome to PorkPal! Start by adding sows and boars."));
    const btn=h("button","btn btn-primary","+ Add First Sow");
    btn.onclick=()=>switchTab("sows");
    empty.appendChild(btn);
    P.appendChild(empty);
  }
}

// ============================================================
// SOWS & BOARS
// ============================================================
function renderSows(){
  const P=$("#panel-sows"); P.innerHTML="";

  // Filter bar
  const bar=h("div","filter-bar");
  const typeSel=document.createElement("select");
  typeSel.innerHTML=`<option value="sows">Sows</option><option value="boars">Boars</option><option value="all">All</option>`;
  bar.appendChild(typeSel);
  const statusSel=document.createElement("select");
  statusSel.innerHTML=`<option value="">All Status</option>`+SOW_STATUSES.map(s=>`<option value="${s}">${s}</option>`).join("");
  bar.appendChild(statusSel);
  const searchInp=document.createElement("input");
  searchInp.placeholder="Search name or tag...";
  bar.appendChild(searchInp);
  bar.appendChild(h("div","spacer"));
  const addSowBtn=h("button","btn btn-primary","+ Add Sow");
  addSowBtn.onclick=()=>openSowModal(null,"sow");
  bar.appendChild(addSowBtn);
  const addBoarBtn=h("button","btn btn-outline","+ Add Boar");
  addBoarBtn.onclick=()=>openSowModal(null,"boar");
  bar.appendChild(addBoarBtn);
  P.appendChild(bar);

  const listEl=h("div","");
  P.appendChild(listEl);

  function render(){
    listEl.innerHTML="";
    const showType=typeSel.value;
    let list=[];
    if(showType==="sows")list=activeSows();
    else if(showType==="boars")list=activeBoars();
    else list=[...activeSows(),...activeBoars()];

    if(statusSel.value)list=list.filter(a=>a.status===statusSel.value);
    const q=searchInp.value.toLowerCase();
    if(q)list=list.filter(a=>(a.name||"").toLowerCase().includes(q)||(a.tagNumber||"").toLowerCase().includes(q));

    if(list.length===0){
      listEl.appendChild(h("div","card","No animals found. Add one above!"));
      return;
    }

    const tbl=h("table","data-table");
    const isBoar=showType==="boars";
    tbl.innerHTML=`<thead><tr><th>Tag</th><th>Name</th><th>Breed</th><th>Age</th><th>Status</th><th>Litters</th><th>Parity</th><th>Weight</th><th></th></tr></thead>`;
    const tbody=document.createElement("tbody");
    list.forEach(a=>{
      const isSow=S.sows.includes(a);
      const litterCount=S.litters.filter(l=>isSow?l.sowId===a.id:l.sireId===a.id).length;
      const tr=document.createElement("tr");
      tr.className="clickable";
      const statusClass="badge-"+(a.status||"open").toLowerCase().replace(/\s/g,"");
      tr.innerHTML=`
        <td><strong>${a.tagNumber||"\u2014"}</strong></td>
        <td>${a.name||"\u2014"}</td>
        <td>${a.breed||"\u2014"}</td>
        <td>${ageText(a.dob)}</td>
        <td><span class="badge ${statusClass}">${a.status||"Open"}</span></td>
        <td>${litterCount}</td>
        <td>${a.parity||0}</td>
        <td>${a.weight?a.weight+"lb":"\u2014"}</td>
        <td><button class="btn btn-sm btn-ghost">View</button></td>
      `;
      tr.onclick=()=>openSowProfile(a,isSow?"sow":"boar");
      tbody.appendChild(tr);
    });
    tbl.appendChild(tbody);
    listEl.appendChild(tbl);
  }
  typeSel.onchange=render;
  statusSel.onchange=render;
  searchInp.oninput=render;
  render();
}

function openSowModal(animal, type){
  const isEdit=!!animal;
  const data=animal||{name:"",tagNumber:"",breed:BREEDS[0],dob:"",weight:"",status:"Open",parity:0,notes:"",photoData:""};
  const isSow=type==="sow";

  openModal(isEdit?"Edit "+(isSow?"Sow":"Boar"):"Add "+(isSow?"Sow":"Boar"),
    (body)=>{
      const row1=formRow(body);
      const nameInp=formField(row1,"Name","text",data.name);
      const tagInp=formField(row1,"Tag Number","text",data.tagNumber);
      const row2=formRow(body);
      const breedInp=formField(row2,"Breed","select",data.breed,BREEDS.map(b=>({value:b,label:b})));
      const dobInp=formField(row2,"Date of Birth","date",data.dob);
      const row3=formRow(body);
      const weightInp=formField(row3,"Weight (lb)","number",data.weight,{min:0,step:"0.1"});
      const statusInp=formField(row3,"Status","select",data.status,
        isSow?SOW_STATUSES.map(s=>({value:s,label:s})):[{value:"Active",label:"Active"},{value:"Retired",label:"Retired"}]);
      const parityInp=formField(body,"Parity (# of litters)","number",data.parity,{min:0});
      const notesInp=formField(body,"Notes","textarea",data.notes);

      // Photo upload
      const photoGrp=h("div","form-group");
      photoGrp.appendChild(h("label","","Photo"));
      const uploadArea=h("div","upload-area");
      uploadArea.innerHTML=`<div class="upload-icon">\uD83D\uDCF7</div><div class="upload-text">Click to upload photo</div>`;
      let photoData=data.photoData||"";
      if(photoData){
        const prev=document.createElement("img");
        prev.src=photoData; prev.className="upload-preview";
        uploadArea.appendChild(prev);
      }
      const fileInp=document.createElement("input");
      fileInp.type="file"; fileInp.accept="image/*"; fileInp.style.display="none";
      fileInp.onchange=(e)=>{
        const file=e.target.files[0]; if(!file)return;
        const reader=new FileReader();
        reader.onload=(ev)=>{
          photoData=ev.target.result;
          uploadArea.innerHTML=`<div class="upload-icon">\uD83D\uDCF7</div><div class="upload-text">Photo selected</div>`;
          const prev=document.createElement("img");
          prev.src=photoData; prev.className="upload-preview";
          uploadArea.appendChild(prev);
        };
        reader.readAsDataURL(file);
      };
      uploadArea.onclick=()=>fileInp.click();
      photoGrp.appendChild(uploadArea);
      photoGrp.appendChild(fileInp);
      body.appendChild(photoGrp);

      // store refs for save
      body._refs={nameInp,tagInp,breedInp,dobInp,weightInp,statusInp,parityInp,notesInp,getPhoto:()=>photoData};
    },
    (footer)=>{
      const saveBtn=h("button","btn btn-primary","Save");
      saveBtn.onclick=()=>{
        const r=$("#modal-body")._refs;
        const obj={
          name:r.nameInp.value.trim(),
          tagNumber:r.tagInp.value.trim(),
          breed:r.breedInp.value,
          dob:r.dobInp.value,
          weight:r.weightInp.value?parseFloat(r.weightInp.value):"",
          status:r.statusInp.value,
          parity:parseInt(r.parityInp.value)||0,
          notes:r.notesInp.value,
          photoData:r.getPhoto()
        };
        if(!obj.name){showToast("Name is required");return;}
        if(isEdit){
          Object.assign(animal,obj);
        } else {
          const entry={id:uid(),...obj,active:true};
          if(isSow)S.sows.push(entry);
          else S.boars.push(entry);
        }
        save(); closeModal(); switchTab("sows");
        showToast((isEdit?"Updated":"Added")+" "+(isSow?"sow":"boar")+": "+obj.name);
      };
      footer.appendChild(saveBtn);

      if(isEdit){
        const delBtn=h("button","btn btn-danger","Remove");
        delBtn.onclick=()=>{
          animal.active=false; save(); closeModal(); switchTab("sows");
        };
        footer.appendChild(delBtn);
      }
      const cancelBtn=h("button","btn btn-ghost","Cancel");
      cancelBtn.onclick=closeModal;
      footer.appendChild(cancelBtn);
    }
  );
}

function openSowProfile(animal,type){
  const isSow=type==="sow";
  openModal(animal.name+" — Profile",
    (body)=>{
      // Profile card
      const profile=h("div","sow-profile");
      const photoWrap=h("div","sow-photo-wrap");
      if(animal.photoData){
        const img=document.createElement("img");
        img.src=animal.photoData;
        photoWrap.appendChild(img);
      } else {
        photoWrap.textContent=isSow?"\uD83D\uDC37":"\uD83D\uDC17";
      }
      profile.appendChild(photoWrap);

      const details=h("div","sow-detail-grid");
      const fields=[
        ["Tag",animal.tagNumber||"\u2014"],["Breed",animal.breed||"\u2014"],
        ["DOB",fmtDate(animal.dob)],["Age",ageText(animal.dob)||"\u2014"],
        ["Weight",animal.weight?animal.weight+"lb":"\u2014"],["Status",animal.status||"Open"],
        ["Parity",String(animal.parity||0)],["ID",animal.id.slice(0,8)]
      ];
      fields.forEach(([lbl,val])=>{
        details.appendChild(h("div","detail-label",lbl));
        details.appendChild(h("div","detail-val",val));
      });
      profile.appendChild(details);
      body.appendChild(profile);

      if(animal.notes){
        body.appendChild(h("div","section-title","Notes"));
        body.appendChild(h("div","card",animal.notes));
      }

      // Breeding history
      const breedHistory=S.breedings.filter(b=>isSow?b.sowId===animal.id:b.boarId===animal.id);
      if(breedHistory.length>0){
        body.appendChild(h("div","section-title","Breeding History"));
        breedHistory.forEach(b=>{
          const partner=isSow?(b.boarId?boarById(b.boarId):null):(b.sowId?sowById(b.sowId):null);
          const c=h("div","card");
          c.innerHTML=`<strong>${fmtShort(b.breedDate)}</strong> with ${partner?partner.name:"Semen"} —
            <span class="badge badge-${b.status}">${b.status}</span>
            ${b.dueDate?" — Due "+fmtShort(b.dueDate):""}`;
          body.appendChild(c);
        });
      }

      // Litters
      const litters=S.litters.filter(l=>isSow?l.sowId===animal.id:l.sireId===animal.id);
      if(litters.length>0){
        body.appendChild(h("div","section-title","Litters ("+litters.length+")"));
        litters.forEach(l=>{
          const c=h("div","card");
          c.innerHTML=`<strong>${fmtShort(l.birthDate)}</strong> — ${l.bornAlive} alive, ${l.stillborn||0} stillborn, ${l.mummified||0} mummified
            ${l.weanDate?" — Weaned "+fmtShort(l.weanDate):""}`;
          body.appendChild(c);
        });
      }
    },
    (footer)=>{
      const editBtn=h("button","btn btn-primary","Edit");
      editBtn.onclick=()=>{closeModal();openSowModal(animal,type);};
      footer.appendChild(editBtn);
      const closeBtn=h("button","btn btn-ghost","Close");
      closeBtn.onclick=closeModal;
      footer.appendChild(closeBtn);
    }
  );
}

// ============================================================
// BREEDING
// ============================================================
function renderBreeding(){
  const P=$("#panel-breeding"); P.innerHTML="";

  // --- New Breeding Form ---
  P.appendChild(h("div","section-title","Record Breeding"));
  const card=h("div","card");

  const row1=formRow(card);
  const sowSel=formField(row1,"Sow","select","",
    [{value:"",label:"\u2014 Select Sow \u2014"},...activeSows().map(s=>({value:s.id,label:s.name+" ("+(s.tagNumber||"no tag")+")"}))]
  );
  const methodSel=formField(row1,"Method","select","natural",
    [{value:"natural",label:"Natural (Boar)"},{value:"ai",label:"Artificial Insemination"}]);

  const row2=formRow(card);
  const boarSel=formField(row2,"Boar / Semen","select","",
    [{value:"",label:"\u2014 Select \u2014"}]
  );
  const breedDateInp=formField(row2,"Breed Date","date",today());

  // Update boar/semen options based on method
  function updateSireOptions(){
    boarSel.innerHTML="";
    boarSel.appendChild(new Option("\u2014 Select \u2014",""));
    if(methodSel.value==="natural"){
      activeBoars().forEach(b=>{
        boarSel.appendChild(new Option(b.name+" ("+b.breed+")",b.id));
      });
    } else {
      S.semen.filter(s=>(s.doses-(s.usedDoses||0))>0).forEach(s=>{
        boarSel.appendChild(new Option(s.boarName+" \u2014 "+Math.max(0,s.doses-(s.usedDoses||0))+" doses",s.id));
      });
    }
  }
  methodSel.onchange=updateSireOptions;
  updateSireOptions();

  // Gestation calculator display
  const calcDiv=h("div","card");
  calcDiv.style.background="var(--panel)";
  calcDiv.style.marginTop="10px";
  function updateCalc(){
    const bd=breedDateInp.value;
    if(!bd){calcDiv.innerHTML="Enter breed date to see calculator.";return;}
    const confirmDate=addDays(bd,CONFIRM_BRED_DAYS);
    const dueDate=addDays(bd,GESTATION_DAYS);
    const sixMonths=addDays(bd,GESTATION_DAYS+180);
    calcDiv.innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;text-align:center">
        <div><div style="font-size:.72rem;color:var(--muted)">CONFIRM BRED</div><div style="font-weight:700;color:var(--amber)">${fmtShort(confirmDate)}</div><div style="font-size:.7rem;color:var(--dim)">${CONFIRM_BRED_DAYS} days</div></div>
        <div><div style="font-size:.72rem;color:var(--muted)">FARROWING DUE</div><div style="font-weight:700;color:var(--magenta)">${fmtShort(dueDate)}</div><div style="font-size:.7rem;color:var(--dim)">${GESTATION_DAYS} days</div></div>
        <div><div style="font-size:.72rem;color:var(--muted)">6 MONTHS OLD</div><div style="font-weight:700;color:var(--cyan)">${fmtShort(sixMonths)}</div></div>
      </div>
    `;
  }
  breedDateInp.onchange=updateCalc;
  updateCalc();
  card.appendChild(calcDiv);

  const notesInp=formField(card,"Notes","textarea","");

  const createBtn=h("button","btn btn-primary","Record Breeding");
  createBtn.style.marginTop="10px";
  createBtn.onclick=()=>{
    if(!sowSel.value){showToast("Select a sow");return;}
    if(!boarSel.value){showToast("Select a boar or semen");return;}
    const bd=breedDateInp.value;
    if(!bd){showToast("Enter breed date");return;}

    const breeding={
      id:uid(), sowId:sowSel.value,
      boarId:methodSel.value==="natural"?boarSel.value:null,
      semenId:methodSel.value==="ai"?boarSel.value:null,
      method:methodSel.value,
      breedDate:bd,
      confirmDate:addDays(bd,CONFIRM_BRED_DAYS),
      dueDate:addDays(bd,GESTATION_DAYS),
      status:"gestating",
      litterId:null,
      notes:notesInp.value
    };
    S.breedings.push(breeding);

    // Update sow status
    const sow=sowById(sowSel.value);
    if(sow)sow.status="Bred";

    // Decrement semen if AI
    if(methodSel.value==="ai"){
      const sem=S.semen.find(s=>s.id===boarSel.value);
      if(sem)sem.usedDoses=(sem.usedDoses||0)+1;
    }

    save();
    showToast("Breeding recorded!");
    renderBreeding();
  };
  card.appendChild(createBtn);
  P.appendChild(card);

  // --- Active Breedings ---
  const active=S.breedings.filter(b=>b.status==="gestating"||b.status==="confirmed");
  if(active.length>0){
    P.appendChild(h("div","section-title","Active Breedings ("+active.length+")"));
    const tbl=h("table","data-table");
    tbl.innerHTML=`<thead><tr><th>Sow</th><th>Sire</th><th>Bred</th><th>Confirm</th><th>Due</th><th>Progress</th><th>Actions</th></tr></thead>`;
    const tbody=document.createElement("tbody");
    active.sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate)).forEach(b=>{
      const sow=sowById(b.sowId);
      const sire=b.boarId?boarById(b.boarId):null;
      const sem=b.semenId?S.semen.find(s=>s.id===b.semenId):null;
      const elapsed=daysDiff(b.breedDate,today());
      const pct=Math.min(100,Math.max(0,(elapsed/GESTATION_DAYS)*100));
      const daysLeft=daysDiff(today(),b.dueDate);
      const urgency=daysLeft<=7?"due-soon":daysLeft<=21?"due-mid":"due-far";

      const tr=document.createElement("tr");
      tr.innerHTML=`
        <td><strong>${sow?sow.name:"?"}</strong></td>
        <td>${sire?sire.name:sem?sem.boarName+" (AI)":"?"}</td>
        <td>${fmtShort(b.breedDate)}</td>
        <td>${b.status==="confirmed"?"\u2705 "+fmtShort(b.confirmDate):fmtShort(b.confirmDate)}</td>
        <td class="${urgency}">${fmtShort(b.dueDate)} (${daysLeft>0?daysLeft+"d":"DUE!"})</td>
        <td><div class="progress-wrap" style="min-width:100px"><div class="progress-bar gest" style="width:${pct}%"></div><div class="progress-label">${elapsed}d / ${GESTATION_DAYS}d</div></div></td>
        <td></td>
      `;
      const actionTd=tr.querySelector("td:last-child");
      const btnGroup=h("div","btn-group");

      if(b.status==="gestating"){
        const confirmBtn=h("button","btn btn-sm btn-success","Confirm");
        confirmBtn.onclick=(e)=>{
          e.stopPropagation();
          b.status="confirmed";
          const sow2=sowById(b.sowId); if(sow2)sow2.status="Confirmed";
          save(); renderBreeding();
        };
        btnGroup.appendChild(confirmBtn);
      }

      const farrowBtn=h("button","btn btn-sm btn-primary","Farrow");
      farrowBtn.onclick=(e)=>{e.stopPropagation();openFarrowModal(b);};
      btnGroup.appendChild(farrowBtn);

      const failBtn=h("button","btn btn-sm btn-danger","\u2717");
      failBtn.title="Mark as failed";
      failBtn.onclick=(e)=>{
        e.stopPropagation();
        b.status="failed";
        const sow2=sowById(b.sowId);if(sow2)sow2.status="Open";
        save(); renderBreeding();
      };
      btnGroup.appendChild(failBtn);

      actionTd.appendChild(btnGroup);
      tbody.appendChild(tr);
    });
    tbl.appendChild(tbody);
    P.appendChild(tbl);
  }

  // --- Past Breedings ---
  const past=S.breedings.filter(b=>b.status!=="gestating"&&b.status!=="confirmed");
  if(past.length>0){
    const hdr=h("div","section-title","Past Breedings ("+past.length+")");
    hdr.style.cursor="pointer";
    const wrap=h("div","");
    wrap.style.display="none";
    hdr.onclick=()=>{wrap.style.display=wrap.style.display==="none"?"block":"none";};
    P.appendChild(hdr);
    past.sort((a,b)=>new Date(b.breedDate)-new Date(a.breedDate)).forEach(b=>{
      const sow=sowById(b.sowId);
      const sire=b.boarId?boarById(b.boarId):null;
      const c=h("div","card");
      const statusBadge=b.status==="delivered"?"badge-confirmed":"badge-danger";
      c.innerHTML=`<strong>${sow?sow.name:"?"}</strong> x ${sire?sire.name:"AI"} — ${fmtShort(b.breedDate)} — <span class="badge ${statusBadge}">${b.status}</span>`;
      wrap.appendChild(c);
    });
    P.appendChild(wrap);
  }
}

function openFarrowModal(breeding){
  openModal("Record Farrowing",
    (body)=>{
      const sow=sowById(breeding.sowId);
      body.appendChild(h("div","","Sow: <strong>"+(sow?sow.name:"?")+"</strong>"));
      body.appendChild(document.createElement("br"));

      const dateInp=formField(body,"Farrowing Date","date",today());
      const row=formRow(body);
      const aliveInp=formField(row,"Born Alive","number","",{min:0});
      const stillInp=formField(row,"Stillborn","number","0",{min:0});
      const row2=formRow(body);
      const mumInp=formField(row2,"Mummified","number","0",{min:0});
      const avgWtInp=formField(row2,"Avg Birth Weight (lb)","number","",{min:0,step:"0.1"});
      const notesInp=formField(body,"Notes","textarea","");

      body._refs={dateInp,aliveInp,stillInp,mumInp,avgWtInp,notesInp};
    },
    (footer)=>{
      const saveBtn=h("button","btn btn-primary","Save Litter");
      saveBtn.onclick=()=>{
        const r=$("#modal-body")._refs;
        const bornAlive=parseInt(r.aliveInp.value)||0;
        const stillborn=parseInt(r.stillInp.value)||0;
        const mummified=parseInt(r.mumInp.value)||0;
        const avgWeight=parseFloat(r.avgWtInp.value)||0;
        if(bornAlive===0&&stillborn===0){showToast("Enter litter count");return;}

        const piglets=[];
        for(let i=0;i<bornAlive;i++){
          piglets.push({
            id:uid(),name:"Piglet "+(i+1),
            sex:i%2===0?"gilt":"boar",
            birthWeight:avgWeight||"",
            color:"",status:"alive",
            soldTo:null,salePrice:null
          });
        }

        const litter={
          id:uid(), breedingId:breeding.id,
          sowId:breeding.sowId,
          sireId:breeding.boarId||null,
          semenId:breeding.semenId||null,
          birthDate:r.dateInp.value,
          bornAlive, stillborn, mummified,
          avgBirthWeight:avgWeight,
          piglets, weanDate:null,
          notes:r.notesInp.value
        };
        S.litters.push(litter);
        breeding.status="delivered";
        breeding.litterId=litter.id;

        // Update sow
        const sow=sowById(breeding.sowId);
        if(sow){
          sow.status="Nursing";
          sow.parity=(sow.parity||0)+1;
        }

        save(); closeModal();
        showToast("Litter recorded! "+bornAlive+" born alive.");
        switchTab(S.activeTab);
      };
      footer.appendChild(saveBtn);
      footer.appendChild(h("button","btn btn-ghost","Cancel"));
      footer.lastChild.onclick=closeModal;
    }
  );
}

// ============================================================
// LITTERS
// ============================================================
function renderLitters(){
  const P=$("#panel-litters"); P.innerHTML="";

  if(S.litters.length===0){
    const empty=h("div","empty-state");
    empty.appendChild(h("div","empty-icon","\uD83D\uDC3D"));
    empty.appendChild(h("div","empty-text","No litters recorded yet. Record a farrowing from the Breeding tab."));
    P.appendChild(empty);
    return;
  }

  // Stats
  const totalBorn=S.litters.reduce((s,l)=>s+(l.bornAlive||0),0);
  const totalStill=S.litters.reduce((s,l)=>s+(l.stillborn||0),0);
  const avgLitter=S.litters.length?Math.round(totalBorn/S.litters.length*10)/10:0;
  const nursing=S.litters.filter(l=>!l.weanDate).length;

  const row=h("div","card-row");
  [{v:S.litters.length,l:"Total Litters",c:"stat-cyan"},
   {v:totalBorn,l:"Born Alive",c:"stat-green"},
   {v:totalStill,l:"Stillborn",c:"stat-red"},
   {v:avgLitter,l:"Avg Litter Size",c:"stat-amber"},
   {v:nursing,l:"Still Nursing",c:"stat-magenta"}
  ].forEach(s=>{
    const c=h("div","stat-card "+s.c);
    c.appendChild(h("div","stat-val",String(s.v)));
    c.appendChild(h("div","stat-label",s.l));
    row.appendChild(c);
  });
  P.appendChild(row);

  // Litter list
  const sorted=[...S.litters].sort((a,b)=>new Date(b.birthDate)-new Date(a.birthDate));
  sorted.forEach(l=>{
    const sow=sowById(l.sowId);
    const sire=l.sireId?boarById(l.sireId):null;
    const sem=l.semenId?S.semen.find(s=>s.id===l.semenId):null;

    const card=h("div","card");
    card.style.cursor="pointer";

    // Header
    const hdr=h("div","");
    hdr.style.cssText="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px";
    const left=h("div","");
    left.innerHTML=`<strong style="font-size:.95rem">${sow?sow.name:"?"} x ${sire?sire.name:sem?sem.boarName:"?"}</strong>`;
    hdr.appendChild(left);
    const right=h("div","");
    right.innerHTML=`<span style="font-size:.82rem;color:var(--muted)">${fmtDate(l.birthDate)}</span>
      ${!l.weanDate?'<span class="badge badge-nursing" style="margin-left:6px">Nursing</span>':'<span class="badge badge-weaned" style="margin-left:6px">Weaned '+fmtShort(l.weanDate)+'</span>'}`;
    hdr.appendChild(right);
    card.appendChild(hdr);

    // Stats row
    const statsRow=h("div","");
    statsRow.style.cssText="display:flex;gap:16px;font-size:.82rem;color:var(--muted);margin-bottom:8px";
    statsRow.innerHTML=`
      <span><strong style="color:var(--green)">${l.bornAlive}</strong> alive</span>
      <span><strong style="color:var(--red)">${l.stillborn||0}</strong> stillborn</span>
      <span><strong style="color:var(--dim)">${l.mummified||0}</strong> mummified</span>
      <span>Avg weight: <strong>${l.avgBirthWeight||"\u2014"}</strong> lb</span>
    `;
    card.appendChild(statsRow);

    // Piglet table (collapsible)
    const pigletWrap=h("div","");
    pigletWrap.style.display="none";

    if(l.piglets&&l.piglets.length>0){
      const ptbl=h("table","data-table");
      ptbl.innerHTML=`<thead><tr><th>#</th><th>Name</th><th>Sex</th><th>Weight</th><th>Status</th><th>Actions</th></tr></thead>`;
      const ptbody=document.createElement("tbody");
      l.piglets.forEach((p,i)=>{
        const ptr=document.createElement("tr");
        ptr.innerHTML=`
          <td>${i+1}</td>
          <td>${p.name}</td>
          <td>${p.sex==="gilt"?"\u2640 Gilt":"\u2642 Boar"}</td>
          <td>${p.birthWeight?p.birthWeight+"lb":"\u2014"}</td>
          <td><span class="badge badge-${p.status==="sold"?"sold":p.status==="dead"?"danger":"open"}">${p.status||"alive"}</span></td>
          <td></td>
        `;
        const actionTd=ptr.querySelector("td:last-child");
        if(p.status!=="sold"&&p.status!=="dead"){
          const editBtn=h("button","btn btn-sm btn-ghost","Edit");
          editBtn.onclick=(e)=>{e.stopPropagation();openPigletEditModal(l,p);};
          actionTd.appendChild(editBtn);
        }
        ptbody.appendChild(ptr);
      });
      ptbl.appendChild(ptbody);
      pigletWrap.appendChild(ptbl);
    }

    // Action buttons
    const actions=h("div","btn-group");
    actions.style.marginTop="8px";
    if(!l.weanDate){
      const weanBtn=h("button","btn btn-sm btn-warning","Record Wean");
      weanBtn.onclick=(e)=>{
        e.stopPropagation();
        openModal("Record Wean Date",(body)=>{
          body._dateInp=formField(body,"Wean Date","date",today());
          body._weanWtInp=formField(body,"Avg Wean Weight (lb)","number","",{min:0,step:"0.1"});
        },(footer)=>{
          const btn2=h("button","btn btn-primary","Save");
          btn2.onclick=()=>{
            l.weanDate=$("#modal-body")._dateInp.value;
            l.avgWeanWeight=parseFloat($("#modal-body")._weanWtInp.value)||null;
            const sow2=sowById(l.sowId);if(sow2)sow2.status="Weaned";
            save();closeModal();renderLitters();
          };
          footer.appendChild(btn2);
          footer.appendChild(h("button","btn btn-ghost","Cancel")).onclick=closeModal;
        });
      };
      actions.appendChild(weanBtn);
    }
    pigletWrap.appendChild(actions);
    card.appendChild(pigletWrap);

    card.onclick=()=>{
      pigletWrap.style.display=pigletWrap.style.display==="none"?"block":"none";
    };

    P.appendChild(card);
  });
}

function openPigletEditModal(litter,piglet){
  openModal("Edit Piglet: "+piglet.name,
    (body)=>{
      const nameInp=formField(body,"Name","text",piglet.name);
      const row=formRow(body);
      const sexSel=formField(row,"Sex","select",piglet.sex,[{value:"gilt",label:"\u2640 Gilt"},{value:"boar",label:"\u2642 Boar"}]);
      const wtInp=formField(row,"Weight (lb)","number",piglet.birthWeight,{min:0,step:"0.1"});
      const colorInp=formField(body,"Color/Markings","text",piglet.color||"");
      const statusSel=formField(body,"Status","select",piglet.status||"alive",
        [{value:"alive",label:"Alive"},{value:"dead",label:"Dead/Mortality"},{value:"sold",label:"Sold"}]);
      body._refs={nameInp,sexSel,wtInp,colorInp,statusSel};
    },
    (footer)=>{
      const saveBtn=h("button","btn btn-primary","Save");
      saveBtn.onclick=()=>{
        const r=$("#modal-body")._refs;
        piglet.name=r.nameInp.value;
        piglet.sex=r.sexSel.value;
        piglet.birthWeight=parseFloat(r.wtInp.value)||"";
        piglet.color=r.colorInp.value;
        piglet.status=r.statusSel.value;
        save();closeModal();renderLitters();
      };
      footer.appendChild(saveBtn);
      footer.appendChild(h("button","btn btn-ghost","Cancel")).onclick=closeModal;
    }
  );
}

// ============================================================
// SEMEN INVENTORY
// ============================================================
function renderSemen(){
  const P=$("#panel-semen"); P.innerHTML="";

  // Stats
  const totalDoses=S.semen.reduce((s,d)=>s+(d.doses||0),0);
  const usedDoses=S.semen.reduce((s,d)=>s+(d.usedDoses||0),0);
  const available=totalDoses-usedDoses;
  const expired=S.semen.filter(s=>s.expiryDate&&s.expiryDate<today()).length;

  const row=h("div","card-row");
  [{v:S.semen.length,l:"Collections",c:"stat-cyan"},
   {v:totalDoses,l:"Total Doses",c:"stat-amber"},
   {v:available,l:"Available",c:"stat-green"},
   {v:usedDoses,l:"Used",c:"stat-magenta"},
   {v:expired,l:"Expired",c:"stat-red"}
  ].forEach(s=>{
    const c=h("div","stat-card "+s.c);
    c.appendChild(h("div","stat-val",String(s.v)));
    c.appendChild(h("div","stat-label",s.l));
    row.appendChild(c);
  });
  P.appendChild(row);

  // Add button
  const hdrRow=h("div","section-title-row");
  hdrRow.appendChild(h("div","section-title","Semen Inventory"));
  const addBtn=h("button","btn btn-primary","+ Add Collection");
  addBtn.onclick=()=>openSemenModal(null);
  hdrRow.appendChild(addBtn);
  P.appendChild(hdrRow);

  if(S.semen.length===0){
    P.appendChild(h("div","card","No semen inventory. Add a collection above."));
    return;
  }

  // Table
  const tbl=h("table","data-table");
  tbl.innerHTML=`<thead><tr><th>Boar</th><th>Breed</th><th>Source</th><th>Collected</th><th>Expiry</th><th>Doses</th><th>Used</th><th>Avail</th><th>Storage</th><th></th></tr></thead>`;
  const tbody=document.createElement("tbody");
  S.semen.forEach(s=>{
    const avail=Math.max(0,(s.doses||0)-(s.usedDoses||0));
    const isExpired=s.expiryDate&&s.expiryDate<today();
    const tr=document.createElement("tr");
    tr.innerHTML=`
      <td><strong>${s.boarName}</strong></td>
      <td>${s.boarBreed||"\u2014"}</td>
      <td>${s.source||"\u2014"}</td>
      <td>${fmtShort(s.dateCollected)}</td>
      <td class="${isExpired?"due-soon":""}">${fmtShort(s.expiryDate)}${isExpired?" \u26A0":"" }</td>
      <td>${s.doses}</td>
      <td>${s.usedDoses||0}</td>
      <td><strong style="color:${avail>0?"var(--green)":"var(--red)"}">${avail}</strong></td>
      <td>${s.storageLocation||"\u2014"}</td>
      <td></td>
    `;
    const actionTd=tr.querySelector("td:last-child");
    const editBtn=h("button","btn btn-sm btn-ghost","Edit");
    editBtn.onclick=()=>openSemenModal(s);
    actionTd.appendChild(editBtn);
    tbody.appendChild(tr);
  });
  tbl.appendChild(tbody);
  P.appendChild(tbl);
}

function openSemenModal(item){
  const isEdit=!!item;
  const data=item||{boarName:"",boarBreed:BREEDS[0],source:"",dateCollected:today(),expiryDate:"",doses:1,usedDoses:0,storageLocation:"",notes:""};

  openModal(isEdit?"Edit Semen Collection":"Add Semen Collection",
    (body)=>{
      const row1=formRow(body);
      const nameInp=formField(row1,"Boar Name","text",data.boarName);
      const breedInp=formField(row1,"Boar Breed","select",data.boarBreed,BREEDS.map(b=>({value:b,label:b})));
      const sourceInp=formField(body,"Source / Supplier","text",data.source,{placeholder:"Farm name, AI center, etc."});
      const row2=formRow(body);
      const collDateInp=formField(row2,"Date Collected","date",data.dateCollected);
      const expDateInp=formField(row2,"Expiry Date","date",data.expiryDate);
      const row3=formRow(body);
      const dosesInp=formField(row3,"Total Doses","number",data.doses,{min:1});
      const usedInp=formField(row3,"Used Doses","number",data.usedDoses,{min:0});
      const storageInp=formField(body,"Storage Location","text",data.storageLocation,{placeholder:"Tank A, Shelf 3, etc."});
      const notesInp=formField(body,"Notes","textarea",data.notes);
      body._refs={nameInp,breedInp,sourceInp,collDateInp,expDateInp,dosesInp,usedInp,storageInp,notesInp};
    },
    (footer)=>{
      const saveBtn=h("button","btn btn-primary","Save");
      saveBtn.onclick=()=>{
        const r=$("#modal-body")._refs;
        if(!r.nameInp.value.trim()){showToast("Boar name required");return;}
        const obj={
          boarName:r.nameInp.value.trim(),
          boarBreed:r.breedInp.value,
          source:r.sourceInp.value,
          dateCollected:r.collDateInp.value,
          expiryDate:r.expDateInp.value,
          doses:parseInt(r.dosesInp.value)||1,
          usedDoses:parseInt(r.usedInp.value)||0,
          storageLocation:r.storageInp.value,
          notes:r.notesInp.value
        };
        if(isEdit)Object.assign(item,obj);
        else S.semen.push({id:uid(),...obj});
        save();closeModal();renderSemen();
        showToast("Semen collection "+(isEdit?"updated":"added"));
      };
      footer.appendChild(saveBtn);
      if(isEdit){
        const delBtn=h("button","btn btn-danger","Delete");
        delBtn.onclick=()=>{S.semen=S.semen.filter(s=>s.id!==item.id);save();closeModal();renderSemen();};
        footer.appendChild(delBtn);
      }
      footer.appendChild(h("button","btn btn-ghost","Cancel")).onclick=closeModal;
    }
  );
}

// ============================================================
// OPERATIONS — BIRD'S EYE VIEW
// ============================================================
function renderOperations(){
  const P=$("#panel-operations"); P.innerHTML="";

  P.appendChild(h("div","section-title","Facility Overview"));

  // Facility setup button
  const setupBtn=h("button","btn btn-sm btn-outline","Configure Facilities");
  setupBtn.onclick=openFacilityConfig;
  setupBtn.style.marginBottom="14px";
  P.appendChild(setupBtn);

  const grid=h("div","ops-grid");

  S.facilities.forEach(fac=>{
    const type=FACILITY_TYPES.find(t=>t.key===fac.type);
    const sec=h("div","ops-section");

    // Header
    const hdr=h("div","ops-section-header");
    hdr.appendChild(h("h3","",
      (type?type.icon:"")+" "+fac.name));
    const occupied=fac.occupants?fac.occupants.length:0;
    hdr.appendChild(h("div","ops-capacity",occupied+"/"+fac.capacity+" occupied"));
    sec.appendChild(hdr);

    // Utilization bar
    const utilPct=fac.capacity?Math.round((occupied/fac.capacity)*100):0;
    const utilWrap=h("div","progress-wrap");
    utilWrap.style.height="8px";utilWrap.style.marginBottom="10px";
    const utilBar=h("div","progress-bar");
    utilBar.style.width=utilPct+"%";
    utilBar.style.background=utilPct>90?"var(--red)":utilPct>70?"var(--amber)":"var(--green)";
    utilBar.style.height="100%";
    utilWrap.appendChild(utilBar);
    sec.appendChild(utilWrap);

    // Crate grid
    const crateGrid=h("div","crate-grid");
    for(let i=0;i<fac.capacity;i++){
      const occ=fac.occupants&&fac.occupants[i]?fac.occupants[i]:null;
      const sow=occ?sowById(occ.sowId):null;
      const crate=h("div","crate "+(occ?"occupied":"empty"));
      crate.appendChild(h("div","crate-label",fac.type.slice(0,3).toUpperCase()+"-"+(i+1)));
      if(sow){
        crate.appendChild(h("div","crate-animal",sow.name));
        crate.title=sow.name+" — "+sow.status;
      } else {
        crate.appendChild(h("div","","Empty"));
      }
      crate.onclick=()=>openAssignCrateModal(fac,i);
      crateGrid.appendChild(crate);
    }
    sec.appendChild(crateGrid);
    grid.appendChild(sec);
  });

  P.appendChild(grid);
}

function openAssignCrateModal(facility,index){
  const current=facility.occupants&&facility.occupants[index]?facility.occupants[index]:null;
  const currentSow=current?sowById(current.sowId):null;

  openModal("Crate "+(index+1)+" — "+facility.name,
    (body)=>{
      if(currentSow){
        body.appendChild(h("div","","Currently occupied by: <strong>"+currentSow.name+"</strong>"));
        body.appendChild(document.createElement("br"));
      }
      const sowSel=formField(body,"Assign Sow","select",current?current.sowId:"",
        [{value:"",label:"\u2014 Empty \u2014"},...activeSows().map(s=>({value:s.id,label:s.name+" ("+s.status+")"}))]
      );
      body._sowSel=sowSel;
    },
    (footer)=>{
      const saveBtn=h("button","btn btn-primary","Save");
      saveBtn.onclick=()=>{
        if(!facility.occupants)facility.occupants=[];
        // Pad array if needed
        while(facility.occupants.length<=index)facility.occupants.push(null);
        const val=$("#modal-body")._sowSel.value;
        if(val){
          facility.occupants[index]={sowId:val,since:today()};
        } else {
          facility.occupants[index]=null;
        }
        save();closeModal();renderOperations();
      };
      footer.appendChild(saveBtn);
      if(current){
        const clearBtn=h("button","btn btn-warning","Clear");
        clearBtn.onclick=()=>{
          facility.occupants[index]=null;
          save();closeModal();renderOperations();
        };
        footer.appendChild(clearBtn);
      }
      footer.appendChild(h("button","btn btn-ghost","Cancel")).onclick=closeModal;
    }
  );
}

function openFacilityConfig(){
  openModal("Configure Facilities",
    (body)=>{
      body._inputs=[];
      S.facilities.forEach((fac,i)=>{
        const row=h("div","form-row");
        row.style.marginBottom="8px";
        const nameInp=formField(row,"Name","text",fac.name);
        const capInp=formField(row,"Capacity","number",fac.capacity,{min:1});
        body.appendChild(row);
        body._inputs.push({fac,nameInp,capInp});
      });
    },
    (footer)=>{
      const saveBtn=h("button","btn btn-primary","Save");
      saveBtn.onclick=()=>{
        $("#modal-body")._inputs.forEach(inp=>{
          inp.fac.name=inp.nameInp.value;
          inp.fac.capacity=parseInt(inp.capInp.value)||1;
        });
        save();closeModal();renderOperations();
      };
      footer.appendChild(saveBtn);
      footer.appendChild(h("button","btn btn-ghost","Cancel")).onclick=closeModal;
    }
  );
}

// ============================================================
// SALES
// ============================================================
function renderSales(){
  const P=$("#panel-sales"); P.innerHTML="";

  // Stats
  const totalSales=S.sales.length;
  const totalRevenue=S.sales.reduce((s,sl)=>s+(sl.totalPrice||0),0);
  const totalHead=S.sales.reduce((s,sl)=>s+(sl.headCount||0),0);
  const avgPrice=totalHead?totalRevenue/totalHead:0;

  const row=h("div","card-row");
  [{v:totalSales,l:"Total Sales",c:"stat-cyan"},
   {v:totalHead,l:"Head Sold",c:"stat-amber"},
   {v:fmtMoney(totalRevenue),l:"Total Revenue",c:"stat-green"},
   {v:fmtMoney(avgPrice),l:"Avg Per Head",c:"stat-magenta"}
  ].forEach(s=>{
    const c=h("div","stat-card "+s.c);
    c.appendChild(h("div","stat-val",String(s.v)));
    c.appendChild(h("div","stat-label",s.l));
    row.appendChild(c);
  });
  P.appendChild(row);

  // Add sale button
  const hdrRow=h("div","section-title-row");
  hdrRow.appendChild(h("div","section-title","Sales Records"));
  const addBtn=h("button","btn btn-primary","+ Record Sale");
  addBtn.onclick=()=>openSaleModal(null);
  hdrRow.appendChild(addBtn);
  P.appendChild(hdrRow);

  if(S.sales.length===0){
    P.appendChild(h("div","card","No sales recorded yet."));
    return;
  }

  // Sales table
  const tbl=h("table","data-table");
  tbl.innerHTML=`<thead><tr><th>Date</th><th>Buyer</th><th>Litter/Source</th><th>Head</th><th>Price/Head</th><th>Total</th><th>Notes</th><th></th></tr></thead>`;
  const tbody=document.createElement("tbody");
  [...S.sales].sort((a,b)=>new Date(b.saleDate)-new Date(a.saleDate)).forEach(sl=>{
    const litter=sl.litterId?S.litters.find(l=>l.id===sl.litterId):null;
    const sow=litter?sowById(litter.sowId):null;
    const tr=document.createElement("tr");
    tr.innerHTML=`
      <td>${fmtShort(sl.saleDate)}</td>
      <td><strong>${sl.buyerName||"\u2014"}</strong><br><span style="font-size:.72rem;color:var(--dim)">${sl.buyerContact||""}</span></td>
      <td>${sow?sow.name+"'s litter":sl.source||"\u2014"}</td>
      <td>${sl.headCount||0}</td>
      <td>${fmtMoney(sl.pricePerHead)}</td>
      <td><strong style="color:var(--green)">${fmtMoney(sl.totalPrice)}</strong></td>
      <td style="max-width:150px;overflow:hidden;text-overflow:ellipsis">${sl.notes||""}</td>
      <td></td>
    `;
    const actionTd=tr.querySelector("td:last-child");
    const editBtn=h("button","btn btn-sm btn-ghost","Edit");
    editBtn.onclick=()=>openSaleModal(sl);
    actionTd.appendChild(editBtn);
    tbody.appendChild(tr);
  });
  tbl.appendChild(tbody);
  P.appendChild(tbl);

  // Revenue by month chart
  if(S.sales.length>0){
    P.appendChild(h("div","section-title","Revenue by Month"));
    const chart=h("div","bar-chart");
    const months={};
    S.sales.forEach(sl=>{
      const m=sl.saleDate?sl.saleDate.slice(0,7):"?";
      months[m]=(months[m]||0)+(sl.totalPrice||0);
    });
    const keys=Object.keys(months).sort().slice(-12);
    const maxVal=Math.max(...keys.map(k=>months[k]),1);
    keys.forEach(k=>{
      const col=h("div","bar-col");
      const fill=h("div","bar-fill");
      fill.style.height=((months[k]/maxVal)*100)+"%";
      fill.style.background="var(--green)";
      col.appendChild(h("div","bar-val",fmtMoney(months[k])));
      col.appendChild(fill);
      col.appendChild(h("div","bar-label",k.slice(5)));
      chart.appendChild(col);
    });
    P.appendChild(chart);
  }
}

function openSaleModal(sale){
  const isEdit=!!sale;
  const data=sale||{saleDate:today(),buyerName:"",buyerContact:"",litterId:"",source:"",headCount:1,pricePerHead:0,totalPrice:0,notes:""};

  openModal(isEdit?"Edit Sale":"Record Sale",
    (body)=>{
      const dateInp=formField(body,"Sale Date","date",data.saleDate);
      const row1=formRow(body);
      const buyerInp=formField(row1,"Buyer Name","text",data.buyerName);
      const contactInp=formField(row1,"Buyer Contact","text",data.buyerContact,{placeholder:"Phone, email, etc."});
      const litterSel=formField(body,"From Litter (optional)","select",data.litterId,
        [{value:"",label:"\u2014 Select or leave blank \u2014"},...S.litters.map(l=>{
          const sow=sowById(l.sowId);
          return {value:l.id,label:(sow?sow.name:"?")+" \u2014 "+fmtShort(l.birthDate)+" ("+l.bornAlive+" born)"};
        })]
      );
      const sourceInp=formField(body,"Source (if not from litter)","text",data.source);
      const row2=formRow(body);
      const headInp=formField(row2,"Head Count","number",data.headCount,{min:1});
      const pphInp=formField(row2,"Price Per Head ($)","number",data.pricePerHead,{min:0,step:"0.01"});
      const totalInp=formField(body,"Total Price ($)","number",data.totalPrice,{min:0,step:"0.01"});

      // Auto-calc total
      function recalc(){
        const heads=parseInt(headInp.value)||0;
        const pph=parseFloat(pphInp.value)||0;
        totalInp.value=(heads*pph).toFixed(2);
      }
      headInp.oninput=recalc;
      pphInp.oninput=recalc;

      const notesInp=formField(body,"Notes","textarea",data.notes);
      body._refs={dateInp,buyerInp,contactInp,litterSel,sourceInp,headInp,pphInp,totalInp,notesInp};
    },
    (footer)=>{
      const saveBtn=h("button","btn btn-primary","Save");
      saveBtn.onclick=()=>{
        const r=$("#modal-body")._refs;
        const obj={
          saleDate:r.dateInp.value,
          buyerName:r.buyerInp.value.trim(),
          buyerContact:r.contactInp.value.trim(),
          litterId:r.litterSel.value||null,
          source:r.sourceInp.value,
          headCount:parseInt(r.headInp.value)||0,
          pricePerHead:parseFloat(r.pphInp.value)||0,
          totalPrice:parseFloat(r.totalInp.value)||0,
          notes:r.notesInp.value
        };
        if(isEdit)Object.assign(sale,obj);
        else S.sales.push({id:uid(),...obj});

        // Mark piglets as sold if litter selected
        if(obj.litterId){
          const litter=S.litters.find(l=>l.id===obj.litterId);
          if(litter&&litter.piglets){
            let count=obj.headCount;
            litter.piglets.forEach(p=>{
              if(count>0&&p.status!=="sold"&&p.status!=="dead"){
                p.status="sold";
                p.soldTo=obj.buyerName;
                p.salePrice=obj.pricePerHead;
                count--;
              }
            });
          }
        }

        save();closeModal();renderSales();
        showToast("Sale "+(isEdit?"updated":"recorded")+"!");
      };
      footer.appendChild(saveBtn);
      if(isEdit){
        const delBtn=h("button","btn btn-danger","Delete");
        delBtn.onclick=()=>{S.sales=S.sales.filter(s=>s.id!==sale.id);save();closeModal();renderSales();};
        footer.appendChild(delBtn);
      }
      footer.appendChild(h("button","btn btn-ghost","Cancel")).onclick=closeModal;
    }
  );
}

// ============================================================
// PHOTO FEED — PIG INSTAGRAM
// ============================================================
function renderFeed(){
  const P=$("#panel-feed"); P.innerHTML="";

  // Post button
  const hdrRow=h("div","section-title-row");
  hdrRow.appendChild(h("div","section-title","Pig Feed"));
  const postBtn=h("button","btn btn-primary","+ New Post");
  postBtn.onclick=openNewPostModal;
  hdrRow.appendChild(postBtn);
  P.appendChild(hdrRow);

  if(S.photos.length===0){
    const empty=h("div","empty-state");
    empty.appendChild(h("div","empty-icon","\uD83D\uDCF8"));
    empty.appendChild(h("div","empty-text","No posts yet. Share photos of your herd!"));
    const btn=h("button","btn btn-primary","Create First Post");
    btn.onclick=openNewPostModal;
    empty.appendChild(btn);
    P.appendChild(empty);
    return;
  }

  const grid=h("div","feed-grid");
  [...S.photos].sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp)).forEach(photo=>{
    const post=h("div","feed-post");

    // Header
    const header=h("div","feed-post-header");
    const avatar=h("div","feed-avatar","\uD83D\uDC37");
    header.appendChild(avatar);
    const authorInfo=h("div","");
    authorInfo.appendChild(h("div","feed-author",photo.animalName||"Farm Post"));
    authorInfo.appendChild(h("div","feed-time",timeAgo(photo.timestamp)));
    header.appendChild(authorInfo);
    // Delete button
    const delPostBtn=h("button","btn btn-sm btn-ghost","\u2717");
    delPostBtn.style.marginLeft="auto";
    delPostBtn.onclick=(e)=>{
      e.stopPropagation();
      S.photos=S.photos.filter(p=>p.id!==photo.id);
      save();renderFeed();
    };
    header.appendChild(delPostBtn);
    post.appendChild(header);

    // Image
    const imgWrap=h("div","feed-image-wrap");
    if(photo.imageData){
      const img=document.createElement("img");
      img.src=photo.imageData;
      imgWrap.appendChild(img);
    } else {
      const placeholder=h("div","feed-image-placeholder","\uD83D\uDC37");
      imgWrap.appendChild(placeholder);
    }
    post.appendChild(imgWrap);

    // Caption
    const body=h("div","feed-body");
    body.appendChild(h("div","feed-caption",photo.caption||""));
    if(photo.tags&&photo.tags.length>0){
      const tagsDiv=h("div","");
      tagsDiv.style.cssText="display:flex;gap:4px;flex-wrap:wrap";
      photo.tags.forEach(t=>{
        tagsDiv.appendChild(h("span","badge badge-open","#"+t));
      });
      body.appendChild(tagsDiv);
    }
    post.appendChild(body);

    // Actions
    const actions=h("div","feed-actions");
    const likeBtn=h("button","feed-action-btn"+(photo.liked?" liked":""));
    likeBtn.innerHTML=(photo.liked?"\u2764\uFE0F":"\uD83E\uDD0D")+" "+(photo.likes||0);
    likeBtn.onclick=()=>{
      photo.liked=!photo.liked;
      photo.likes=(photo.likes||0)+(photo.liked?1:-1);
      save();renderFeed();
    };
    actions.appendChild(likeBtn);

    const commentCount=(photo.comments||[]).length;
    const commentBtn=h("button","feed-action-btn","\uD83D\uDCAC "+commentCount);
    actions.appendChild(commentBtn);
    post.appendChild(actions);

    // Comments
    if(photo.comments&&photo.comments.length>0){
      const commentsDiv=h("div","feed-comments");
      photo.comments.forEach(c=>{
        const cm=h("div","feed-comment");
        cm.innerHTML=`<strong>${c.author||"You"}</strong> ${c.text}`;
        commentsDiv.appendChild(cm);
      });
      post.appendChild(commentsDiv);
    }

    // Comment input
    const commentInputDiv=h("div","feed-comment-input");
    const commentInp=document.createElement("input");
    commentInp.placeholder="Add a comment...";
    commentInputDiv.appendChild(commentInp);
    const sendBtn=h("button","","Post");
    sendBtn.onclick=()=>{
      if(!commentInp.value.trim())return;
      if(!photo.comments)photo.comments=[];
      photo.comments.push({author:"You",text:commentInp.value.trim(),timestamp:new Date().toISOString()});
      save();renderFeed();
    };
    commentInp.onkeydown=(e)=>{if(e.key==="Enter")sendBtn.click();};
    commentInputDiv.appendChild(sendBtn);
    post.appendChild(commentInputDiv);

    grid.appendChild(post);
  });
  P.appendChild(grid);
}

function openNewPostModal(){
  openModal("New Post",
    (body)=>{
      // Animal selector
      const allAnimals=[
        ...activeSows().map(s=>({id:s.id,name:s.name,type:"sow"})),
        ...activeBoars().map(b=>({id:b.id,name:b.name,type:"boar"}))
      ];
      const animalSel=formField(body,"Tag an Animal","select","",
        [{value:"",label:"\u2014 No animal \u2014"},...allAnimals.map(a=>({value:a.id,label:a.name+" ("+a.type+")"}))]
      );

      const captionInp=formField(body,"Caption","textarea","");
      const tagsInp=formField(body,"Tags (comma separated)","text","",{placeholder:"piglet, champion, farmlife"});

      // Photo upload
      const uploadArea=h("div","upload-area");
      uploadArea.innerHTML=`<div class="upload-icon">\uD83D\uDCF7</div><div class="upload-text">Click to upload a photo</div>`;
      let imageData="";
      const fileInp=document.createElement("input");
      fileInp.type="file";fileInp.accept="image/*";fileInp.style.display="none";
      fileInp.onchange=(e)=>{
        const file=e.target.files[0];if(!file)return;
        const reader=new FileReader();
        reader.onload=(ev)=>{
          imageData=ev.target.result;
          uploadArea.innerHTML=`<div class="upload-icon">\u2705</div><div class="upload-text">Photo loaded!</div>`;
          const prev=document.createElement("img");
          prev.src=imageData;prev.className="upload-preview";
          uploadArea.appendChild(prev);
        };
        reader.readAsDataURL(file);
      };
      uploadArea.onclick=()=>fileInp.click();
      body.appendChild(uploadArea);
      body.appendChild(fileInp);

      body._refs={animalSel,captionInp,tagsInp,getImage:()=>imageData};
    },
    (footer)=>{
      const postBtn=h("button","btn btn-primary","Post");
      postBtn.onclick=()=>{
        const r=$("#modal-body")._refs;
        const animalId=r.animalSel.value;
        const animal=animalId?(sowById(animalId)||boarById(animalId)):null;
        const tags=r.tagsInp.value.split(",").map(t=>t.trim()).filter(t=>t);

        S.photos.push({
          id:uid(),
          animalId:animalId||null,
          animalName:animal?animal.name:"Farm Post",
          caption:r.captionInp.value,
          imageData:r.getImage(),
          tags,
          likes:0,liked:false,
          comments:[],
          timestamp:new Date().toISOString()
        });
        save();closeModal();renderFeed();
        showToast("Post shared!");
      };
      footer.appendChild(postBtn);
      footer.appendChild(h("button","btn btn-ghost","Cancel")).onclick=closeModal;
    }
  );
}

// ============================================================
// EXPORT / IMPORT / RESET
// ============================================================
function exportData(){
  const blob=new Blob([JSON.stringify(S,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download="porkpal-backup-"+today()+".json";
  a.click();URL.revokeObjectURL(url);
  showToast("Data exported!");
}

function importData(){
  $("#file-import").click();
}

function handleImport(e){
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=(ev)=>{
    try{
      const data=JSON.parse(ev.target.result);
      if(data.sows||data.boars||data.breedings){
        S=data;save();
        showToast("Data imported successfully!");
        switchTab(S.activeTab||"dashboard");
      } else {
        showToast("Invalid backup file");
      }
    }catch(err){
      showToast("Error reading file: "+err.message);
    }
  };
  reader.readAsText(file);
  e.target.value="";
}

function resetData(){
  if(confirm("Are you sure you want to reset ALL data? This cannot be undone.")){
    S=DEFAULT();save();
    showToast("All data reset.");
    switchTab("dashboard");
  }
}

// ============================================================
// DEMO DATA
// ============================================================
function seedDemoData(){
  // Boars
  const boars=[
    {id:uid(),name:"Thunder",tagNumber:"B-001",breed:"Duroc",dob:"2023-03-15",weight:380,status:"Active",parity:0,notes:"Proven sire, excellent conformation.",photoData:"",active:true},
    {id:uid(),name:"Atlas",tagNumber:"B-002",breed:"Yorkshire",dob:"2023-06-20",weight:350,status:"Active",parity:0,notes:"Young boar, good temperament.",photoData:"",active:true},
    {id:uid(),name:"Goliath",tagNumber:"B-003",breed:"Hampshire",dob:"2022-11-10",weight:420,status:"Active",parity:0,notes:"Senior herd boar.",photoData:"",active:true}
  ];

  // Sows
  const sows=[
    {id:uid(),name:"Rosie",tagNumber:"S-001",breed:"Yorkshire",dob:"2023-01-10",weight:310,status:"Nursing",parity:3,notes:"Top producer.",photoData:"",active:true},
    {id:uid(),name:"Daisy",tagNumber:"S-002",breed:"Landrace",dob:"2023-04-22",weight:290,status:"Confirmed",parity:2,notes:"Gentle, good mother.",photoData:"",active:true},
    {id:uid(),name:"Bella",tagNumber:"S-003",breed:"Berkshire",dob:"2023-07-05",weight:275,status:"Open",parity:1,notes:"First litter was 10 alive.",photoData:"",active:true},
    {id:uid(),name:"Luna",tagNumber:"S-004",breed:"Duroc",dob:"2023-02-18",weight:320,status:"Bred",parity:2,notes:"",photoData:"",active:true},
    {id:uid(),name:"Penny",tagNumber:"S-005",breed:"Hampshire",dob:"2023-09-01",weight:265,status:"Open",parity:0,notes:"Maiden gilt.",photoData:"",active:true},
    {id:uid(),name:"Maple",tagNumber:"S-006",breed:"Spotted",dob:"2022-12-03",weight:340,status:"Weaned",parity:4,notes:"High fertility.",photoData:"",active:true},
    {id:uid(),name:"Clover",tagNumber:"S-007",breed:"Chester White",dob:"2023-05-14",weight:285,status:"Dry",parity:1,notes:"",photoData:"",active:true},
    {id:uid(),name:"Hazel",tagNumber:"S-008",breed:"Tamworth",dob:"2023-08-30",weight:260,status:"Open",parity:0,notes:"Heritage breed gilt.",photoData:"",active:true}
  ];

  S.boars=boars;
  S.sows=sows;

  // Semen inventory
  S.semen=[
    {id:uid(),boarName:"Champion Rex",boarBreed:"Duroc",source:"GenePro AI Center",dateCollected:"2025-12-01",expiryDate:"2026-06-01",doses:20,usedDoses:5,storageLocation:"Tank A - Shelf 1",notes:"Premium genetics"},
    {id:uid(),boarName:"Iron Duke",boarBreed:"Hampshire",source:"Southern Genetics",dateCollected:"2025-11-15",expiryDate:"2026-05-15",doses:15,usedDoses:3,storageLocation:"Tank A - Shelf 2",notes:""},
    {id:uid(),boarName:"Blue Steel",boarBreed:"Yorkshire",source:"MidWest Semen Co",dateCollected:"2026-01-10",expiryDate:"2026-07-10",doses:25,usedDoses:0,storageLocation:"Tank B - Shelf 1",notes:"New acquisition"},
    {id:uid(),boarName:"Maverick",boarBreed:"Pietrain",source:"Elite Swine Genetics",dateCollected:"2025-10-20",expiryDate:"2026-04-20",doses:10,usedDoses:8,storageLocation:"Tank A - Shelf 3",notes:"Running low"}
  ];

  // Breedings
  const breeding1={
    id:uid(),sowId:sows[0].id,boarId:boars[0].id,semenId:null,method:"natural",
    breedDate:"2025-10-15",confirmDate:"2025-11-05",dueDate:"2026-02-06",
    status:"delivered",litterId:null,notes:""
  };
  const breeding2={
    id:uid(),sowId:sows[1].id,boarId:boars[1].id,semenId:null,method:"natural",
    breedDate:"2025-11-20",confirmDate:"2025-12-11",dueDate:"2026-03-14",
    status:"confirmed",litterId:null,notes:""
  };
  const breeding3={
    id:uid(),sowId:sows[3].id,boarId:null,semenId:S.semen[0].id,method:"ai",
    breedDate:"2025-12-28",confirmDate:"2026-01-18",dueDate:"2026-04-21",
    status:"gestating",litterId:null,notes:"AI breeding with Champion Rex semen"
  };
  const breeding4={
    id:uid(),sowId:sows[5].id,boarId:boars[2].id,semenId:null,method:"natural",
    breedDate:"2025-08-10",confirmDate:"2025-08-31",dueDate:"2025-12-02",
    status:"delivered",litterId:null,notes:""
  };
  S.breedings=[breeding1,breeding2,breeding3,breeding4];

  // Litters
  const litter1Piglets=[];
  for(let i=0;i<11;i++){
    litter1Piglets.push({
      id:uid(),name:["Ruby","Garnet","Scarlet","Rusty","Copper","Amber","Ginger","Poppy","Blaze","Ember","Cinnamon"][i],
      sex:i<6?"gilt":"boar",
      birthWeight:Math.round((2.5+Math.random()*1.5)*10)/10,
      color:["Red","Dark Red","Light Red","Spotted","Red/White","Dark Red","Red","Spotted Red","Light","Red","Dark"][i],
      status:i<8?"alive":(i===8?"sold":"alive"),
      soldTo:i===8?"Johnson Farm":null,
      salePrice:i===8?150:null
    });
  }
  const litter1={
    id:uid(),breedingId:breeding1.id,sowId:sows[0].id,sireId:boars[0].id,semenId:null,
    birthDate:"2026-02-06",bornAlive:11,stillborn:1,mummified:0,avgBirthWeight:3.2,
    piglets:litter1Piglets,weanDate:null,notes:"Rosie's 3rd litter, excellent size."
  };
  breeding1.litterId=litter1.id;

  const litter2Piglets=[];
  for(let i=0;i<9;i++){
    litter2Piglets.push({
      id:uid(),name:["Frost","Snow","Ice","Crystal","Winter","Storm","Cloud","Mist","Fog"][i],
      sex:i<5?"gilt":"boar",
      birthWeight:Math.round((2.2+Math.random()*1.2)*10)/10,
      color:"White",
      status:i<4?"sold":"alive",
      soldTo:i<4?"Miller Ranch":null,
      salePrice:i<4?125:null
    });
  }
  const litter2={
    id:uid(),breedingId:breeding4.id,sowId:sows[5].id,sireId:boars[2].id,semenId:null,
    birthDate:"2025-12-02",bornAlive:9,stillborn:0,mummified:1,avgBirthWeight:2.8,
    piglets:litter2Piglets,weanDate:"2025-12-23",avgWeanWeight:12.5,notes:"Maple's 4th litter."
  };
  breeding4.litterId=litter2.id;
  S.litters=[litter1,litter2];

  // Sales
  S.sales=[
    {id:uid(),saleDate:"2026-01-15",buyerName:"Johnson Farm",buyerContact:"(555) 123-4567",litterId:litter1.id,source:"",headCount:1,pricePerHead:150,totalPrice:150,notes:"Young boar for breeding"},
    {id:uid(),saleDate:"2025-12-28",buyerName:"Miller Ranch",buyerContact:"miller@ranch.com",litterId:litter2.id,source:"",headCount:4,pricePerHead:125,totalPrice:500,notes:"4 gilts for their breeding program"},
    {id:uid(),saleDate:"2025-11-10",buyerName:"County Fair Buyer",buyerContact:"",litterId:null,source:"Market hogs",headCount:6,pricePerHead:200,totalPrice:1200,notes:"Market weight finishers"},
    {id:uid(),saleDate:"2025-10-05",buyerName:"Green Acres Farm",buyerContact:"(555) 987-6543",litterId:null,source:"Weaned pigs",headCount:10,pricePerHead:80,totalPrice:800,notes:"Feeder pigs"}
  ];

  // Feed photos
  S.photos=[
    {id:uid(),animalId:sows[0].id,animalName:"Rosie",caption:"Rosie just farrowed 11 beautiful piglets! What a champion mama \uD83D\uDC37\u2764\uFE0F",imageData:"",tags:["farrowing","proudmama","newborns"],likes:24,liked:true,comments:[
      {author:"FarmFriend",text:"Amazing litter! Rosie is a star!",timestamp:"2026-02-06T10:30:00"},
      {author:"PigLover99",text:"Those piglets are adorable!",timestamp:"2026-02-06T11:15:00"},
      {author:"You",text:"Thanks everyone! She's doing great!",timestamp:"2026-02-06T12:00:00"}
    ],timestamp:"2026-02-06T08:00:00"},
    {id:uid(),animalId:boars[0].id,animalName:"Thunder",caption:"Thunder looking majestic as always. This guy produces the best piglets on the farm.",imageData:"",tags:["herdboar","duroc","genetics"],likes:18,liked:false,comments:[
      {author:"DurocFan",text:"What a specimen! \uD83D\uDD25",timestamp:"2026-01-28T14:20:00"}
    ],timestamp:"2026-01-28T09:00:00"},
    {id:uid(),animalId:sows[5].id,animalName:"Maple",caption:"Maple's litter at 3 weeks old. Growing like weeds! Already hitting 12lb avg \uD83D\uDCAA",imageData:"",tags:["piglets","growth","weaning"],likes:31,liked:true,comments:[
      {author:"SwineBreeder",text:"Great growth rate! What are you feeding?",timestamp:"2025-12-22T16:40:00"},
      {author:"You",text:"Standard starter ration + creep feed from day 7!",timestamp:"2025-12-22T17:00:00"}
    ],timestamp:"2025-12-22T15:00:00"},
    {id:uid(),animalId:null,animalName:"Farm Post",caption:"Beautiful sunset over the farrowing house tonight. Love this life. #farmlife #pigfarmer",imageData:"",tags:["farmlife","sunset","blessed"],likes:42,liked:true,comments:[],timestamp:"2026-01-15T18:30:00"},
    {id:uid(),animalId:sows[4].id,animalName:"Penny",caption:"Penny settling in well. This maiden gilt has great potential \u2014 looking forward to her first breeding!",imageData:"",tags:["gilt","future","hampshire"],likes:12,liked:false,comments:[],timestamp:"2026-01-20T10:00:00"}
  ];

  // Facility occupants
  S.facilities.forEach(f=>f.occupants=[]);
  // Put Rosie in farrowing
  const farrowingFac=S.facilities.find(f=>f.type==="farrowing");
  if(farrowingFac){
    farrowingFac.occupants[0]={sowId:sows[0].id,since:"2026-02-04"};
  }
  // Put Daisy in gestation
  const gestFac=S.facilities.find(f=>f.type==="gestation");
  if(gestFac){
    gestFac.occupants[0]={sowId:sows[1].id,since:"2025-11-22"};
    gestFac.occupants[1]={sowId:sows[3].id,since:"2025-12-30"};
  }
  // Put some in breeding barn
  const breedFac=S.facilities.find(f=>f.type==="breeding");
  if(breedFac){
    breedFac.occupants[0]={sowId:sows[2].id,since:"2026-02-01"};
    breedFac.occupants[1]={sowId:sows[4].id,since:"2026-02-03"};
  }

  save();
  showToast("Demo data loaded!");
  switchTab("dashboard");
}

// ============================================================
// INIT
// ============================================================
function init(){
  load();
  updateHeader();

  // Tab clicks
  $$(".tab").forEach(t=>{
    t.addEventListener("click",()=>switchTab(t.dataset.tab));
  });

  // Modal
  $("#modal-close").addEventListener("click",closeModal);
  $("#modal-overlay").addEventListener("click",(e)=>{
    if(e.target===$("#modal-overlay"))closeModal();
  });

  // Header buttons
  $("#btn-export").addEventListener("click",exportData);
  $("#btn-import").addEventListener("click",importData);
  $("#btn-reset").addEventListener("click",resetData);
  $("#file-import").addEventListener("change",handleImport);

  // Load demo data if empty
  if(S.sows.length===0&&S.boars.length===0){
    seedDemoData();
  }

  switchTab(S.activeTab||"dashboard");
}

init();
})();
