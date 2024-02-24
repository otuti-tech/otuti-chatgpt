/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
speechSynthesis.cancel();

function newUseArkoseSetupEnforcement(e) {
  e.setConfig({
    selector: '#enforcement-trigger',
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
  useArkoseSetupEnforcementpaid: {
    configurable: true,
    get() {
      const isFirefox = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      const isOnGizmoEditor = window.location.href.includes('gpts/editor');

      if (isFirefox || isOnGizmoEditor || (window.localStorage.getItem('sp/autoSync') || 'true') !== 'true') {
        return this.value;
      }
      return newUseArkoseSetupEnforcement;
    },
    set(val) {
      this.value = val;
    },
  },
  useArkoseSetupEnforcementfreeaccount: {
    configurable: true,
    get() {
      const isFirefox = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      const isOnGizmoEditor = window.location.href.includes('gpts/editor');

      if (isFirefox || isOnGizmoEditor || (window.localStorage.getItem('sp/autoSync') || 'true') !== 'true') {
        return this.value;
      }
      return newUseArkoseSetupEnforcement;
    },
    set(val) {
      this.value = val;
    },
  },
  useArkoseSetupEnforcementnoauth: {
    configurable: true,
    get() {
      const isFirefox = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      const isOnGizmoEditor = window.location.href.includes('gpts/editor');

      if (isFirefox || isOnGizmoEditor || (window.localStorage.getItem('sp/autoSync') || 'true') !== 'true') {
        return this.value;
      }
      return newUseArkoseSetupEnforcement;
    },
    set(val) {
      this.value = val;
    },
  },
  // useArkoseSetupEnforcementsubscription: {
  //   configurable: true,
  //   get() {
  //     const isFirefox = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  //     const isOnGizmoEditor = window.location.href.includes('gpts/editor');

  //     if (isFirefox || isOnGizmoEditor || (window.localStorage.getItem('sp/autoSync') || 'true') !== 'true') {
  //       return this.value;
  //     }
  //     return newUseArkoseSetupEnforcement;
  //   },
  //   set(val) {
  //     this.value = val;
  //   },
  // },
});
