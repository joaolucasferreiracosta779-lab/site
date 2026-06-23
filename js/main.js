// ============ DATA ============
const WHATSAPP = '5535984528431';

const SERVICES = [
  {id:'corte',name:'Corte de Cabelo',price:80,img:'https://images.unsplash.com/photo-1700760934268-8aa0ef52ce0a?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',desc:'Cortes femininos personalizados para valorizar seu estilo e seu rosto.',msg:'Você escolheu Corte de Cabelo. Vamos renovar seu visual e valorizar ainda mais seu estilo.'},
  {id:'coloracao',name:'Coloração',price:120,img:'https://images.unsplash.com/photo-1707720531504-ce087725861a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',desc:'Coloração profissional com acabamento perfeito e cores vibrantes.',msg:'Você escolheu Coloração. Vamos transformar seu visual com cores vibrantes e acabamento profissional.'},
  {id:'hidratacao',name:'Hidratação',price:120,img:'https://images.unsplash.com/photo-1610595426075-eed5a3f521ee?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',desc:'Tratamento profundo para fios sedosos, brilhantes e revitalizados.',msg:'Você escolheu Hidratação. Seus fios receberão tratamento profundo para brilho e maciez.'},
  {id:'progressiva',name:'Progressiva',price:180/250,img:'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',desc:'Alisamento progressivo para fios disciplinados, alinhados e brilhantes.',msg:'Você escolheu Progressiva. Prepare-se para fios alinhados, disciplinados e com muito brilho.'},
  {id:'escova com chapa',name:'Escova',price:60,img:'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',desc:'Escova modeladora com acabamento elegante e sofisticado.',msg:'Você escolheu Escova. Seu visual ganhará acabamento sofisticado e elegante.'},
  {id:'chapa',name:'Chapa',price:20,img:'https://i1.wp.com/www.lojaodocabeleireiro.com/wp-content/uploads/2021/11/shutterstock-1227139510-1-scaled.jpg?w=1960&ssl=1',desc:'Alinhamento perfeito com prancha profissional para fios impecáveis.',msg:'Você escolheu Chapa. Alinhamento perfeito para um resultado impecável.'},
  {id:'babyliss',name:'Babyliss',price:40,img:'https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=626&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',desc:'Cachos definidos e modelados para um visual encantador e único.',msg:'Você escolheu Babyliss. Cachos definidos e um visual encantador.'},
];

const COMBOS = [
  {id:'combo-beleza',name:'Combo Beleza Total',price:180,items:['Corte','Hidratação','Escova'],msg:'Combo Beleza Total — Corte + Hidratação + Escova.'},
  {id:'combo-premium',name:'Combo Premium',price:180,items:['coloracao','hidratacao','escova'],msg:'Combo Premium — Coloração + Hidratação + Escova.',featured:true},
];

const ALL_ITEMS = [...SERVICES,...COMBOS];

// ============ CART ============
const Cart = {
  get(){try{return JSON.parse(localStorage.getItem('cart')||'[]')}catch{return []}},
  save(c){localStorage.setItem('cart',JSON.stringify(c));this.render()},
  add(id){
    const item = ALL_ITEMS.find(s=>s.id===id);if(!item)return;
    const c = this.get();const ex = c.find(i=>i.id===id);
    if(ex)ex.qty++;else c.push({id,qty:1});
    this.save(c);
    toast(`✓ ${item.name} adicionado ao carrinho`);
    if(item.msg)setTimeout(()=>showCartMsg(item.msg),100);
    openCart();
  },
  remove(id){this.save(this.get().filter(i=>i.id!==id))},
  setQty(id,q){const c=this.get();const it=c.find(i=>i.id===id);if(it){it.qty=Math.max(1,q);this.save(c)}},
  clear(){this.save([])},
  total(){return this.get().reduce((s,i)=>{const it=ALL_ITEMS.find(x=>x.id===i.id);return s+(it?it.price*i.qty:0)},0)},
  count(){return this.get().reduce((s,i)=>s+i.qty,0)},
  render(){
    const c = this.get();
    document.querySelectorAll('.cart-count').forEach(el=>{el.textContent=this.count();el.style.display=this.count()?'flex':'none'});
    const list = document.getElementById('cart-items');
    if(!list)return;
    if(!c.length){
      list.innerHTML = '<div class="cart-empty">Seu carrinho está vazio.<br><small>Adicione um serviço para começar.</small></div>';
    } else {
      list.innerHTML = c.map(i=>{
        const it = ALL_ITEMS.find(x=>x.id===i.id);if(!it)return'';
        return `<div class="cart-item">
          <img src="${it.img||'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200'}" alt="${it.name}">
          <div class="cart-item-info">
            <h4>${it.name}</h4>
            <div class="p">R$ ${it.price.toFixed(2).replace('.',',')}</div>
            <div class="qty">
              <button onclick="Cart.setQty('${i.id}',${i.qty-1})">−</button>
              <span>${i.qty}</span>
              <button onclick="Cart.setQty('${i.id}',${i.qty+1})">+</button>
            </div>
          </div>
          <button class="cart-remove" onclick="Cart.remove('${i.id}')">×</button>
        </div>`;
      }).join('');
    }
    const tot = document.getElementById('cart-total');
    if(tot)tot.textContent = 'R$ '+this.total().toFixed(2).replace('.',',');
  }
};

function showCartMsg(text){
  const list = document.getElementById('cart-items');if(!list)return;
  const div = document.createElement('div');div.className='cart-msg';div.textContent=text;
  list.prepend(div);setTimeout(()=>div.remove(),5000);
}

function openCart(){document.getElementById('cart-drawer')?.classList.add('active');document.getElementById('cart-overlay')?.classList.add('active')}
function closeCart(){document.getElementById('cart-drawer')?.classList.remove('active');document.getElementById('cart-overlay')?.classList.remove('active')}

