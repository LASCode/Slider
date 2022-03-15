import { viewProps } from '../Types/props';


class View {
  rootNode: HTMLElement;
  sliderNode: HTMLElement;
  state: object;
  callback: Function;

  constructor(props: viewProps) {
    this.rootNode = props.rootNode;
    this.state = props.state;
    this.callback = props.callback;
    this.sliderNode = this.createSliderNode();
  }

  createSliderNode() {
    const element = document.createElement('div');
    element.classList.add('jq-slider');
    this.rootNode.appendChild(element);
    return element;
  }
}

export { View };
