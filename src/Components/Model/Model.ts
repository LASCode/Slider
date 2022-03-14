import { modelProps } from '../Types/props';
import { sliderState } from '../Types/state';

const initialState: sliderState = {
  max: 100,
  min: 0,
  from: 50,
  to: 0,
  isRange: false,
  type: 'horizontal',
};

class Model {
  state: sliderState;
  callback: Function;

  constructor(props: modelProps) {
    this.state = this.combineState(props.state);
    this.callback = props.callback;
  }
  getState() {
    return this.state;
  }
  combineState(state: sliderState): sliderState {
    return { ...initialState, ...state };
  }
}

export { Model };
