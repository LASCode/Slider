import { SubViewEvent, ViewCallbackFunction } from '../../../Types/view-event-types';

class SubViewElement {
  componentNode!: HTMLElement

  isMounted: boolean = false

  memoizedData: {[key: string]: any[]} = {}

  callback!: ViewCallbackFunction;

  setCallback(callback: ViewCallbackFunction) {
    this.callback = callback;
  }

  sendAction(event: SubViewEvent) {
    this.callback(event);
  }

  memo(name: string, data: any[]) {
    const memoizedData = this.memoizedData[name];
    const isUndefined = memoizedData === undefined;
    const isNotIdentical = JSON.stringify(memoizedData) !== JSON.stringify(data);
    if (isUndefined) {
      this.memoizedData[name] = data;
      return true;
    }
    if (!isUndefined && isNotIdentical) {
      this.memoizedData[name] = data;
      return true;
    }
    return false;
  }
}
export { SubViewElement };
