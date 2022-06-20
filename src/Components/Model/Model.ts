import { SliderState, SliderStateModified } from '../../Types/state';
import { checkStep, getFixedValueWithStep } from '../../utils/utils';
import { modelProps } from '../../Types/props';

class Model {
  state: SliderState;

  callback: Function;

  constructor(props: modelProps) {
    this.state = { ...this.getDefaultState(), ...props.state };
    this.callback = props.callback;
    this.validateState();
  }

  getState(): SliderState {
    return this.state;
  }

  setState(properties: SliderStateModified) {
    this.state = { ...this.state, ...properties };
    this.validateState();
    this.state.onChangeFunction(this.state);
    this.callback(this.state);
  }

  getDefaultState(): SliderState {
    return ({
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
      onChangeFunction: (state) => {},
      tipsValueFunction: (value) => `${value}`,
    });
  }

  validateState() {
    if (this.state.min >= this.state.max) this.state.min = this.state.max - 1;

    if (this.state.scaleStep < 0) { this.state.scaleStep = 0; }

    if (this.state.step > this.state.max) { this.state.step = this.state.max; }
    if (this.state.step <= 0.00001) { this.state.step = 0.00001; }

    this.state.from = checkStep({
      value: this.state.from,
      step: this.state.step,
    });
    this.state.to = checkStep({
      value: this.state.to,
      step: this.state.step,
    });

    this.state.from = getFixedValueWithStep({
      value: this.state.from,
      step: this.state.step,
    });
    this.state.to = getFixedValueWithStep({
      value: this.state.to,
      step: this.state.step,
    });

    if (this.state.from < this.state.min) { this.state.from = this.state.min; }
    if (this.state.from > this.state.max) { this.state.from = this.state.max; }
    if (this.state.isRange && this.state.to < this.state.from) {
      this.state.to = this.state.from;
      this.state.from = this.state.to;
    }
    if (this.state.to < this.state.min) { this.state.to = this.state.max; }
    if (this.state.to > this.state.max) { this.state.to = this.state.max; }
  }
}

export { Model };
