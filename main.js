/* ONN/OFF Studio — interactions légères (sans dépendance) */

/* ===== Fond animé — carrousel plein site =====
   6 visuels ONN-OFF (4 bannières Studio + 2 Expert SSI), recadrés sur la photo, optimisés WebP. */
var BG_IMAGES = ['bg-2.webp','bg-1.webp','bg-6.webp','bg-3.webp','bg-5.webp','bg-4.webp'];
(function(){
  if(!BG_IMAGES || !BG_IMAGES.length) return;
  var bg=document.createElement('div'); bg.className='site-bg'; bg.setAttribute('aria-hidden','true');
  var veil=document.createElement('div'); veil.className='site-veil'; veil.setAttribute('aria-hidden','true');
  var slides=[];
  BG_IMAGES.forEach(function(src,i){
    var s=document.createElement('div'); s.className='site-bg__slide';
    s.style.backgroundImage="url('"+src+"')";
    if(i===0) s.classList.add('is-active');
    bg.appendChild(s); slides.push(s);
  });
  document.body.insertBefore(veil,document.body.firstChild);
  document.body.insertBefore(bg,document.body.firstChild);
  if(slides.length>1){
    var idx=0;
    setInterval(function(){
      slides[idx].classList.remove('is-active');
      idx=(idx+1)%slides.length;
      slides[idx].classList.add('is-active');
    },6000);
  }
})();

(function(){
  // Mobile menu
  var burger=document.querySelector('.burger');
  var links=document.querySelector('.nav-links');
  if(burger&&links){
    burger.addEventListener('click',function(){links.classList.toggle('open');});
  }
  // Reveal on scroll
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
    },{threshold:.12});
    els.forEach(function(el){io.observe(el);});
  }else{els.forEach(function(el){el.classList.add('in');});}

  // Contact form -> mailto (hébergement statique, aucun back-end requis)
  var form=document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      var name=(form.nom.value||'').trim();
      var email=(form.email.value||'').trim();
      var msg=(form.message.value||'').trim();
      var subject=encodeURIComponent('Demande via le site — '+(name||'Contact'));
      var body=encodeURIComponent('Nom : '+name+'\nEmail : '+email+'\n\n'+msg);
      window.location.href='mailto:onnoff1975@gmail.com?subject='+subject+'&body='+body;
    });
  }
  // Footer year
  var y=document.getElementById('year'); if(y){y.textContent=new Date().getFullYear();}
})();
