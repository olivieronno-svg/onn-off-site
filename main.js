/* ONN/OFF Studio — interactions légères (sans dépendance) */
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
