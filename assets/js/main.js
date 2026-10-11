(function(){
  // Legacy anchor from before the 2026-10-10 rename
  if(location.hash==='#ray-pearson-forum-2008'&&document.getElementById('eog-forum-2008')){history.replaceState(null,'',location.pathname+'#eog-forum-2008');document.getElementById('eog-forum-2008').scrollIntoView();}
  // Mobile nav
  var t=document.querySelector('.nav-toggle'),n=document.getElementById('primary-nav');
  if(t&&n){t.addEventListener('click',function(){var o=n.classList.toggle('open');t.setAttribute('aria-expanded',o);});}
  // Lite YouTube: load iframe only on click (faster page loads, fewer third-party requests)
  document.querySelectorAll('.video[data-yt]').forEach(function(v){
    var b=v.querySelector('button');if(!b)return;
    b.addEventListener('click',function(){
      var f=document.createElement('iframe');
      f.src='https://www.youtube-nocookie.com/embed/'+v.dataset.yt+'?autoplay=1&rel=0';
      f.title=v.dataset.title||'YouTube video';
      f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      f.allowFullscreen=true;f.referrerPolicy='strict-origin-when-cross-origin';
      v.innerHTML='';v.appendChild(f);f.focus();
    });
  });
  // Lazy-load posters for self-hosted videos (preload=none, poster set when near viewport)
  var lazy=[].slice.call(document.querySelectorAll('video[data-poster]'));
  var setPoster=function(v){if(v.dataset.poster){v.poster=v.dataset.poster;v.removeAttribute('data-poster');}};
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){setPoster(en.target);io.unobserve(en.target);}});},{rootMargin:'300px'});
    lazy.forEach(function(v){io.observe(v);});
  } else { lazy.forEach(setPoster); }
  // Chapter buttons seek the forum video
  document.querySelectorAll('.chapter[data-seek]').forEach(function(b){
    b.addEventListener('click',function(){
      var v=document.getElementById(b.dataset.target);if(!v)return;
      var t=parseFloat(b.dataset.seek);
      var go=function(){v.currentTime=t;v.play();};
      if(v.readyState>=1){go();}else{v.preload='metadata';v.addEventListener('loadedmetadata',go,{once:true});v.load();}
      v.scrollIntoView({behavior:'smooth',block:'center'});
    });
  });
  // Only one self-hosted video plays at a time
  document.addEventListener('play',function(ev){
    document.querySelectorAll('video').forEach(function(o){if(o!==ev.target&&!o.paused)o.pause();});
  },true);
  // Directory text filter
  var q=document.getElementById('dir-search');
  if(q){
    var items=[].slice.call(document.querySelectorAll('[data-search]')),
        cities=[].slice.call(document.querySelectorAll('.city')),
        states=[].slice.call(document.querySelectorAll('.state-group')),
        count=document.getElementById('dir-count'),empty=document.getElementById('dir-empty');
    var run=function(){
      var s=q.value.trim().toLowerCase(),shown=0;
      cities.forEach(function(c){
        var cityText=(c.dataset.city||'').toLowerCase(),stateText=(c.closest('.state-group').dataset.state||'').toLowerCase();
        var ctxMatch=!s||cityText.indexOf(s)>-1||stateText.indexOf(s)>-1,any=false;
        c.querySelectorAll('[data-search]').forEach(function(i){
          var m=ctxMatch||i.dataset.search.toLowerCase().indexOf(s)>-1;i.hidden=!m;if(m){any=true;shown++;}
        });
        c.hidden=!(any||ctxMatch);
      });
      states.forEach(function(g){g.hidden=!g.querySelector('.city:not([hidden])');});
      if(count)count.textContent=shown+(shown===1?' result':' results');
      if(empty)empty.hidden=shown>0||!s;
    };
    q.addEventListener('input',run);run();
  }
})();
