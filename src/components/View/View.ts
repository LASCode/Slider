import { ViewProps } from '../../Types/props';
import { Line } from './SubView/Line/Line';
import { Range } from './SubView/Range/Range';
import { ViewSliderState } from '../../Types/state';
import { HandleFrom } from './SubView/Handle/HandleFrom';
import { HandleTo } from './SubView/Handle/HandleTo';
import { SubViewEvent, ViewCallbackFunction } from '../../Types/view-event-types';
import { Scale } from './SubView/Scale/Scale';
import { TipFrom } from './SubView/Tip/TipFrom';
import { TipTo } from './SubView/Tip/TipTo';

class View {
  rootNode: HTMLElement;

  sliderNode!: HTMLElement;

  callback: ViewCallbackFunction;

  tempData: {currentCustomClass: string, currentCustomId: string} = { currentCustomClass: '', currentCustomId: '' }

  components!: Array<Line | Range | HandleTo | HandleFrom | TipFrom | TipTo | Scale>

  constructor(props: ViewProps) {
    this.rootNode = props.rootNode;
    this.callback = props.callback;
    this.components = [];
    this.createSliderNode();
    this.createSubViewComponents();
  }

  createSliderNode() {
    const element = document.createElement('div');
    element.classList.add('jq-slider');
    this.rootNode.appendChild(element);
    this.sliderNode = element;
  }

  createSubViewComponents() {
    this.components.push(new Line(this.sliderNode));
    this.components.push(new Range(this.sliderNode));
    this.components.push(new HandleFrom(this.sliderNode));
    this.components.push(new HandleTo(this.sliderNode));
    this.components.push(new TipFrom(this.sliderNode));
    this.components.push(new TipTo(this.sliderNode));
    this.components.push(new Scale(this.sliderNode));
    this.components.forEach((el) => el.setCallback(this.subViewEventHandler.bind(this)));
  }

  update(state: ViewSliderState) {
    this.updateViewNode(state);
    this.updateComponents(state);
  }

  updateComponents(state: ViewSliderState) {
    this.components.forEach((component) => component.update(state));
  }

  updateViewNode(state: ViewSliderState) {
    const { customClass, customId } = state;
    const { currentCustomClass, currentCustomId } = this.tempData;
    if (customClass !== currentCustomClass) {
      const classArray = customClass.split(' ').filter((el) => el !== '');
      this.sliderNode.classList.forEach((el, index) => {
        if (index > 0) this.sliderNode.classList.remove(el);
      });
      classArray.forEach((el) => {
        if (el !== '') {
          this.sliderNode.classList.add(el);
        }
      });
      this.tempData.currentCustomClass = customClass;
    }
    if (customId !== currentCustomId) {
      if (customId !== '') {
        this.sliderNode.id = customId;
      } else {
        this.sliderNode.removeAttribute('id');
      }
      this.tempData.currentCustomId = customId;
    }
  }

  subViewEventHandler(event: SubViewEvent) {
    this.callback(event);
  }

  getSize() {
    const {
      left, top, width, height,
    } = this.sliderNode.getBoundingClientRect();
    return ({
      width,
      height,
      clientOffSetX: left,
      clientOffSetY: top,
    });
  }
}

export { View };
