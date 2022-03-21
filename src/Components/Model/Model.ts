import { modelProps } from '../../Types/props';
import { sliderState } from '../../Types/state';
import { viewEvent } from '../../Types/event';

const initialState: sliderState = {
  max: 100,
  min: 0,
  from: 50,
  to: 0,
  isRange: false,
  horizontal: true,
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
    console.log(action);
    const coordsName = this.state.horizontal ? 'x' : 'y';
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
          if (this.state.isRange) {
            if (action.value[coordsName] > this.state.to) {
              this.handleMoved = 'from';
              this.state.from = this.tempValue;
              this.state.to = action.value[coordsName];
            } else
            if (action.value[coordsName] > this.state.from && this.handleMoved === 'from') {
              this.state.from = this.tempValue;
              this.state.to = action.value[coordsName];
            } else {
              this.handleMoved = '';
              this.state.to = this.tempValue;
              this.state.from = action.value[coordsName];
            }
          } else {
            this.handleMoved = '';
            this.state.from = this.tempValue;
            this.state.from = action.value[coordsName];
          }
        }
        if (action.type === 'to') {
          if (action.value[coordsName] < this.state.from) {
            this.handleMoved = 'to';
            this.state.to = this.tempValue;
            this.state.from = action.value[coordsName];
          } else
          if (action.value[coordsName] < this.state.to && this.handleMoved === 'to') {
            this.state.to = this.tempValue;
            this.state.from = action.value[coordsName];
          } else {
            this.handleMoved = '';
            this.state.from = this.tempValue;
            this.state.to = action.value[coordsName];
          }
        }
      }
      if (action.event === 'drop') {
        this.handleMoved = '';
        this.tempValue = 0;
      }
    }
    if (action.target === 'line') {
      if (action.event === 'click') {
        if (this.state.isRange) {
          if (action.value[coordsName] < this.state.from) {
            this.state.from = action.value[coordsName];
          } else {
            this.state.to = action.value[coordsName];
          }
        } else {
          this.state.from = action.value[coordsName];
        }
      }
    }
    if (action.target === 'range') {
      if (action.event === 'click') {
        if (this.state.isRange) {
          if (((this.state.to - this.state.from) / 2 + this.state.from) > action.value[coordsName]) {
            this.state.from = action.value[coordsName];
          } else {
            this.state.to = action.value[coordsName];
          }
        } else {
          this.state.from = action.value[coordsName];
        }
      }
    }


    this.borderValidator();
    this.callback(this.state);
  }
}

export { Model };
