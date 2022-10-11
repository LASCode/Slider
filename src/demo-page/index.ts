import './index.pug';
import './index.scss';
import '../index.ts';
import './demo-components/demo-panel-card/demo-panel-card.scss';
import './demo-components/configurator/configurator.scss';
import { SliderState, SliderStateModified, StateProperties } from '../Types/state';

const initialDataArr: SliderStateModified[] = [
  {
    max: 1000,
    min: -1000,
    from: -500,
    to: 500,
    step: 1,
    scaleStep: 250,
    isRange: true,
    horizontal: true,
    invert: false,
    handleSplit: true,
    customClass: 'slider1',
    customId: 'UwU',
  },
  {
    max: 1,
    min: 0,
    from: 0.5,
    to: 0,
    step: 0.005,
    scaleStep: 0.1,
    isRange: false,
    horizontal: false,
    invert: true,
    handleSplit: true,
    customClass: 'slider2',
    customId: '(͡° ͜ʖ ͡°)',
    tipsValueFunction: (value) => `${value} Р`,
  },
  {
    max: 10000,
    min: -5000,
    from: -2500,
    to: 7500,
    step: 2500,
    scaleStep: 2500,
    isRange: true,
    horizontal: false,
    invert: false,
    handleSplit: false,
    customClass: 'slider3',
    customId: '(O,o)',
    tipsValueFunction: (value) => `${value}`,
  },
  {
    max: 500,
    min: -50,
    from: 150,
    to: 0,
    step: 50,
    scaleStep: 50,
    isRange: false,
    horizontal: true,
    invert: true,
    handleSplit: false,
    customClass: 'slider4',
    customId: '(`･ω･´)',
  },
];

class DemoPanel {
  rootNode: HTMLElement

  sliderNode: JQuery

  panelNode: JQuery

  inputElementsArray: HTMLInputElement[] = []

  constructor(element: HTMLElement, options: SliderStateModified) {
    this.rootNode = element;
    this.sliderNode = $(this.rootNode).find('.js-demoPanelSliderNode');
    this.panelNode = $(this.rootNode).find('.js-demoPanelConfig');
    this.createSlider({ ...options, onChangeFunction: this.onChangeSlider.bind(this) });
    this.getInputs();
    this.setInputListener();
    this.setValues(this.getState());
  }

  createSlider(options: SliderStateModified) {
    this.sliderNode.jqSlider({
      type: 'init',
      data: options,
    });
  }

  onChangeSlider() {
    this.setValues(this.getState());
  }

  getInputs() {
    this.panelNode.find('input').each((index, element) => {
      this.inputElementsArray.push(element);
    });
  }

  setInputListener() {
    this.inputElementsArray.forEach((el) => {
      switch (el.type) {
        case 'text': el.addEventListener('focusout', this.onChange.bind(this)); break;
        case 'number': el.addEventListener('focusout', this.onChange.bind(this)); break;
        default: el.addEventListener('input', this.onChange.bind(this));
      }
    });
  }

  onChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.type === 'checkbox') {
      this.setState({ [target.name]: target.checked });
    } else
    if (target.type === 'number') {
      this.setState({ [target.name]: Number(target.value) });
    } else {
      this.setState({ [target.name]: target.value });
    }
  }

  setState(state: SliderStateModified) {
    this.sliderNode.jqSlider({
      type: 'update',
      data: state,
    });
  }

  setValues(state: SliderState) {
    this.inputElementsArray.forEach((el) => {
      if (el instanceof HTMLInputElement) {
        if (el.type === 'checkbox') {
          $(el).prop('checked', state[el.name as StateProperties]);
        }
        if (el.type === 'number') {
          $(el).val(state[el.name as StateProperties].toString());
        }
        if (el.type === 'text') {
          $(el).val(state[el.name as StateProperties].toString());
        }
      }
    });
  }

  getState(): SliderState {
    return <SliderState> this.sliderNode.jqSlider({
      type: 'getState',
      data: [],
    });
  }
}

$(document).ready(() => {
  $('.js-demoPanelRoot').each((index, element) => {
    new DemoPanel(element, initialDataArr[index]);
  });
});
