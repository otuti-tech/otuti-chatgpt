function injectScript(scriptUrl) {
  const newScriptElement = document.createElement('script');
  newScriptElement.setAttribute('src', scriptUrl);
  newScriptElement.setAttribute('type', 'text/javascript');

  // eslint-disable-next-line func-names
  newScriptElement.onload = function () {
    this.remove();
  };

  document.documentElement.prepend(newScriptElement);
}
// eslint-disable-next-line no-unused-vars
const isOpera = window.navigator.userAgent.indexOf('OPR') > -1 || window.navigator.userAgent.indexOf('Opera') > -1;
const isFirefox = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
if (isFirefox) {
  const interceptorScriptUrl = chrome.runtime.getURL('scripts/interceptor/interceptorFirefox.js');
  injectScript(interceptorScriptUrl);
}
