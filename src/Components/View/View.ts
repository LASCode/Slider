import { viewProps } from '../../Types/props';
import { Line } from './subView/Line/Line';
import { viewEvent } from '../../Types/event';
import { Handle } from './subView/Handle/Handle';
import { sliderState } from '../../Types/state';


class View {
  rootNode: HTMLElement;
  sliderNode: HTMLElement;
  callback: Function;
  components!: Array<Line | Handle>

  constructor(props: viewProps) {
    this.rootNode = props.rootNode;
    this.callback = props.callback;
    this.components = [];
    this.sliderNode = this.createSliderNode();
    this.createSubViewComponents();
    this.setCallbackToSubVIewComponents();
  }

  createSliderNode() {
    const element = document.createElement('div');
    element.classList.add('jq-slider');
    this.rootNode.appendChild(element);
    return element;
  }
  createSubViewComponents() {
    this.components.push(new Line(this.sliderNode));
    this.components.push(new Handle(this.sliderNode));
  }
  subViewEventListener(action: viewEvent) {
    this.callback(action);
  }
  setCallbackToSubVIewComponents() {
    this.components.forEach((el) => el.setCallback(this.subViewEventListener.bind(this)));
  }
  updateComponents(state: sliderState) {
    this.components.forEach((component) => component.update(state));
  }
  getSize() {
    return this.rootNode.clientWidth;
  }
  getOfSet() {
    return this.rootNode.offsetLeft;
  }
}

export { View };
