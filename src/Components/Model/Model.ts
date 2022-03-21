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
  handleMoved: string = ''
  tempValue: number = 0;

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

  borderValidator() {
    if (this.state.from < this.state.min) { this.state.from = this.state.min; }
    if (this.state.from > this.state.max) { this.state.from = this.state.max; }
    if (this.state.to < this.state.min) { this.state.to = this.state.min; }
    if (this.state.to > this.state.max) { this.state.to = this.state.max; }
  }
  testData(action: viewEvent) {
    if (action.target === 'handle') {
      if (action.event === 'click') {
        if (action.type === 'from') {
          this.tempValue = this.state.to;
        }
        if (action.type === 'to') {
          this.tempValue = this.state.from;
        }
      }
      if (action.event === 'move') {
        if (action.type === 'from') {
          if (action.value.x > this.state.to) {
            this.handleMoved = 'from';
            this.state.from = this.tempValue;
            this.state.to = action.value.x;
          } else
          if (action.value.x > this.state.from && this.handleMoved === 'from') {
            this.state.from = this.tempValue;
            this.state.to = action.value.x;
          } else {
            this.handleMoved = '';
            this.state.from = this.tempValue;
            this.state.from = action.value.x;
          }
        }
        if (action.type === 'to') {
          if (action.value.x < this.state.from) {
            this.handleMoved = 'to';
            this.state.to = this.tempValue;
            this.state.from = action.value.x;
          } else
          if (action.value.x < this.state.to && this.handleMoved === 'to') {
            this.state.to = this.tempValue;
            this.state.from = action.value.x;
          } else {
            this.handleMoved = '';
            this.state.from = this.tempValue;
            this.state.to = action.value.x;
          }
        }
      }
      if (action.event === 'drop') {
        this.handleMoved = '';
        this.tempValue = 0;
      }
    }

    this.borderValidator();
    this.callback(this.state);
  }
}

export { Model };
