import { subViewEvent, viewCallbackFunction } from '../../../Types/ViewEventTypes';

class subViewElement {
  componentNode!: HTMLElement
  isMounted: boolean = false
  memoizedValue: any[] = []
  MemoizedValue: {[key: string]: any[]} = {}
  callback!: viewCallbackFunction;
  setCallback(callback: viewCallbackFunction) {
    this.callback = callback;
  }
  sendAction(event: subViewEvent) {
    this.callback(event);
  }
  memoState(props: any[]) {
    if (JSON.stringify(props) !== JSON.stringify(this.memoizedValue)) {
      this.memoizedValue = props;
      return true;
    } else {
      return false;
    }
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
export { subViewElement };
