/* stub para navegador: simula o evento deviceready do Cordova, inclusive para quem registrar depois */
window.cordova=window.cordova||{plugins:{},exec:function(){}};
(function(){var o=document.addEventListener.bind(document);
document.addEventListener=function(t,f,c){if(t==='deviceready'){setTimeout(function(){try{f.call(document,new Event('deviceready'))}catch(e){console.error(e)}},0);return}return o(t,f,c)};
})();
