import './demoPage.scss';
import '../index.ts';
import {SliderState, SliderStateModified, StateProperties, userOptions} from '../Types/state';


const initialDataArr = [
  {
    max: 100,
    min: 0,
    from: 33,
    to: 0,
    step: 0.000001,
    isRange: false,
    scaleStep: 0,
    horizontal: false,
  },
];



class demoPanel {
  rootNode: HTMLElement
  sliderNode: JQuery
  panelNode: JQuery
  inputElementsArray: HTMLInputElement[] = []
  constructor(element: HTMLElement, options: userOptions) {
    this.rootNode = element;
    this.sliderNode = $(this.rootNode).find('.demoPanel__slider');
    this.panelNode = $(this.rootNode).find('.demoPanel__panel');
    this.createSlider({...options, onChangeFunction: this.onChangeSlider.bind(this)});
    this.getInputs();
    this.setInputListener();
    this.setValues(this.getState());
  }
  createSlider(options: userOptions) {
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
      el.addEventListener('input', this.onChange.bind(this));
    });
  }
  onChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.type === 'checkbox') {
      this.setState({ [target.name]: target.checked });
    } else {
      this.setState({ [target.name]: Number(target.value) });
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
      }
    });




    // const b = Object.fromEntries(this.inputElementsArray.map(((el) => {
    //   return [el.name, el];
    // })));
    // console.log(Object.entries(b));
    // Object.entries(b).forEach((el) => {
    //   el[1].value = state[el[0]];
    // });
    // const { horizontal, isRange, max, min, from, to } = this.inputKeyObj;
    // horizontal.checked = state.horizontal;
    // isRange.checked = state.isRange;
    // max.value = state.max.toString();
    // min.value = state.min.toString();
    // from.value = state.from.toString();
    // to.value = state.to.toString();
  }
  getState(): SliderState {
    return <SliderState> this.sliderNode.jqSlider({
      type: 'getState',
      data: [],
    });
  }
}





$(document).ready(() => {
  $('.demoPanel').each((index, element) => {
    const panel = new demoPanel(element, initialDataArr[index]);
  });
});



// $('.page__slider').jqSlider({
//   type: 'init',
//   data: {
//     max: 100,
//     min: 0,
//     from: 0,
//     to: 400,
//     step: 0.000001,
//     isRange: true,
//     scaleStep: 10,
//     horizontal: true,
//     onChangeFunction: ()=>{},
//   },
// });