// ============ TOAST ============
function toast(text){
  let t = document.getElementById('toast');
  if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)}
  t.textContent = text;t.classList.add('show');
  clearTimeout(t._to);t._to = setTimeout(()=>t.classList.remove('show'),3000);
}

// ============ WHATSAPP ============
function waOpen(msg){
  const text = encodeURIComponent(msg || 'Olá Roseane! Gostaria de mais informações sobre os serviços do Estúdio.');
  window.open(`https://wa.me/${WHATSAPP}?text=${text}`,'_blank');
}

function openCheckout(){
  if(!Cart.get().length){toast('Adicione um serviço ao carrinho primeiro');return}
  document.getElementById('modal-checkout').classList.add('active');
  // pre-fill summary
  const summary = document.getElementById('checkout-summary');
  summary.innerHTML = Cart.get().map(i=>{
    const it = ALL_ITEMS.find(x=>x.id===i.id);
    return `<div style="display:flex;justify-content:space-between;font-size:14px;color:#ccc;padding:4px 0">
      <span>${it.name} ${i.qty>1?'×'+i.qty:''}</span>
      <span style="color:var(--gold)">R$ ${(it.price*i.qty).toFixed(2).replace('.',',')}</span>
    </div>`;
  }).join('') + `<div class="total">Total: R$ ${Cart.total().toFixed(2).replace('.',',')}</div>`;
}
function closeCheckout(){document.getElementById('modal-checkout').classList.remove('active')}

function submitCheckout(e){
  e.preventDefault();
  const f = e.target;
  const items = Cart.get().map(i=>{const it=ALL_ITEMS.find(x=>x.id===i.id);return `• ${it.name}${i.qty>1?' (x'+i.qty+')':''}`}).join('\n');
  const msg = `Olá Roseane! ✨\n\nGostaria de agendar os seguintes procedimentos:\n\n${items}\n\n💎 Valor estimado: R$ ${Cart.total().toFixed(2).replace('.',',')}\n\n👤 Nome: ${f.nome.value}\n📞 Telefone: ${f.telefone.value}\n📅 Data desejada: ${f.data.value}\n⏰ Horário: ${f.hora.value}\n${f.obs.value?'\n📝 Observações: '+f.obs.value:''}\n\nAguardo confirmação!`;
  waOpen(msg);
  closeCheckout();
}

// ============ NAV ============
function initNav(){
  const h = document.querySelector('.header');
  if(h)window.addEventListener('scroll',()=>h.classList.toggle('scrolled',scrollY>40));
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  toggle?.addEventListener('click',()=>menu.classList.toggle('open'));
  // highlight current
  const path = location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.menu a').forEach(a=>{
    const href = a.getAttribute('href');
    if(href===path || (path===''&&href==='index.html'))a.classList.add('active');
  });
}

// ============ REVEAL ============
function initReveal(){
  const io = new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}

// ============ RENDER SERVICES ============
function renderServices(target='services-grid'){
  const el = document.getElementById(target);if(!el)return;
  el.innerHTML = SERVICES.map((s,i)=>`
    <article class="service-card reveal" style="transition-delay:${i*60}ms">
      <div class="service-img"><img src="${s.img}" alt="${s.name}" loading="lazy"></div>
      <div class="service-body">
        <h3>${s.name}</h3>
        <p class="desc">${s.desc}</p>
        <div class="service-price"><small>a partir de</small>R$ ${s.price.toFixed(2).replace('.',',')}</div>
        <button class="btn btn-gold-outline add-cart" onclick="Cart.add('${s.id}')">Adicionar ao Carrinho</button>
      </div>
    </article>`).join('');
  initReveal();
}

// ============ GALLERY ============
const GALLERY = [
  {cat:'cortes',img:'https://images.unsplash.com/photo-1700760934268-8aa0ef52ce0a?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
  {cat:'coloracoes',img:'https://images.unsplash.com/photo-1707720531504-ce087725861a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
  {cat:'transformacoes',img:'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80'},
  {cat:'progressivas',img:'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80'},
  {cat:'hidratacoes',img:'https://images.unsplash.com/photo-1610595426075-eed5a3f521ee?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
  {cat:'cortes',img:'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=80'},
  {cat:'coloracoes',img:'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80'},
  {cat:'transformacoes',img:'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80'},
  {cat:'cortes',img:'https://images.unsplash.com/photo-1599387737046-d540a7bd0d23?w=600&q=80'},
  {cat:'progressivas',img:'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80'},
  {cat:'hidratacoes',img:'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=600&q=80'},
  {cat:'transformacoes',img:'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=80'},
];
function renderGallery(filter='all'){
  const el = document.getElementById('gallery');if(!el)return;
  const items = filter==='all'?GALLERY:GALLERY.filter(g=>g.cat===filter);
  el.innerHTML = items.map(g=>`
    <a class="item" onclick="openLightbox('${g.img}')">
      <img src="${g.img}" alt="Galeria" loading="lazy">
      <span class="cap">${g.cat}</span>
    </a>`).join('');
}
function openLightbox(src){
  let lb = document.getElementById('lightbox');
  if(!lb){lb=document.createElement('div');lb.id='lightbox';lb.className='lightbox';
    lb.innerHTML='<button class="lightbox-close" onclick="this.parentNode.classList.remove(\'active\')">×</button><img>';
    lb.addEventListener('click',e=>{if(e.target===lb)lb.classList.remove('active')});
    document.body.appendChild(lb);}
  lb.querySelector('img').src = src;
  lb.classList.add('active');
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded',()=>{
  initNav();
  initReveal();
  Cart.render();
});
