import { viewProps } from '../../Types/props';
import { Line } from './subView/Line/Line';
import { Range } from './subView/Range/Range';
import { viewSliderState } from '../../Types/state';
import { HandleFrom } from './subView/Handle/HandleFrom';
import { HandleTo } from './subView/Handle/HandleTo';
import { subViewEvent, viewCallbackFunction } from '../../Types/ViewEventTypes';
import { Scale } from './subView/Scale/Scale';
import { TipFrom } from './subView/Tip/TipFrom';
import { TipTo } from './subView/Tip/TipTo';

class View {
  rootNode: HTMLElement;

  sliderNode!: HTMLElement;

  callback: viewCallbackFunction;

  tempData: {currentCustomClass: string, currentCustomId: string} = { currentCustomClass: '', currentCustomId: '' }

  components!: Array<Line | Range | HandleTo | HandleFrom | TipFrom | TipTo | Scale>

  constructor(props: viewProps) {
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

  update(state: viewSliderState) {
    this.updateViewNode(state);
    this.updateComponents(state);
  }

  updateComponents(state: viewSliderState) {
    this.components.forEach((component) => component.update(state));
  }

  updateViewNode(state: viewSliderState) {
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

  subViewEventHandler(event: subViewEvent) {
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
