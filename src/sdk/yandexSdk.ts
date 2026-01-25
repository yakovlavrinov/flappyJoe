// yandexSdk.ts
import type { SDK } from 'ysdk';

declare global {
  interface Window {
    ysdk?: SDK;
    ysdkPromise?: Promise<SDK>;
  }
}

let initPromise: Promise<SDK> | undefined = undefined;

export function initYandexSDK(): Promise<SDK> {
  if (window.ysdk) {
    return Promise.resolve(window.ysdk);
  }

  if (window.ysdkPromise) {
    return window.ysdkPromise;
  }

  initPromise = YaGames.init(/* { signed: true } если покупки на сервере */)
    .then((ysdk: SDK) => {
      console.log('Yandex SDK initialized');
      window.ysdk = ysdk;
      return ysdk;
    })
    .catch(err => {
      console.error('Yandex SDK init failed', err);
      throw err;
    });

  window.ysdkPromise = initPromise;
  return initPromise;
}


export function getYsdk(): SDK | undefined {
  return window.ysdk;
}


export async function getYsdkAsync(): Promise<SDK> {
  return initYandexSDK();
}