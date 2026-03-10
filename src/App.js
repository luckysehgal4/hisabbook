import { useState, useEffect } from "react"; import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts"; /* ═══════════════════════════════════════════════════════════ HISABBOOK — Personal Expense Tracker All-in-one: Fuel, Grocery, Bills, Rent, Medical & more ═══════════════════════════════════════════════════════════ */ // ─── CONSTANTS ────────────────────────────────────────────── const STORE_KEY = "hisabbook_v2"; const CATS = ["Fuel","Grocery","Bills","Rent","Medical","Household","Maintenance","Other"]; const CI = {Fuel:"⛽",Grocery:"🛒",Bills:"💡",Rent:"🏠",Medical:"💊",Household:"🏡",Maintenance:"🔧",Other:"📦"}; const CC = {Fuel:"#f97316",Grocery:"#16a34a",Bills:"#2563eb",Rent:"#7c3aed",Medical:"#dc2626",Household:"#0891b2",Maintenance:"#ca8a04",Other:"#6b7280"}; const CB = {Fuel:"#fff7ed",Grocery:"#f0fff4",Bills:"#eff6ff",Rent:"#faf5ff",Medical:"#fef2f2",Household:"#ecfeff",Maintenance:"#fefce8",Other:"#f9fafb"}; const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; const MF = ["January","February","March","April","May","June","July","August","September","October","November","December"]; // ─── TRANSLATIONS ──────────────────────────────────────────── const T = { en:{ app:"HisabBook",tag:"Your Personal Expense Tracker", home:"Home",add:"Add",rec:"Records",chart:"Charts",exp:"Export", addTitle:"Add New Entry",invNo:"Invoice No.",date:"Date",cat:"Category", amt:"Amount (₹)",qty:"Qty / Litres",note:"Note", upload:"Attach Bill / Invoice Photo",camHint:"Camera or gallery — auto compressed", save:"Save Entry",monthTotal:"Month Total",yearTotal:"Year Total", fuelM:"Fuel This Month",recent:"Recent Entries",noData:"No entries yet", start:"Tap ➕ to add your first entry",filter:"Filter",allCats:"All Categories", delTitle:"Delete entry?",delMsg:"This action cannot be undone.", cancel:"Cancel",del:"Delete",monthly:"Monthly Report",annual:"Annual Report", catDl:"Category Wise Export",dlPdf:"Download PDF", summ:"Summary",breakdown:"Category Breakdown",trend:"Monthly Trend", saved:"✅ Entry saved!",deleted:"🗑 Deleted",err:"❌ Error, try again", gen:"Generating PDF…",noMonth:"No entries this month", attached:"Bill attached",change:"Change photo", entries:"entries",invoices:"invoices",viewClose:"Close", yearSumm:"Year Summary",monthWise:"Month Wise",selectScope:"Select Period", totalLabel:"Total Expenses",noImg:"No invoice",tapBill:"Tap entry with 📎 to view bill", langTitle:"Choose Language", catNames:{Fuel:"Fuel",Grocery:"Grocery",Bills:"Bills",Rent:"Rent",Medical:"Medical",Household:"Household",Maintenance:"Maintenance",Other:"Other"}, }, hi:{ app:"हिसाब बुक",tag:"आपका खर्च ट्रैकर", home:"होम",add:"जोड़ें",rec:"रिकॉर्ड",chart:"चार्ट",exp:"डाउनलोड", addTitle:"नई एंट्री जोड़ें",invNo:"बिल नंबर",date:"तारीख",cat:"श्रेणी", amt:"राशि (₹)",qty:"मात्रा / लीटर",note:"नोट", upload:"बिल / फोटो अपलोड करें",camHint:"कैमरा या गैलरी — ऑटो कम्प्रेस", save:"सेव करें",monthTotal:"इस महीने",yearTotal:"इस साल", fuelM:"ईंधन इस महीने",recent:"हाल की एंट्री",noData:"अभी कोई एंट्री नहीं", start:"➕ दबाएं पहली एंट्री जोड़ने के लिए",filter:"फ़िल्टर",allCats:"सभी श्रेणी", delTitle:"एंट्री डिलीट करें?",delMsg:"यह वापस नहीं होगा।", cancel:"रद्द करें",del:"डिलीट करें",monthly:"मासिक रिपोर्ट",annual:"वार्षिक रिपोर्ट", catDl:"श्रेणी अनुसार",dlPdf:"PDF डाउनलोड", summ:"सारांश",breakdown:"श्रेणी विवरण",trend:"मासिक ट्रेंड", saved:"✅ एंट्री सेव हो गई!",deleted:"🗑 डिलीट हो गई",err:"❌ त्रुटि, फिर कोशिश करें", gen:"PDF बन रही है…",noMonth:"इस महीने कोई एंट्री नहीं", attached:"फोटो जुड़ गई",change:"फोटो बदलें", entries:"एंट्री",invoices:"बिल",viewClose:"बंद करें", yearSumm:"साल का सारांश",monthWise:"महीनेवार",selectScope:"समयावधि चुनें", totalLabel:"कुल खर्च",noImg:"बिल नहीं",tapBill:"📎 एंट्री दबाएं बिल देखने के लिए", langTitle:"भाषा चुनें", catNames:{Fuel:"ईंधन",Grocery:"किराना",Bills:"बिल",Rent:"किराया",Medical:"दवाई",Household:"घरेलू",Maintenance:"मरम्मत",Other:"अन्य"}, }, hl:{ app:"HisabBook",tag:"Apna Personal Kharcha Tracker", home:"Home",add:"Add",rec:"Records",chart:"Charts",exp:"Export", addTitle:"Naya Kharcha Add Karein",invNo:"Invoice No.",date:"Tarikh",cat:"Category", amt:"Rakam (₹)",qty:"Qty / Litre",note:"Note", upload:"Bill / Invoice Photo Lagaein",camHint:"Camera ya gallery se — auto compress", save:"Entry Save Karein",monthTotal:"Is Mahine",yearTotal:"Is Saal", fuelM:"Fuel Is Mahine",recent:"Recent Entries",noData:"Koi entry nahi hai", start:"➕ dabao pehli entry add karne ke liye",filter:"Filter",allCats:"Sab Categories", delTitle:"Yeh entry delete karein?",delMsg:"Yeh wapas nahi hoga.", cancel:"Cancel",del:"Delete",monthly:"Monthly Report",annual:"Annual Report", catDl:"Category Wise Download",dlPdf:"PDF Download Karein", summ:"Summary",breakdown:"Category Breakdown",trend:"Monthly Trend", saved:"✅ Entry save ho gayi!",deleted:"🗑 Delete ho gayi",err:"❌ Error, dobara try karein", gen:"PDF ban rahi hai…",noMonth:"Is mahine koi entry nahi", attached:"Bill lag gayi",change:"Photo badlo", entries:"entries",invoices:"invoices",viewClose:"Band Karein", yearSumm:"Saal ka Summary",monthWise:"Month Wise",selectScope:"Period Chunein", totalLabel:"Total Kharcha",noImg:"Bill nahi",tapBill:"📎 wali entry dabao bill dekhne ke liye", langTitle:"Bhasha Chunein", catNames:{Fuel:"Fuel",Grocery:"Grocery",Bills:"Bills",Rent:"Rent",Medical:"Medical",Household:"Household",Maintenance:"Maintenance",Other:"Other"}, }, }; // ─── UTILITIES ─────────────────────────────────────────────── function todayStr(){ return new Date().toISOString().split("T")[0]; } function rupee(n){ return "₹"+(n||0).toLocaleString("en-IN"); } function hexRgb(h){ return {r:parseInt(h.slice(1,3),16),g:parseInt(h.slice(3,5),16),b:parseInt(h.slice(5,7),16)}; } async function compressImg(file){ return new Promise(res=>{ const fr=new FileReader(); fr.onload=e=>{ const img=new Image(); img.onload=()=>{ const MAX=800; let {width:w,height:h}=img; if(w>MAX||h>MAX){ if(w>h){h=Math.round(h*MAX/w);w=MAX;}else{w=Math.round(w*MAX/h);h=MAX;} } const cv=document.createElement("canvas"); cv.width=w; cv.height=h; cv.getContext("2d").drawImage(img,0,0,w,h); res(cv.toDataURL("image/jpeg",0.60)); }; img.src=e.target.result; }; fr.readAsDataURL(file); }); } // ─── PDF HELPERS ───────────────────────────────────────────── const ISLOTS=[{x:11,y:26,w:88,h:112},{x:111,y:26,w:88,h:112},{x:11,y:152,w:88,h:112},{x:111,y:152,w:88,h:112}]; function bgPage(doc){ doc.setFillColor(10,22,10); doc.rect(0,0,210,297,"F"); } function addInvoicePages(doc,imgs,label){ const total=Math.ceil(imgs.length/4); for(let i=0;i{ const sl=ISLOTS[j]; try{ const {r,g,b}=hexRgb(CC[en.category]||"#6b7280"); doc.setFillColor(14,30,14); doc.roundedRect(sl.x,sl.y,sl.w,sl.h,2.5,2.5,"F"); doc.setDrawColor(r,g,b); doc.setLineWidth(0.6); doc.roundedRect(sl.x,sl.y,sl.w,sl.h,2.5,2.5,"S"); if(en.image) doc.addImage(en.image,"JPEG",sl.x+1,sl.y+1,sl.w-2,sl.h-26); const cap_y=sl.y+sl.h-24; doc.setFillColor(r*0.3,g*0.3,b*0.3,0.9); doc.rect(sl.x+1,cap_y,sl.w-2,24,"F"); doc.setFontSize(7.5); doc.setFont("helvetica","bold"); doc.setTextColor(255,255,255); doc.text(en.date||"—",sl.x+4,cap_y+7); doc.text(`Rs.${(en.amount||0).toLocaleString("en-IN")}`,sl.x+sl.w-4,cap_y+7,{align:"right"}); doc.setFont("helvetica","normal"); doc.setFontSize(6.5); doc.setTextColor(200,230,200); const line1=`${en.category}${en.invoiceNo?" | #"+en.invoiceNo:""}`; const line2=en.note?en.note.substring(0,28):(en.qty?`Qty: ${en.qty}`:""); doc.text(line1,sl.x+4,cap_y+14,{maxWidth:sl.w-8}); if(line2) doc.text(line2,sl.x+4,cap_y+20,{maxWidth:sl.w-8}); }catch(_){} }); } } function pdfCover(doc,title,sub,count){ bgPage(doc); doc.setFillColor(20,140,20); doc.rect(0,0,210,7,"F"); doc.setFontSize(10); doc.setFont("helvetica","bold"); doc.setTextColor(20,140,20); doc.text("▶ HISABBOOK",105,26,{align:"center"}); doc.setFontSize(22); doc.setTextColor(100,230,100); doc.text(title,105,40,{align:"center"}); doc.setFontSize(11); doc.setTextColor(70,170,70); doc.text(sub,105,50,{align:"center"}); if(count) { doc.setFontSize(9); doc.setTextColor(50,130,50); doc.text(count,105,58,{align:"center"}); } doc.setDrawColor(30,110,30); doc.setLineWidth(0.4); doc.line(15,62,195,62); } function totalBox(doc,label,val,y){ doc.setFillColor(14,40,14); doc.roundedRect(20,y,170,20,3,3,"F"); doc.setDrawColor(40,160,40); doc.setLineWidth(0.4); doc.roundedRect(20,y,170,20,3,3,"S"); doc.setFontSize(8); doc.setFont("helvetica","normal"); doc.setTextColor(70,160,70); doc.text(label,105,y+7.5,{align:"center"}); doc.setFontSize(17); doc.setFont("helvetica","bold"); doc.setTextColor(100,230,100); doc.text(val,105,y+16.5,{align:"center"}); } function sectionHead(doc,label,y){ doc.setFontSize(9.5); doc.setFont("helvetica","bold"); doc.setTextColor(80,200,80); doc.text(label,18,y); doc.setDrawColor(30,100,30); doc.setLineWidth(0.25); doc.line(18,y+2,192,y+2); } async function buildMonthlyPDF(entries,mon,yr){ const {jsPDF}=window.jspdf; const doc=new jsPDF({orientation:"p",unit:"mm",format:"a4"}); const W=210; const me=entries.filter(e=>{const d=new Date(e.date);return d.getMonth()+1===mon&&d.getFullYear()===yr;}).sort((a,b)=>new Date(b.date)-new Date(a.date)); const tot=me.reduce((s,e)=>s+e.amount,0); const mName=MF[mon-1]; pdfCover(doc,`${mName.toUpperCase()} ${yr}`,"MONTHLY EXPENSE REPORT",`${me.length} transactions · ${me.filter(e=>e.image).length} invoices attached`); totalBox(doc,"TOTAL EXPENSES THIS MONTH",`Rs. ${tot.toLocaleString("en-IN")}`,66); let y=96; sectionHead(doc,"CATEGORY BREAKDOWN",y); y+=9; CATS.forEach(c=>{ const a=me.filter(e=>e.category===c).reduce((s,e)=>s+e.amount,0); if(!a) return; if(y>268){doc.addPage();bgPage(doc);y=18;} const {r,g,b}=hexRgb(CC[c]); doc.setFillColor(14,28,14); doc.roundedRect(18,y-4,W-36,10,1.5,1.5,"F"); doc.setFontSize(8.5); doc.setFont("helvetica","normal"); doc.setTextColor(r,g,b); doc.text(`${CI[c]} ${c}`,22,y); doc.setTextColor(220,245,220); doc.setFont("helvetica","bold"); doc.text(`Rs. ${a.toLocaleString("en-IN")}`,183,y,{align:"right"}); const pct=tot?Math.round(a/tot*100):0; doc.setTextColor(80,150,80); doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.text(`${pct}%`,193,y,{align:"right"}); doc.setFillColor(20,50,20); doc.rect(22,y+1.5,130,2,"F"); doc.setFillColor(r,g,b); doc.rect(22,y+1.5,130*(a/tot||0),2,"F"); y+=11; }); y+=6; if(y>250){doc.addPage();bgPage(doc);y=18;} sectionHead(doc,"TRANSACTION DETAILS",y); y+=8; doc.setFontSize(7); doc.setFont("helvetica","bold"); doc.setTextColor(50,130,50); doc.text("DATE",20,y); doc.text("INVOICE#",50,y); doc.text("CATEGORY",82,y); doc.text("QTY",118,y); doc.text("AMOUNT",140,y); doc.text("NOTE",168,y); doc.setDrawColor(25,80,25); doc.line(18,y+2,192,y+2); y+=7; me.forEach((en,idx)=>{ if(y>277){doc.addPage();bgPage(doc);y=18;} if(idx%2===0){doc.setFillColor(13,26,13);doc.rect(18,y-4,174,10,"F");} const {r,g,b}=hexRgb(CC[en.category]||"#6b7280"); doc.setFontSize(7.5); doc.setFont("helvetica","normal"); doc.setTextColor(170,200,170); doc.text(en.date||"—",20,y); doc.setTextColor(140,175,140); doc.text((en.invoiceNo||"—").substring(0,10),50,y); doc.setTextColor(r,g,b); doc.text(en.category,82,y); doc.setTextColor(170,200,170); doc.text(en.qty?String(en.qty).substring(0,8):"—",118,y); doc.setTextColor(220,245,220); doc.setFont("helvetica","bold"); doc.text(`Rs.${(en.amount||0).toLocaleString("en-IN")}`,140,y); doc.setFont("helvetica","normal"); doc.setTextColor(120,160,120); doc.text((en.note||"").substring(0,16),168,y); if(en.image){doc.setTextColor(80,200,80);doc.text("📎",190,y);} y+=10; }); y+=4; if(y>272){doc.addPage();bgPage(doc);y=18;} doc.setFillColor(20,90,20); doc.roundedRect(18,y,174,10,2,2,"F"); doc.setFontSize(9); doc.setFont("helvetica","bold"); doc.setTextColor(180,255,180); doc.text(`${me.length} entries total`,22,y+6.5); doc.text(`Rs. ${tot.toLocaleString("en-IN")}`,190,y+6.5,{align:"right"}); const imgs=me.filter(e=>e.image); if(imgs.length) addInvoicePages(doc,imgs,`${mName} ${yr}`); doc.save(`HisabBook_${mName}_${yr}.pdf`); } async function buildAnnualPDF(entries,yr){ const {jsPDF}=window.jspdf; const doc=new jsPDF({orientation:"p",unit:"mm",format:"a4"}); const W=210; const ye=entries.filter(e=>new Date(e.date).getFullYear()===yr); const tot=ye.reduce((s,e)=>s+e.amount,0); pdfCover(doc,`ANNUAL REPORT ${yr}`,"Complete Year Expense Summary",`${ye.length} entries · ${ye.filter(e=>e.image).length} invoices`); totalBox(doc,`TOTAL ANNUAL EXPENSES — ${yr}`,`Rs. ${tot.toLocaleString("en-IN")}`,66); let y=96; sectionHead(doc,"MONTH-WISE SUMMARY",y); y+=8; doc.setFontSize(7.5); doc.setFont("helvetica","bold"); doc.setTextColor(50,130,50); doc.text("MONTH",20,y); doc.text("ENTRIES",65,y); doc.text("FUEL",100,y); doc.text("OTHERS",130,y); doc.text("TOTAL",165,y); doc.setDrawColor(25,80,25); doc.line(18,y+2,192,y+2); y+=7; let hasAny=false; MF.forEach((mn,i)=>{ const me2=ye.filter(e=>new Date(e.date).getMonth()===i); const mt=me2.reduce((s,e)=>s+e.amount,0); if(!mt){y+=9;return;} hasAny=true; if(y>276){doc.addPage();bgPage(doc);y=18;} const isCur=i===new Date().getMonth()&&yr===new Date().getFullYear(); if(isCur){doc.setFillColor(18,60,18);doc.rect(18,y-4.5,174,10,"F");} const mf2=me2.filter(e=>e.category==="Fuel").reduce((s,e)=>s+e.amount,0); doc.setFontSize(8); doc.setFont("helvetica",isCur?"bold":"normal"); doc.setTextColor(isCur?120:90,isCur?240:190,isCur?120:90); doc.text(mn,20,y); doc.setTextColor(140,180,140); doc.text(`${me2.length}`,68,y); doc.setTextColor(249,115,22); doc.text(mf2?`Rs.${mf2.toLocaleString("en-IN")}`:"—",100,y); const oth=mt-mf2; doc.setTextColor(100,180,100); doc.text(oth?`Rs.${oth.toLocaleString("en-IN")}`:"—",130,y); doc.setTextColor(220,245,220); doc.setFont("helvetica","bold"); doc.text(`Rs.${mt.toLocaleString("en-IN")}`,165,y); y+=9; }); if(!hasAny){doc.setFontSize(9);doc.setTextColor(80,140,80);doc.text("No data",105,y,{align:"center"});y+=12;} y+=6; if(y>248){doc.addPage();bgPage(doc);y=18;} sectionHead(doc,"CATEGORY WISE TOTAL",y); y+=9; CATS.forEach(c=>{ const ca=ye.filter(e=>e.category===c).reduce((s,e)=>s+e.amount,0); if(!ca) return; if(y>272){doc.addPage();bgPage(doc);y=18;} const {r,g,b}=hexRgb(CC[c]); doc.setFillColor(13,28,13); doc.roundedRect(18,y-4.5,W-36,12,2,2,"F"); doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(r,g,b); doc.text(`${CI[c]} ${c}`,22,y); doc.setTextColor(220,245,220); doc.setFont("helvetica","bold"); doc.text(`Rs.${ca.toLocaleString("en-IN")}`,190,y,{align:"right"}); const pct=tot?Math.round(ca/tot*100):0; doc.setTextColor(70,150,70); doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.text(`${pct}%`,155,y); doc.setFillColor(18,45,18); doc.rect(22,y+2,110,2,"F"); doc.setFillColor(r,g,b); doc.rect(22,y+2,110*(ca/tot||0),2,"F"); y+=13; }); const allImgs=ye.filter(e=>e.image).sort((a,b)=>new Date(a.date)-new Date(b.date)); if(allImgs.length) addInvoicePages(doc,allImgs,`ANNUAL ${yr}`); doc.save(`HisabBook_Annual_${yr}.pdf`); } async function buildCatPDF(entries,cat,mon,yr,scopeIsMonth){ const {jsPDF}=window.jspdf; const doc=new jsPDF({orientation:"p",unit:"mm",format:"a4"}); const fe=entries.filter(e=>{ const d=new Date(e.date); const cm=cat==="All"||e.category===cat; if(scopeIsMonth) return cm&&d.getMonth()+1===mon&&d.getFullYear()===yr; return cm&&d.getFullYear()===yr; }).sort((a,b)=>new Date(b.date)-new Date(a.date)); const tot=fe.reduce((s,e)=>s+e.amount,0); const period=scopeIsMonth?`${MF[mon-1]} ${yr}`:`Year ${yr}`; const catLabel=cat==="All"?"All Categories":`${CI[cat]} ${cat}`; pdfCover(doc,catLabel.toUpperCase(),period,`${fe.length} entries · Rs.${tot.toLocaleString("en-IN")}`); totalBox(doc,"TOTAL",`Rs. ${tot.toLocaleString("en-IN")}`,66); let y=94; sectionHead(doc,"TRANSACTION LIST",y); y+=8; doc.setFontSize(7); doc.setFont("helvetica","bold"); doc.setTextColor(50,130,50); doc.text("DATE",20,y); doc.text("INVOICE#",50,y); doc.text("CATEGORY",82,y); doc.text("QTY",118,y); doc.text("AMOUNT",140,y); doc.text("NOTE",168,y); doc.setDrawColor(25,80,25); doc.line(18,y+2,192,y+2); y+=7; fe.forEach((en,idx)=>{ if(y>277){doc.addPage();bgPage(doc);y=18;} if(idx%2===0){doc.setFillColor(13,26,13);doc.rect(18,y-4,174,10,"F");} const {r,g,b}=hexRgb(CC[en.category]||"#6b7280"); doc.setFontSize(7.5); doc.setFont("helvetica","normal"); doc.setTextColor(170,200,170); doc.text(en.date||"—",20,y); doc.setTextColor(140,175,140); doc.text((en.invoiceNo||"—").substring(0,10),50,y); doc.setTextColor(r,g,b); doc.text(en.category,82,y); doc.setTextColor(170,200,170); doc.text(en.qty?String(en.qty).substring(0,8):"—",118,y); doc.setTextColor(220,245,220); doc.setFont("helvetica","bold"); doc.text(`Rs.${(en.amount||0).toLocaleString("en-IN")}`,140,y); doc.setFont("helvetica","normal"); doc.setTextColor(120,160,120); doc.text((en.note||"").substring(0,16),168,y); y+=10; }); y+=4; if(y>272){doc.addPage();bgPage(doc);y=18;} doc.setFillColor(20,90,20);doc.roundedRect(18,y,174,10,2,2,"F"); doc.setFontSize(9);doc.setFont("helvetica","bold");doc.setTextColor(180,255,180); doc.text(`${fe.length} entries`,22,y+6.5); doc.text(`Rs.${tot.toLocaleString("en-IN")}`,190,y+6.5,{align:"right"}); const imgs=fe.filter(e=>e.image); if(imgs.length) addInvoicePages(doc,imgs,`${catLabel} · ${period}`); doc.save(`HisabBook_${cat}_${scopeIsMonth?MO[mon-1]+"_":""}${yr}.pdf`); } // ─── APP CSS ───────────────────────────────────────────────── const CSS=` @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap'); *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent} html,body{background:#f0fff4;font-family:'Baloo 2',sans-serif;overflow-x:hidden} ::-webkit-scrollbar{width:4px;height:4px} ::-webkit-scrollbar-thumb{background:#bbf7d0;border-radius:4px} ::-webkit-scrollbar-track{background:transparent} .inp{width:100%;background:#f0fff4;border:2px solid #bbf7d0;border-radius:13px;padding:13px 16px;font-family:'Baloo 2',sans-serif;font-size:15px;color:#14532d;outline:none;transition:border-color .2s,box-shadow .2s;appearance:none} .inp:focus{border-color:#16a34a;box-shadow:0 0 0 3.5px #16a34a1a} select.inp{cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7'%3E%3Cpath d='M0 0l5 7 5-7z' fill='%2316a34a'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:36px} select.inp option{background:#fff;color:#14532d} .card{background:#fff;border-radius:18px;box-shadow:0 2px 16px #00000009;border:1.5px solid #dcfce7} .btn-main{width:100%;background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;border:none;padding:15px;border-radius:14px;font-family:'Baloo 2',sans-serif;font-size:16px;font-weight:800;cursor:pointer;transition:all .2s;box-shadow:0 5px 18px #16a34a38;letter-spacing:.02em} .btn-main:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 28px #16a34a45} .btn-main:active{transform:translateY(0)} .btn-main:disabled{opacity:.5;cursor:not-allowed} .btn-out{background:#fff;border:2px solid #16a34a;color:#16a34a;padding:12px 20px;border-radius:13px;font-family:'Baloo 2',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s} .btn-out:hover{background:#f0fff4} .btn-del{background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;border:none;padding:12px 20px;border-radius:13px;font-family:'Baloo 2',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 14px #ef444430} .btn-del:hover{transform:translateY(-1px)} .row{background:#fff;border-radius:15px;border:1.5px solid #dcfce7;padding:14px 15px;display:flex;align-items:center;gap:13px;cursor:pointer;transition:all .2s;box-shadow:0 1px 8px #00000007} .row:hover{border-color:#86efac;transform:translateX(3px);box-shadow:0 4px 14px #16a34a10} .chip{border:2px solid;border-radius:22px;padding:5px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:'Baloo 2',sans-serif;transition:all .2s;white-space:nowrap;line-height:1.5} .navbottom{background:#fff;border-top:2px solid #dcfce7;display:flex;justify-content:space-around;padding:7px 0 10px;position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:480px;max-width:100vw;z-index:100;box-shadow:0 -4px 24px #00000010} .nbt{background:none;border:none;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;font-family:'Baloo 2',sans-serif;font-size:10px;font-weight:700;color:#94a3b8;padding:4px 12px 2px;border-radius:12px;transition:all .2s;letter-spacing:.03em} .nbt.on{color:#16a34a} .nbt .ic{font-size:22px;line-height:1.15} .ovl{position:fixed;inset:0;background:#0009;display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(6px);padding:16px} .toast{position:fixed;bottom:82px;left:50%;transform:translateX(-50%);background:#14532d;color:#dcfce7;padding:12px 26px;border-radius:32px;font-size:14px;font-family:'Baloo 2',sans-serif;font-weight:700;z-index:999;white-space:nowrap;animation:tpop .32s ease;box-shadow:0 10px 35px #0005} @keyframes tpop{from{opacity:0;transform:translateX(-50%) translateY(12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}} .hdiv{height:1.5px;background:linear-gradient(90deg,transparent,#dcfce7 30%,#dcfce7 70%,transparent);margin:2px 0 6px} .progress-bar{height:6px;background:#f0fff4;border-radius:4px;overflow:hidden;margin-top:5px} .progress-fill{height:100%;border-radius:4px;transition:width .8s cubic-bezier(.4,0,.2,1)} `; // ─── MAIN APP ───────────────────────────────────────────────── export default function App(){ const [entries,setEntries]=useState([]); const [tab,setTab]=useState("home"); const [lang,setLang]=useState("hl"); const [mon,setMon]=useState(new Date().getMonth()+1); const [yr,setYr]=useState(new Date().getFullYear()); const [loading,setLoading]=useState(true); const [pdfReady,setPdfReady]=useState(false); const [exporting,setExporting]=useState(false); const [toast,setToast]=useState(""); const [viewEntry,setViewEntry]=useState(null); const [delId,setDelId]=useState(null); const [showLang,setShowLang]=useState(false); const [catFilter,setCatFilter]=useState("All"); const [expCat,setExpCat]=useState("All"); const [expMonth,setExpMonth]=useState(true); const [form,setForm]=useState({invoiceNo:"",date:todayStr(),category:"Fuel",amount:"",qty:"",note:"",image:null,imageName:""}); const t=T[lang]; function flash(m){setToast(m);setTimeout(()=>setToast(""),3200);} function sf(k,v){setForm(f=>({...f,[k]:v}));} useEffect(()=>{ const s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"; s.onload=()=>setPdfReady(true); document.head.appendChild(s); (async()=>{ try{const r=await window.storage.get(STORE_KEY);if(r?.value)setEntries(JSON.parse(r.value));}catch(_){} setLoading(false); })(); },[]); async function persist(data){ try{await window.storage.set(STORE_KEY,JSON.stringify(data));}catch(_){flash(t.err);} } async function onImg(e){ const f=e.target.files[0]; if(!f) return; const c=await compressImg(f); sf("image",c); sf("imageName",f.name); } async function submitEntry(){ if(!form.amount||!form.date){flash("⚠️ Date & Amount required");return;} const en={id:Date.now().toString(),invoiceNo:form.invoiceNo.trim(),date:form.date, category:form.category,amount:parseFloat(form.amount)||0,qty:form.qty.trim(), note:form.note.trim(),image:form.image,imageName:form.imageName}; const up=[en,...entries]; setEntries(up); await persist(up); setForm({invoiceNo:"",date:todayStr(),category:"Fuel",amount:"",qty:"",note:"",image:null,imageName:""}); flash(t.saved); setTab("rec"); } async function doDelete(id){ const up=entries.filter(e=>e.id!==id); setEntries(up); await persist(up); setDelId(null); flash(t.deleted); } // Derived const mE=entries.filter(e=>{const d=new Date(e.date);return d.getMonth()+1===mon&&d.getFullYear()===yr;}); const yE=entries.filter(e=>new Date(e.date).getFullYear()===yr); const mTot=mE.reduce((s,e)=>s+e.amount,0); const yTot=yE.reduce((s,e)=>s+e.amount,0); const fuelM=mE.filter(e=>e.category==="Fuel").reduce((s,e)=>s+e.amount,0); const catBrk=CATS.map(c=>({c,v:mE.filter(e=>e.category===c).reduce((s,e)=>s+e.amount,0),col:CC[c]})).filter(x=>x.v>0); const yCatBrk=CATS.map(c=>({c,v:yE.filter(e=>e.category===c).reduce((s,e)=>s+e.amount,0),col:CC[c]})).filter(x=>x.v>0); const filtRec=(catFilter==="All"?mE:mE.filter(e=>e.category===catFilter)).sort((a,b)=>new Date(b.date)-new Date(a.date)); const mChart=MO.map((m,i)=>{const me=entries.filter(e=>new Date(e.date).getMonth()===i&&new Date(e.date).getFullYear()===yr);return{m,v:me.reduce((s,e)=>s+e.amount,0)};}); const years=[...new Set([yr,...entries.map(e=>new Date(e.date).getFullYear())])].sort((a,b)=>b-a); // ─── ENTRY ROW ────────────────────────────────────────────── function EntryRow({en,del}){ const clr=CC[en.category]||"#6b7280"; const bg=CB[en.category]||"#f9fafb"; return(
en.image&&setViewEntry(en)}>
{CI[en.category]}
{t.catNames[en.category]} {en.invoiceNo&&#{en.invoiceNo}}
📅 {en.date} {en.qty&&· {en.qty}} {en.note&&· {en.note.substring(0,24)}}
{rupee(en.amount)}
{en.image&&📎} {del&&{e.stopPropagation();setDelId(en.id);}} style={{background:"none",border:"none",color:"#ef4444aa",cursor:"pointer",fontSize:16,padding:"0 2px",lineHeight:1}}>🗑}
); } // ─── HOME ──────────────────────────────────────────────────── function Home(){ return(
{/* Hero */}
{t.monthTotal} · {MF[mon-1]} {yr}
{rupee(mTot)}
{mE.length} {t.entries} · {mE.filter(e=>e.image).length} {t.invoices}
{/* Quick stats */}
⛽ {t.fuelM}
{rupee(fuelM)}
📅 {t.yearTotal} {yr}
{rupee(yTot)}
{/* Category breakdown */} {catBrk.length>0&&(
{t.breakdown}
{catBrk.map(({c,v,col})=>(
{CI[c]}{t.catNames[c]} {rupee(v)}
0?v/mTot*100:0}%`,background:col}}/>
))}
)} {/* Recent entries */} {entries.length>0?(
{t.recent}
{entries.slice(0,5).map(en=>)}
{entries.length>5&&
setTab("rec")} style={{textAlign:"center",padding:"12px 0",fontSize:12,color:"#16a34a",fontWeight:700,cursor:"pointer"}}>View all {entries.length} entries →
}
):(
📒
{t.noData}
{t.start}
)}
); } // ─── ADD ENTRY ─────────────────────────────────────────────── function AddPage(){ return(
➕{t.addTitle}
{/* Invoice No + Date */}
{t.invNo} 
{form.invoiceNo}
sf("invoiceNo",e.target.value)}/>
{t.date} * 
dd-mm-yyyy
sf("date",e.target.value)}/>
{/* Category grid */}
{t.cat} *
{CATS.map(c=>{ const sel=form.category===c; return( sf("category",c)} style={{ background:sel?CC[c]:CB[c], border:`2px solid ${sel?CC[c]:CC[c]+"44"}`, borderRadius:13,padding:"10px 4px 8px",cursor:"pointer", display:"flex",flexDirection:"column",alignItems:"center",gap:3, transition:"all .15s",boxShadow:sel?`0 4px 14px ${CC[c]}44`:"none", transform:sel?"translateY(-2px)":"none" }}> {CI[c]} {t.catNames[c]} ); })}
{/* Amount + Qty */}
{t.amt} * 
0.00
sf("amount",e.target.value)} style={{fontSize:20,fontWeight:800,color:"#16a34a"}}/>
{t.qty} 
{form.qty}
sf("qty",e.target.value)}/>
{/* Note */}
{t.note} 
{form.note}
sf("note",e.target.value)}/>
{/* Image */}
{t.upload} No file chosen
{form.image?(
invoice preview
✅ {t.attached}
{t.change}
):( <>
📸
{t.camHint}
Auto compressed → small file size
)}
✅ {t.save}
); } // ─── RECORDS ───────────────────────────────────────────────── function Records(){ return(
{MF[mon-1]} {yr}
{filtRec.length} {t.entries}
{rupee(mTot)}
{/* Filter chips */}
{["All",...CATS].map(c=>( setCatFilter(c)} style={{ borderColor:catFilter===c?(CC[c]||"#16a34a"):"#dcfce7", background:catFilter===c?(CC[c]||"#16a34a")+"18":"#fff", color:catFilter===c?(CC[c]||"#16a34a"):"#64748b" }}>{c==="All"?`🔍 ${t.allCats}`:`${CI[c]} ${t.catNames[c]}`} ))}
{t.tapBill}
{filtRec.length===0?(
🗂️
{t.noMonth}
):(
{filtRec.map(en=>)}
)}
); } // ─── ANALYTICS ─────────────────────────────────────────────── function Analytics(){ const CTip=({active,payload,label})=>{ if(!active||!payload?.length) return null; return(
{label}
{rupee(payload[0].value)}
); }; return(
{/* Bar chart */}
{t.trend} — {yr}
}/> {mChart.map((_,i)=>)}
{/* Pie chart */} {catBrk.length>0&&(
{MO[mon-1]} {t.breakdown}
({name:x.c,value:x.v}))} cx={62} cy={62} innerRadius={38} outerRadius={62} dataKey="value" paddingAngle={3}> {catBrk.map((x,i)=>)}
{catBrk.map(({c,v,col})=>(
{t.catNames[c]}
{rupee(v)}
))}
)} {/* Year summary */}
{t.yearSumm} — {yr}
{yCatBrk.length===0&&
{t.noData}
} {yCatBrk.map(({c,v,col})=>(
{CI[c]}{t.catNames[c]} {rupee(v)}
))} {yCatBrk.length>0&&(
Total {rupee(yTot)}
)}
{/* Month-wise table */}
{t.monthWise} — {yr}
{MF.map((mn,i)=>{ const me=entries.filter(e=>new Date(e.date).getMonth()===i&&new Date(e.date).getFullYear()===yr); const mt=me.reduce((s,e)=>s+e.amount,0); if(!mt) return null; const mf2=me.filter(e=>e.category==="Fuel").reduce((s,e)=>s+e.amount,0); const isCur=i===mon-1; return(
{setMon(i+1);setTab("rec");}} style={{padding:"9px 8px",borderRadius:10,background:isCur?"#f0fff4":"transparent",border:isCur?"1.5px solid #bbf7d0":"1.5px solid transparent",cursor:"pointer",marginBottom:4,transition:"all .15s"}}>
{mn}
{mf2>0&&⛽{rupee(mf2)}} {me.length} {t.entries} {rupee(mt)}
); })} {yE.length===0&&
{t.noData}
}
); } // ─── EXPORT ────────────────────────────────────────────────── function Export(){ const mImgs=mE.filter(e=>e.image).length; const yImgs=yE.filter(e=>e.image).length; async function tryExport(fn){ if(!pdfReady){flash("⏳ Loading PDF...");return;} setExporting(true); try{await fn();flash("📄 PDF downloaded!");}catch(err){flash(t.err+" "+err.message);} setExporting(false); } return(
📥 PDF Export
{/* Monthly */}
📅
{t.monthly}
{MF[mon-1]} {yr} · {mE.length} {t.entries} · {mImgs} {t.invoices}
✦ Category-wise summary + totals
✦ All transactions with Invoice No.
✦ Invoice images — 4 per page
✦ Dark professional PDF format
tryExport(()=>buildMonthlyPDF(entries,mon,yr))} disabled={exporting||!mE.length} style={{fontSize:14,padding:13}}> {exporting?"⏳ "+t.gen:"⬇ "+t.dlPdf+" ("+MO[mon-1]+" "+yr+")"}
{/* Annual */}
📆
{t.annual}
{yr} · {yE.length} {t.entries} · {yImgs} {t.invoices}
✦ Full year + month-wise table
✦ Category totals for {yr}
✦ All {yImgs} invoices — 4 per page
✦ One-click year-end export
tryExport(()=>buildAnnualPDF(entries,yr))} disabled={exporting||!yE.length} style={{fontSize:14,padding:13,background:"linear-gradient(135deg,#2563eb,#1d4ed8)",boxShadow:"0 5px 18px #2563eb38"}}> {exporting?"⏳ "+t.gen:"⬇ "+t.dlPdf+" (Annual "+yr+")"}
{/* Category wise */}
🏷️
{t.catDl}
{/* Category chips */}
SELECT CATEGORY
{["All",...CATS].map(c=>( setExpCat(c)} style={{ borderColor:expCat===c?(CC[c]||"#16a34a"):"#e5e7eb", background:expCat===c?(CC[c]||"#16a34a")+"18":"#fff", color:expCat===c?(CC[c]||"#16a34a"):"#64748b", fontSize:11 }}>{c==="All"?`📋 All`:`${CI[c]} ${t.catNames[c]}`} ))}
{/* Scope */}
SELECT PERIOD
{[{v:true,l:`📅 ${MO[mon-1]} ${yr}`},{v:false,l:`📆 Year ${yr}`}].map(({v,l})=>( setExpMonth(v)} style={{ borderColor:expMonth===v?"#ca8a04":"#e5e7eb", background:expMonth===v?"#fefce8":"#fff", color:expMonth===v?"#ca8a04":"#64748b" }}>{l} ))}
tryExport(()=>buildCatPDF(entries,expCat,mon,yr,expMonth))} disabled={exporting} style={{fontSize:14,padding:13,background:"linear-gradient(135deg,#ca8a04,#b45309)",boxShadow:"0 5px 18px #ca8a0438"}}> {exporting?"⏳ "+t.gen:`⬇ ${t.dlPdf} (${expCat===1?"All":expCat})`}
{/* Year quick view */}
{yr} — Quick View
{MF.map((mn,i)=>{ const me=entries.filter(e=>new Date(e.date).getMonth()===i&&new Date(e.date).getFullYear()===yr); const mt=me.reduce((s,e)=>s+e.amount,0); if(!mt) return null; return(
{mn}
{me.length} {t.entries} {rupee(mt)}
); })} {yE.length===0&&
{t.noData}
}
); } // ─── LOADING ───────────────────────────────────────────────── if(loading) return(
📒
HisabBook
Loading your data…
); // ─── MAIN RENDER ───────────────────────────────────────────── return( <>
{/* ── HEADER ── */}
{t.app}
{t.tag}

{m}
 
{y}
 setShowLang(true)} style={{background:"#f0fff4",border:"1.5px solid #bbf7d0",borderRadius:11,padding:"7px 11px",cursor:"pointer",fontSize:12,fontWeight:800,color:"#16a34a",fontFamily:"'Baloo 2',sans-serif",lineHeight:1}}> {lang==="en"?"EN":lang==="hi"?"हिं":"HI"}
{/* ── PAGE CONTENT ── */}
{tab==="home"&&} {tab==="add"&&} {tab==="rec"&&} {tab==="chart"&&} {tab==="exp"&&}
{/* ── BOTTOM NAV ── */}
{[{id:"home",ic:"🏠",l:t.home},{id:"add",ic:"➕",l:t.add},{id:"rec",ic:"📋",l:t.rec},{id:"chart",ic:"📊",l:t.chart},{id:"exp",ic:"📥",l:t.exp}].map(({id,ic,l})=>( setTab(id)}> {ic}{l} ))}
{/* ── MODALS ── */} {/* Invoice Viewer */} {viewEntry&&(
setViewEntry(null)}>
e.stopPropagation()}>
{CI[viewEntry.category]} {t.catNames[viewEntry.category]} {viewEntry.date}
invoice
{viewEntry.invoiceNo&&
#{viewEntry.invoiceNo}
}
{rupee(viewEntry.amount)}
{viewEntry.qty&&
Qty: {viewEntry.qty}
} {viewEntry.note&&
{viewEntry.note}
}
⬇ Save
setViewEntry(null)} style={{width:"100%"}}>{t.viewClose}
)} {/* Delete Confirm */} {delId&&(
setDelId(null)}>
e.stopPropagation()}>
🗑️
{t.delTitle}
{t.delMsg}
setDelId(null)} style={{flex:1}}>{t.cancel} doDelete(delId)} style={{flex:1}}>{t.del}
)} {/* Language Selector */} {showLang&&(
setShowLang(false)}>
e.stopPropagation()}>
🌐 {t.langTitle}
{[{v:"en",icon:"🇬🇧",label:"English",sub:"Simple English"},{v:"hi",icon:"🇮🇳",label:"हिंदी",sub:"पूर्ण हिंदी में"},{v:"hl",icon:"🤝",label:"Hinglish",sub:"Hindi + English mix"}].map(({v,icon,label,sub})=>( {setLang(v);setShowLang(false);}} style={{ width:"100%",padding:"14px 18px",marginBottom:9,borderRadius:14,cursor:"pointer", border:`2px solid ${lang===v?"#16a34a":"#dcfce7"}`, background:lang===v?"#f0fff4":"#fff", fontFamily:"'Baloo 2',sans-serif",textAlign:"left", display:"flex",alignItems:"center",gap:13,transition:"all .15s" }}> {icon}
{label}
{sub}
{lang===v&&✅} ))}
)} {/* Toast */} {toast&&
{toast}
}
); }
