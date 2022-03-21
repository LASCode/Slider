import { viewProps } from '../../Types/props';
import { viewEvent } from '../../Types/event';
import { Line } from './subView/Line/Line';
import { Range } from './subView/Range/Range';
import { sliderState } from '../../Types/state';
import { HandleFrom } from './subView/Handle/HandleFrom';
import { HandleTo } from './subView/Handle/HandleTo';
import { TipFrom } from './subView/Tip/TipFrom';


class View {
  rootNode: HTMLElement;
  sliderNode: HTMLElement;
  callback: Function;
  components!: Array<Line | HandleFrom | HandleTo | Range>

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
    this.components.push(new Range(this.sliderNode));
    this.components.push(new HandleFrom(this.sliderNode));
    this.components.push(new HandleTo(this.sliderNode));
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
  getOfSetX() {
    return this.rootNode.offsetLeft;
  }
  getOfSetY() {
    return this.rootNode.offsetTop;
  }
}

export { View };
