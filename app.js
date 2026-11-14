const BOOKS={
 profissional:{title:"O profissional que Deus Aprova",file:"dados/O-profissional-que-Deus-Aprova.json",kind:"profissional"},
 cristo:{title:"Como Deus Ensinou",file:"dados/como_deus_ensinou.json",kind:"cristo"},
 liderar:{title:"Liderar Sem Perder a Alma",file:"dados/liderar_sem_perder_a_alma.json",kind:"liderar"}
};
const DAILY_START=new Date(2026,10,2);
const $=id=>document.getElementById(id);
let records=[],currentKey=null,index=0,dailyIndex=0;
function dayNumber(d){return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000)}
function getDailyIndex(total){return total?((dayNumber(new Date())-dayNumber(DAILY_START))%total+total)%total:0}
function todayText(){return new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"long",year:"numeric"}).format(new Date())}
function addParagraph(parent,text,cls=""){if(text===undefined||text===null||text==="")return;const p=document.createElement("p");if(cls)p.className=cls;p.textContent=String(text);parent.append(p)}
function addSection(parent,label,value,cls=""){if(value===undefined||value===null||value==="")return;const h=document.createElement("p");h.className="section-label";h.textContent=label;parent.append(h);if(Array.isArray(value)){value.forEach(v=>addParagraph(parent,v,cls));}else{String(value).split(/\r?\n\s*\r?\n/).map(s=>s.trim()).filter(Boolean).forEach(v=>addParagraph(parent,v,cls));}}
function render(){
 const item=records[index],kind=BOOKS[currentKey].kind,article=$("content");article.replaceChildren();
 const heading=document.createElement("h3");heading.textContent=item.titulo||"Leitura";article.append(heading);
 if(kind==="profissional"){
   addSection(article,"Versículo",item.versiculo,"verse");
   addSection(article,"Reflexão",item.reflexao);
   addSection(article,"Prática no trabalho",item.pratica_no_trabalho);
   addSection(article,"Exame pessoal",item.exame_pessoal);
 }else if(kind==="cristo"){
   addSection(article,"Leitura",item.leitura,"verse");
   addSection(article,"Reflexão introdutória",item.reflexao_introdutoria);
   addSection(article,"Aplicação",item.aplicacao);
   addSection(article,"Oração",item.oracao);
   addSection(article,"Reflexão final",item.reflexao_final);
 }else{
   if(item.subtitulo)addParagraph(article,item.subtitulo);
   addSection(article,"Versículo-chave",item.versiculo_chave,"verse");
   addSection(article,"Conteúdo",item.conteudo);
 }
 $("count").textContent=`Leitura ${index+1} de ${records.length}`;
 $("prevBtn").disabled=index===0;
 $("nextBtn").textContent=index===records.length-1?"Recomeçar ↻":"Próxima leitura →";
}
async function openBook(key){
 currentKey=key;const book=BOOKS[key];
 $("home").hidden=true;$("reader").hidden=false;$("bookTitle").textContent=book.title;
 $("dateLabel").textContent="LEITURA DO DIA · "+todayText();
 $("content").textContent="Carregando leitura…";
 try{
   const res=await fetch(book.file,{cache:"no-cache"});if(!res.ok)throw new Error("HTTP "+res.status);
   const data=await res.json();records=(data.textos||[]).slice().sort((a,b)=>Number(a.numero||0)-Number(b.numero||0));
   if(!records.length)throw new Error("O arquivo não contém textos.");
   dailyIndex=getDailyIndex(records.length);index=dailyIndex;render();window.scrollTo({top:0,behavior:"smooth"});
 }catch(err){$("content").textContent="Não foi possível abrir esta coleção. Confira a pasta dados. "+err.message;}
}
document.querySelectorAll("[data-book]").forEach(b=>b.addEventListener("click",()=>openBook(b.dataset.book)));
$("backBtn").addEventListener("click",()=>{$("reader").hidden=true;$("home").hidden=false;window.scrollTo({top:0,behavior:"smooth"});});
$("prevBtn").addEventListener("click",()=>{if(index>0){index--;render();}});
$("nextBtn").addEventListener("click",()=>{index=(index+1)%records.length;render();});
$("todayBtn").addEventListener("click",()=>{index=dailyIndex;render();});
let fontSize=23;
$("larger").addEventListener("click",()=>{fontSize=Math.min(36,fontSize+2);document.documentElement.style.setProperty("--reading-size",fontSize+"px");});
$("smaller").addEventListener("click",()=>{fontSize=Math.max(17,fontSize-2);document.documentElement.style.setProperty("--reading-size",fontSize+"px");});
if("serviceWorker" in navigator&&location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));}
let installPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;$("installBtn").hidden=false;});
$("installBtn").addEventListener("click",async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$("installBtn").hidden=true;});
