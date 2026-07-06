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

  // Contact form -> envoi direct via /api/contact (fonction Vercel + Brevo)
  var form=document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      var btn=form.querySelector('button[type="submit"]');
      var status=document.getElementById('form-status');
      var initial=btn.innerHTML;
      btn.disabled=true;btn.textContent='Envoi en cours…';
      if(status){status.textContent='';status.style.color='';}
      fetch('/api/contact',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          nom:(form.nom.value||'').trim(),
          email:(form.email.value||'').trim(),
          message:(form.message.value||'').trim(),
          website:form.website?form.website.value:''
        })
      })
      .then(function(r){return r.json();})
      .then(function(d){
        if(!d.ok){throw new Error(d.error||'erreur');}
        form.reset();
        if(status){status.textContent='✓ Message envoyé — je reviens vers vous rapidement.';status.style.color='#7ee2a8';}
      })
      .catch(function(){
        if(status){status.textContent='L\'envoi a échoué. Écrivez-nous directement à contact@onn-off.fr.';status.style.color='#ef6b76';}
      })
      .finally(function(){btn.disabled=false;btn.innerHTML=initial;});
    });
  }
  // Footer year
  var y=document.getElementById('year'); if(y){y.textContent=new Date().getFullYear();}
})();
