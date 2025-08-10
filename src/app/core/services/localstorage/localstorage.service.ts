import { Injectable } from '@angular/core';

export enum StorageKey {
  NOTIFIER_VISIBILITY = 'notification',
}

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  setValueToStorage(key: StorageKey, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
    return this.getValueFromStorage(key);
  }

  getValueFromStorage(key: StorageKey, func?: (...args: any[]) => any) {
    const value = localStorage.getItem(key);
    if (!value) {
      console.log(`LocalStorage: Value ${key} not found`);
      return null;
    }

    if (func) {
      return func(JSON.parse(value));
    }

    return JSON.parse(value);
  }

  updateValueInStorage(key: StorageKey, updateFc: (v: any) => any) {
    let value = this.getValueFromStorage(key);
    if (!value) {
      value = this.setValueToStorage(key, {})
    }
    const result = updateFc(value);
    this.setValueToStorage(key, result);
  }
}
