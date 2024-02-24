/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
speechSynthesis.cancel();

function newUseArkoseSetupEnforcementgpt35(e) {
  e.setConfig({
    selector: '#enforcement-trigger35',
    onCompleted(x) {
      // console.warn('onCompleted35', x);
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
}

function newUseArkoseSetupEnforcementgpt4(e) {
  e.setConfig({
    selector: '#enforcement-trigger4',
    onCompleted(x) {
      // console.warn('onCompleted4', x);
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
}
Object.defineProperties(window, {
  //   useArkoseSetupEnforcementgpt35: {
  //     get() {
  //       if (window.localStorage.getItem('sp/autoSync') === 'true') {
  //         return newUseArkoseSetupEnforcementgpt35;
  //       }
  //       return this.value;
  //     },
  //     set(val) {
  //       if (window.localStorage.getItem('sp/autoSync') !== 'true') {
  //         this.value = val;
  //       }
  //     },
  //   },
  useArkoseSetupEnforcementgpt4: {
    configurable: true,
    get() {
      const isFirefox = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      const isOnGizmoEditor = window.location.href.includes('gpts/editor');

      if (isFirefox || isOnGizmoEditor || (window.localStorage.getItem('sp/autoSync') || 'true') !== 'true') {
        return this.value;
      }
      return newUseArkoseSetupEnforcementgpt4;
    },
    set(val) {
      this.value = val;
    },
  },
});
