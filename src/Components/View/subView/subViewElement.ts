import { subViewEvent, viewCallbackFunction } from '../../../Types/ViewEventTypes';

class subViewElement {
  isMounted: boolean = false;
  memoizedValue: any[] = []
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
}
export { subViewElement };
