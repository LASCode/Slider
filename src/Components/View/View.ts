import { viewProps } from '../Types/props';


class View {
  rootNode: HTMLElement;
  state: object;
  callback: Function;

  constructor(props: viewProps) {
    this.rootNode = props.rootNode;
    this.state = props.state;
    this.callback = props.callback;
  }
}

export { View };
