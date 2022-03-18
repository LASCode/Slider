import { modelProps } from '../../Types/props';
import { sliderState } from '../../Types/state';
import { viewEvent } from '../../Types/event';

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
  testData(action: viewEvent) {
    if (this.state.type === 'horizontal'){
      this.state.from = action.value.x;
    }
    if (this.state.type === 'vertical'){
      this.state.from = action.value.y;
    }
    if (action.value.x < 0) {this.state.from = 0}
    if (action.value.x >= 100) {this.state.from = 100}
    this.callback(this.state);
  }
}

export { Model };
