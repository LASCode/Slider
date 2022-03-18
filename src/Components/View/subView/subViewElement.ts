import { viewEvent } from '../../../Types/event';

class subViewElement {
  callback!: Function;
  setCallback(callback: Function) {
    this.callback = callback;
  }
  sendAction(action: viewEvent) {
    this.callback(action);
  }
}
export { subViewElement };
