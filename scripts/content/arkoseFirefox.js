/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line func-names
window.useArkoseSetupEnforcementgpt35 = function (e) {
  e.setConfig({
    selector: '#enforcement-trigger35',
    onCompleted(x) {
      window.localStorage.setItem('arkoseToken', x.token);
    },
    onError(x) {
      console.warn('onError', x);
    },
    onFailed(x) {
      console.warn('onFailed', x);
    },
    onShown(x) {
      // console.warn('onShown', x);
    },
  });
};
// eslint-disable-next-line func-names
window.useArkoseSetupEnforcementgpt4 = function (e) {
  e.setConfig({
    selector: '#enforcement-trigger4',
    onCompleted(x) {
      window.localStorage.setItem('arkoseToken', x.token);
    },
    onError(x) {
      console.warn('onError', x);
    },
    onFailed(x) {
      console.warn('onFailed', x);
    },
    onShown(x) {
      // console.warn('onShown', x);
    },
  });
};
