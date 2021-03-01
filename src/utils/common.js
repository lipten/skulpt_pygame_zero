export function loadScript(src, varName){
  if (window[varName]) {
    return Promise.resolve(window[varName]);
  }
  const res = new Promise(function(resolve, reject) {
    const el = document.createElement('script');
    el.onload = function() {
      resolve(varName && window.varName);
    };

    el.onerror = function(e) {
      el.onload = null;
      el.onerror = null;
      document.body.removeChild(el);
      reject(e);
    };
    el.src = src;
    el.async = true;
    console.log(document.body)
    document.body.appendChild(el);
  });
  return res;
}
