import { subViewEvent, viewCallbackFunction } from '../../../Types/ViewEventTypes';

class SubViewElement {
  componentNode!: HTMLElement

  isMounted: boolean = false

  MemoizedValue: {[key: string]: any[]} = {}

  callback!: viewCallbackFunction;

  setCallback(callback: viewCallbackFunction) {
    this.callback = callback;
  }

  sendAction(event: subViewEvent) {
    this.callback(event);
  }

  MemoState(name: string, data: any[]) {
    const memoizedData = this.MemoizedValue[name];
    const isUndefined = memoizedData === undefined;
    const isNotIdentical = JSON.stringify(memoizedData) !== JSON.stringify(data);
    if (isUndefined) {
      this.MemoizedValue[name] = data;
      return true;
    }
    if (!isUndefined && isNotIdentical) {
      this.MemoizedValue[name] = data;
      return true;
    }
    return false;
  }
}
export { SubViewElement };
