import {
  SliderState,
  SliderStateModified,
} from '../../Types/state';
import {
  getFixedValueWithStep,
  getNumAfterComma,
  checkStep,
} from '../../utils/utils';



const defaultState: SliderState = {
  max: 100,
  min: 0,
  from: 0,
  to: 0,
  step: 0,
  scaleStep: 0,
  isRange: false,
  horizontal: true,
  tips: true,
  handleSplit: true,
  invert: false,
  customId: '',
  customClass: '',
  onChangeFunction: () => {},
  changeValueFunction: () => {},
};

class Model {
  oldState: SliderState;
  state: SliderState;
  callback: Function;

  constructor(props: {state: SliderStateModified, callback: Function}) {
    this.state = { ...defaultState, ...props.state };
    this.oldState = this.state;
    this.callback = props.callback;
    this.validateState();
  }
  getState(): SliderState {
    return this.state;
  }
  setState(properties: SliderStateModified) {
    this.oldState = this.state;
    this.state = { ...this.state, ...properties };
    this.validateTypes();
    this.validateState();
    this.state.onChangeFunction(this.state);
    this.callback(this.state);
  }
  validateState() {
    const { max, min, from, to, step, isRange, scaleStep } = this.state;

    if (min > max) { this.state.max = this.state.min; }

    if (scaleStep < 0) { this.state.scaleStep = 0; }
    if (step < 0) { this.state.step = 0; }
    if (getNumAfterComma(this.state.step) > 5) { this.state.step = 0.00001; }

    this.state.from = checkStep(this.state.from, this.state.step);
    this.state.to = checkStep(this.state.to, this.state.step);

    this.state.from = getFixedValueWithStep(this.state.from, this.state.step);
    this.state.to = getFixedValueWithStep(this.state.to, this.state.step);

    if (this.state.max === min) { this.state.max = this.state.max + 1; }
    if (this.state.from < min) { this.state.from = this.state.min; }
    if (this.state.from > this.state.max) { this.state.from = this.state.max; }
    if (isRange && this.state.to < this.state.from) { this.state.to = this.state.from; this.state.from = this.state.to; }
    if (this.state.to < this.state.min) { this.state.to = this.state.max; }
    if (this.state.to > this.state.max) { this.state.to = this.state.max; }
  }
  validateTypes() {
    const { max, min, from, to, step, isRange } = this.state;
    if (typeof max !== 'number') { this.state.max = this.oldState.max; }
    if (typeof min !== 'number') { this.state.min = this.oldState.min; }
    if (typeof from !== 'number') { this.state.from = this.oldState.from; }
    if (typeof to !== 'number') { this.state.to = this.oldState.to; }
  }
}

export { Model };
