/* COSMOS THRESHOLD · 5 SECOND DIRECTOR'S CUT
 * Total full playback = 4100ms scene + 240ms verified completion + 660ms reveal = 5000ms.
 * If the app takes longer, scene waits; it NEVER hides before ready.
 * No external dependencies; the host is responsible for real app boot/readiness.
 */
(function(global){
  'use strict';
  const reduced=()=>Boolean(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const TIMING={full:4100,quick:730,complete:240,exit:660,reduced:100,exitReduced:160};
  function create({stage}){
    if(!(stage instanceof HTMLElement)) throw new Error('COSMOS: stage DOM element required');
    let serial=0, timers=[], completed=true;
    const status=stage.querySelector('.ct-scene__bottom-copy span:last-child');
    const later=(ms,fn)=>new Promise(resolve=>{
      const t=setTimeout(()=>{fn?.();resolve()},ms);
      timers.push(t);
    });
    function stop(){
      serial++;
      for(const t of timers)clearTimeout(t);
      timers=[];
      stage.classList.remove('is-playing','is-quick','is-leaving','is-reduced','is-complete');
      stage.style.display='none';
      completed=true;
    }
    function play({repeat=false,ready=Promise.resolve(),onFinish=()=>{}}={}){
      stop(); completed=false;
      const ticket=serial, noMotion=reduced();
      if(status)status.textContent='ПОДГОТОВКА МАРШРУТА';
      stage.style.display='block';
      void stage.offsetWidth; // clean replay
      stage.classList.add(noMotion?'is-reduced':repeat?'is-quick':'is-playing');
      const sequenceDuration=noMotion?TIMING.reduced:repeat?TIMING.quick:TIMING.full;
      const endDuration=noMotion?TIMING.exitReduced:TIMING.exit;
      const completeDuration=noMotion?0:repeat?0:TIMING.complete;
      const sceneDone=later(sequenceDuration);
      // A failed boot should resolve via the host app's friendly error view,
      // rather than leaving the splash covering the error indefinitely.
      const bootDone=Promise.resolve(ready).then(()=>true,error=>{
        console.warn('[COSMOS] boot readiness rejected; host must display an error UI:',error);
        return false;
      });
      Promise.all([sceneDone,bootDone]).then(async([_,bootOK])=>{
        if(ticket!==serial||completed)return;
        stage.classList.add('is-complete');
        if(status)status.textContent=bootOK?'МАРШРУТ ГОТОВ':'НЕ УДАЛОСЬ ЗАГРУЗИТЬ';
        if(completeDuration)await later(completeDuration);
        if(ticket!==serial||completed)return;
        stage.classList.add('is-leaving');
        await later(endDuration);
        if(ticket!==serial||completed)return;
        completed=true;
        stage.style.display='none';
        stage.classList.remove('is-leaving');
        onFinish();
      });
      return {stop};
    }
    return {play,stop};
  }
  global.CosmosThreshold={create};
})(window);
