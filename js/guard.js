(function(){var d=document,o={passive:false};
['gesturestart','gesturechange','gestureend'].forEach(function(t){d.addEventListener(t,function(e){e.preventDefault()},o)});
d.addEventListener('touchmove',function(e){if((e.touches&&e.touches.length>1)||(e.scale&&e.scale!==1))e.preventDefault()},o);
d.addEventListener('wheel',function(e){if(e.ctrlKey||e.metaKey)e.preventDefault()},o);
d.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&['+','=','-','_','0','Add','Subtract'].indexOf(e.key)>-1)e.preventDefault()});
})();
