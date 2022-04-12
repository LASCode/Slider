import { viewProps } from '../../Types/props';
import { viewEvent } from '../../Types/event';
import { Line } from './subView/Line/Line';
import { Range } from './subView/Range/Range';
import { sliderState } from '../../Types/state';
import { HandleFrom } from './subView/Handle/HandleFrom';
import { HandleTo } from './subView/Handle/HandleTo';
import { TipFrom } from './subView/Tip/TipFrom';
import {TipTo} from "./subView/Tip/TipTo";
import {Scale} from "./subView/Scale/Scale";
import {TipTestFrom} from "./subView/Tip/TipTestFrom";
import {TipTestTo} from "./subView/Tip/TipTestTo";


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
    this.setResizeListener();
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
    this.components.push(new TipFrom(this.sliderNode));
    this.components.push(new TipTo(this.sliderNode));
    this.components.push(new Scale(this.sliderNode));
  }

  setCallbackToSubVIewComponents() {
    this.components.forEach((el) => el.setCallback(this.sendViewEventToPresenter.bind(this)));
  }
  updateComponents(state: sliderState) {
    this.components.forEach((component) => component.update(state));
  }
  setResizeListener() {
    this.sendSliderSize = this.sendSliderSize.bind(this);
    window.addEventListener('resize', this.sendSliderSize);
  }
  sendViewEventToPresenter(action: viewEvent) {
    this.callback({
      type: 'subViewEvent',
      data: action,
    });
  }
  sendSliderSize() {
    this.callback({
      type: 'resizeViewEvent',
      data: this.getSize(),
    });
  }
  getSize() {
    return ({
      height: this.sliderNode.clientHeight,
      width: this.sliderNode.clientWidth,
      offSetX: this.rootNode.offsetLeft,
      offSetY: this.rootNode.offsetTop,
    });
  }
  getOffSet() {
    return ({
      sliderOffSetX: this.rootNode.offsetLeft,
      sliderOffSetY: this.rootNode.offsetTop,
    });
  }
}

export { View };
