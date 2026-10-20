/* Haven Residence frontend demo.
   The UI currently uses localStorage so the pages work before the Java/JDBC API is connected.
   Replace the demo storage functions with fetch() calls to your Java Servlet endpoints when ready. */
const $ = (selector, root=document) => root.querySelector(selector);
const page = document.body.dataset.page || "";
const navItems = [
  ["dashboard.html","◫","Dashboard","dashboard"],
  ["students.html","♙","Students","student"],
  ["rooms.html","⌂","Rooms","room"],
  ["applications.html","▤","Applications","application"],
  ["allocations.html","⇄","Allocations","allocation"],
  ["payments.html","₹","Payments","payment"]
];
function renderSidebar(){
  const el=$("#sidebar"); if(!el) return;
  const active=page;
  el.innerHTML=`<a class="brand" href="dashboard.html"><span class="brand-mark">H</span><span>haven<span class="brand-dot">.</span></span></a>
    <div class="nav-label">WORKSPACE</div><nav class="nav-list">${navItems.map(([href,icon,label,key])=>`<a class="nav-link ${active===key?'active':''}" href="${href}"><span class="nav-icon">${icon}</span><span>${label}</span>${key==="application"?'<span class="nav-count">18</span>':''}</a>`).join("")}</nav>
    <div class="sidebar-bottom"><div class="help-card"><strong>Need a hand?</strong><p>Find tips for managing your residence and student records.</p><a href="#" onclick="alert('Contact your project administrator for help.');return false;">Visit help centre ↗</a></div><div class="sidebar-user"><div class="avatar">AD</div><div><strong>Administrator</strong><span>Residence manager</span></div><a class="logout" href="login.html" title="Sign out">↗</a></div></div>`;
}
function getStore(key, fallback){try{const value=localStorage.getItem("haven_"+key);return value?JSON.parse(value):fallback}catch{return fallback}}
function setStore(key,value){localStorage.setItem("haven_"+key,JSON.stringify(value))}
const seed={
 student:[
  {name:"Aarav Sharma",regNo:"VIT2026012",email:"aarav.sharma@example.edu",phone:"9876543210",gender:"Male",department:"Computer Science"},
  {name:"Meera Iyer",regNo:"VIT2026048",email:"meera.iyer@example.edu",phone:"9876543211",gender:"Female",department:"Electronics"},
  {name:"Rohan Das",regNo:"VIT2026075",email:"rohan.das@example.edu",phone:"9876543212",gender:"Male",department:"Mechanical"}
 ],
 room:[
  {roomNo:"A-101",block:"A Block",roomType:"2 Sharing",capacity:"2",occupied:"1",status:"Partially occupied"},
  {roomNo:"A-102",block:"A Block",roomType:"Single",capacity:"1",occupied:"0",status:"Available"},
  {roomNo:"B-204",block:"B Block",roomType:"3 Sharing",capacity:"3",occupied:"3",status:"Full"}
 ],
 application:[
  {name:"Aarav Sharma",regNo:"VIT2026012",hostel:"A Block",roomType:"2 Sharing",date:"2026-10-10",status:"Pending"},
  {name:"Meera Iyer",regNo:"VIT2026048",hostel:"B Block",roomType:"Single",date:"2026-10-09",status:"Approved"},
  {name:"Rohan Das",regNo:"VIT2026075",hostel:"A Block",roomType:"3 Sharing",date:"2026-10-08",status:"Pending"}
 ],
 allocation:[
  {name:"Meera Iyer",regNo:"VIT2026048",hostel:"B Block",roomNo:"B-204",date:"2026-10-01",status:"Active"},
  {name:"Aarav Sharma",regNo:"VIT2026012",hostel:"A Block",roomNo:"A-101",date:"2026-10-04",status:"Active"},
  {name:"Rohan Das",regNo:"VIT2026075",hostel:"A Block",roomNo:"A-203",date:"2026-09-21",status:"Pending"}
 ],
 payment:[
  {name:"Meera Iyer",regNo:"VIT2026048",amount:"45000",date:"2026-10-01",method:"Online",status:"Paid"},
  {name:"Aarav Sharma",regNo:"VIT2026012",amount:"22500",date:"2026-10-05",method:"UPI",status:"Pending"},
  {name:"Rohan Das",regNo:"VIT2026075",amount:"45000",date:"2026-10-07",method:"Bank transfer",status:"Paid"}
 ]
};
function records(){return getStore(page,seed[page]||[])}
function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function statusClass(value){return String(value||"").toLowerCase().replace(/\s+/g,"-")}
function recordId(row){return row.regNo||row.roomNo||row.name}
function initials(name){return String(name||"?").split(/\s+/).slice(0,2).map(s=>s[0]||"").join("").toUpperCase()}
function renderRecentStudents(){
 const body=$("#recentStudents");if(!body)return;
 const rows=getStore("student",seed.student).slice(0,4);
 body.innerHTML=rows.map((r,i)=>`<tr><td><div class="student-cell"><span class="mini-avatar">${escapeHtml(initials(r.name))}</span><span><strong>${escapeHtml(r.name)}</strong><small>${escapeHtml(r.email||"Student profile")}</small></span></div></td><td>${escapeHtml(r.regNo)}</td><td>${["A-101","B-204","A-203"][i]||"Not assigned"}</td><td><span class="status ${i===2?'pending':''}">${i===2?'Pending':'Active'}</span></td><td>${["Oct 04, 2026","Oct 01, 2026","Sep 21, 2026"][i]||"—"}</td></tr>`).join("");
}
const fieldDefs={
 student:[["name","Student name","text",true],["regNo","Registration number","text",true],["email","Email address","email",true],["phone","Phone number","tel",true],["gender","Gender","select",true,["Female","Male","Other"]],["department","Department","text",true]],
 room:[["roomNo","Room number","text",true],["block","Hostel block","select",true,["A Block","B Block","C Block","D Block"]],["roomType","Room type","select",true,["Single","2 Sharing","3 Sharing","4 Sharing"]],["capacity","Bed capacity","number",true],["occupied","Occupied beds","number",true],["status","Status","select",true,["Available","Partially occupied","Full"]]],
 application:[["name","Student name","text",true],["regNo","Registration number","text",true],["hostel","Preferred hostel","select",true,["A Block","B Block","C Block","D Block"]],["roomType","Room type","select",true,["Single","2 Sharing","3 Sharing","4 Sharing"]],["date","Application date","date",true],["status","Status","select",true,["Pending","Approved","Rejected"]]],
 allocation:[["name","Student name","text",true],["regNo","Registration number","text",true],["hostel","Hostel block","select",true,["A Block","B Block","C Block","D Block"]],["roomNo","Room number","text",true],["date","Check-in date","date",true],["status","Status","select",true,["Active","Pending","Completed"]]],
 payment:[["name","Student name","text",true],["regNo","Registration number","text",true],["amount","Amount (INR)","number",true],["date","Payment date","date",true],["method","Payment method","select",true,["Online","UPI","Cash","Bank transfer"]],["status","Status","select",true,["Paid","Pending","Failed"]]]
};
function displayValue(key,val){if(key==="amount")return "₹ "+Number(val||0).toLocaleString("en-IN");return val??"—"}
function renderRecords(){
 const body=$("#recordsBody");if(!body)return;
 const search=($("#searchInput")?.value||"").toLowerCase().trim(),filter=$("#statusFilter")?.value||"";
 const all=records();const rows=all.filter(r=>(!search||Object.values(r).some(v=>String(v).toLowerCase().includes(search)))&&(!filter||r.status===filter));
 const keys=fieldDefs[page]||[];
 body.innerHTML=rows.map((r)=>`<tr>${keys.map(([key])=>`<td>${key==="status"?`<span class="status ${statusClass(r[key])}">${escapeHtml(r[key]||"—")}</span>`:key==="name"?`<div class="student-cell"><span class="mini-avatar">${escapeHtml(initials(r.name))}</span><strong>${escapeHtml(r[key]||"—")}</strong></div>`:escapeHtml(displayValue(key,r[key]))}</td>`).join("")}<td><div class="table-actions"><button class="table-action" data-edit="${escapeHtml(recordId(r))}">Edit</button><button class="table-action delete" data-delete="${escapeHtml(recordId(r))}">Delete</button></div></td></tr>`).join("");
 $("#recordCount").textContent=`${rows.length} record${rows.length===1?"":"s"}`;
 $("#emptyState")?.classList.toggle("hidden",rows.length>0);
 body.querySelectorAll("[data-edit]").forEach(b=>b.addEventListener("click",()=>openModal(b.dataset.edit)));
 body.querySelectorAll("[data-delete]").forEach(b=>b.addEventListener("click",()=>deleteRecord(b.dataset.delete)));
}
function openModal(id=null){
 const modal=$("#modalBackdrop"),form=$("#recordForm"),fields=$("#formFields");if(!modal||!form||!fields)return;
 const row=id?records().find(r=>recordId(r)===id):null;
 $("#modalTitle").textContent=(row?"Edit ":"Add ")+({student:"student",room:"room",application:"application",allocation:"allocation",payment:"payment"}[page]||"record");
 fields.innerHTML=(fieldDefs[page]||[]).map(([key,label,type,required,options])=>`<label>${label}${type==="select"?`<select name="${key}" ${required?"required":""}><option value="">Choose ${label.toLowerCase()}</option>${options.map(o=>`<option ${row&&String(row[key])===o?"selected":""}>${o}</option>`).join("")}</select>`:`<input name="${key}" type="${type}" value="${escapeHtml(row?.[key]??"")}" ${required?"required":""} ${type==="number"?'min="0"':""} placeholder="Enter ${label.toLowerCase()}">`}</label>`).join("");
 form.dataset.editId=id||"";
 $("#formError").textContent="";
 modal.classList.remove("hidden");
}
function closeModal(){$("#modalBackdrop")?.classList.add("hidden")}
function deleteRecord(id){
 if(!confirm("Delete this record from the frontend demo?"))return;
 const next=records().filter(r=>recordId(r)!==id);setStore(page,next);renderRecords();
}
function saveRecord(e){
 e.preventDefault();const form=e.currentTarget;const data=Object.fromEntries(new FormData(form).entries());
 const error=$("#formError");error.textContent="";
 if(page==="student"&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)){error.textContent="Enter a valid email address.";return}
 if(page==="room"&&(Number(data.occupied)>Number(data.capacity))){error.textContent="Occupied beds cannot exceed room capacity.";return}
 const list=records(),id=form.dataset.editId;
 if(page==="student"&&list.some(r=>r.regNo===data.regNo&&r.regNo!==id)){error.textContent="A student with this registration number already exists.";return}
 if(page==="room"&&list.some(r=>r.roomNo===data.roomNo&&r.roomNo!==id)){error.textContent="This room number already exists.";return}
 if(page==="room"){data.status=Number(data.occupied)===0?"Available":Number(data.occupied)>=Number(data.capacity)?"Full":"Partially occupied"}
 let next;
 if(id){next=list.map(r=>recordId(r)===id?data:r)}else{next=[data,...list]}
 setStore(page,next);closeModal();renderRecords();
}
function setupLogin(){
 const form=$("#loginForm");if(!form)return;
 $("#togglePassword")?.addEventListener("click",()=>{const input=$("#password");const show=input.type==="password";input.type=show?"text":"password";$("#togglePassword").textContent=show?"Hide":"Show"});
 form.addEventListener("submit",e=>{e.preventDefault();const email=$("#email").value.trim();const password=$("#password").value;const msg=$("#loginMessage");if(!email||!password){msg.textContent="Please complete both fields.";return}sessionStorage.setItem("haven_demo_user",email);msg.style.color="#4c805c";msg.textContent="Signed in. Opening your dashboard…";setTimeout(()=>location.href="dashboard.html",350)});
}
function setupPage(){
 renderSidebar();
 $("#menuToggle")?.addEventListener("click",()=>$("#sidebar")?.classList.toggle("open"));
 if(page==="dashboard"){renderRecentStudents();return}
 if(fieldDefs[page]){
  renderRecords();$("#searchInput")?.addEventListener("input",renderRecords);$("#statusFilter")?.addEventListener("change",renderRecords);
  $("#addRecordBtn")?.addEventListener("click",()=>openModal());$("#closeModal")?.addEventListener("click",closeModal);$("#cancelModal")?.addEventListener("click",closeModal);
  $("#modalBackdrop")?.addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal()});
  $("#recordForm")?.addEventListener("submit",saveRecord);
 }
}
document.addEventListener("DOMContentLoaded",()=>{setupLogin();setupPage()});
