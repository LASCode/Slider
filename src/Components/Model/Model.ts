import { modelProps } from '../../Types/props';
import { sliderState } from '../../Types/state';
import {
  handleEvent,
  lineEvent,
  rangeEvent,
  scaleEvent,
  subViewEvent,
  viewEvent,
  viewEventType
} from '../../Types/event';

const initialState: sliderState = {
  max: 100,
  min: 0,
  step: 100,
  size: { height: 0, width: 0, offSetX: 0, offSetY: 0 },
  from: { px: 0, percent: 0, total: 0, isAbstractHold: false, isHold: false },
  to: { px: 0, percent: 0, total: 0, isAbstractHold: false, isHold: false },
  isRange: false,
  horizontal: true,
  scaleStep: 0,
  scaleStepsArr: [],
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

  convertPixelToValue(px: number): number {
    const { horizontal, size, max, min } = this.state;
    const offSet = horizontal ? size.offSetX : size.offSetY;
    const width = horizontal ? size.width : size.height;
    return (px - offSet) / (width / (max - min)) + min;
  }
  convertValueToPercent(value: number): number {
    const { horizontal, size, max, min } = this.state;
    return (100 / (max - min)) * (value - min);
  }
  correctValueToStep(value: number, step: number): number {
    const stepCopy = (step <= 0 ? 0.01 : step);
    return +(Math.round(value / stepCopy) * stepCopy);
  }

  lineValidator(action: lineEvent) {
    const modAction = this.normalizeActionValue(action);
    const { target, type, event, value } = modAction;
    const typeOfAxleCoords = this.state.horizontal ? 'x' : 'y';
    if (event === 'click') {
      if (this.state.isRange) {
        if (value[typeOfAxleCoords] < this.state.from.total) {
          this.state.from.total = action.value[typeOfAxleCoords];
        } else {
          this.state.to.total = action.value[typeOfAxleCoords];
        }
      } else {
        this.state.from.total = action.value[typeOfAxleCoords];
      }
    }
  }
  rangeValidator(action: rangeEvent) {
    const modAction = this.normalizeActionValue(action);
    const { target, type, event, value } = modAction;
    const typeOfAxleCoords = this.state.horizontal ? 'x' : 'y';
    if (event === 'click') {
      if (this.state.isRange) {
        if (((this.state.to.total - this.state.from.total) / 2 + this.state.from.total) > value[typeOfAxleCoords]) {
          this.state.from.total = value[typeOfAxleCoords];
        } else {
          this.state.to.total = value[typeOfAxleCoords];
        }
      } else {
        this.state.from.total = value[typeOfAxleCoords];
      }
    }
  }
  scaleValidator(action: scaleEvent) {
    const copyAction = this.normalizeActionValue(action);
    const { target, type, event, value } = copyAction;
    const typeOfAxleCoords = this.state.horizontal ? 'x' : 'y';
    const correctStepValue = this.correctValueToStep(value[typeOfAxleCoords], this.state.scaleStep);
    console.log(copyAction)

    if (event === 'click') {
      if (this.state.isRange) {
        const fromOffSet = Math.abs(this.state.from.total - correctStepValue);
        const toOffSet = Math.abs(this.state.to.total - correctStepValue);
        if (fromOffSet > toOffSet) { this.state.to.total = correctStepValue; }
        if (fromOffSet < toOffSet) { this.state.from.total = correctStepValue; }
        if (fromOffSet === toOffSet) { this.state.from.total = correctStepValue; }
      } else {
        this.state.from.total = correctStepValue;
      }
    }
  }
  handleValidator(action: handleEvent) {
    const { target, type, event, value } = action;
    value.x = (value.x - this.state.size.offSetX) / ((this.state.horizontal ? this.state.size.width : this.state.size.height) / (this.state.max - this.state.min)) + this.state.min;
    value.y = (value.y - this.state.size.offSetY) / ((this.state.horizontal ? this.state.size.width : this.state.size.height) / (this.state.max - this.state.min)) + this.state.min;

    const typeOfAxleCoords = this.state.horizontal ? 'x' : 'y';
    const oppositeType = (type === 'from' ? 'to' : 'from');
    const isFrom = (type === 'from');
    if (event === 'click') {
      this.state[type].isHold = true;
      this.state[type].isAbstractHold = true;
      this.tempValue = this.state[oppositeType].total;
    }
    if (event === 'move') {
      if (this.state.isRange) {
        if ((isFrom ? value[typeOfAxleCoords] > this.state.to.total : value[typeOfAxleCoords] < this.state.from.total)) {
          this.state[oppositeType].isAbstractHold = true;
          this.state[type].isAbstractHold = false;
          this.handleMoved = type;
          this.state[type].total = this.tempValue;
          this.state[oppositeType].total = value[typeOfAxleCoords];
        } else
        if ((isFrom ? value[typeOfAxleCoords] > this.state.from.total : value[typeOfAxleCoords] < this.state.to.total) && this.handleMoved === type) {
          this.state[type].isAbstractHold = false;
          this.state[oppositeType].isAbstractHold = true;
          this.state[type].total = this.tempValue;
          this.state[oppositeType].total = value[typeOfAxleCoords];
        } else {
          this.state[type].isHold = true;
          this.state[type].isAbstractHold = true;
          this.state[oppositeType].isHold = false;
          this.state[oppositeType].isAbstractHold = false;
          this.handleMoved = '';
          this.state[oppositeType].total = this.tempValue;
          this.state[type].total = value[typeOfAxleCoords];
        }
      } else {
        // this.state[type].isHold = true;
        // this.state[type].isAbstractHold = true;
        this.handleMoved = '';
        this.state[type].total = this.tempValue;
        this.state[type].total = value[typeOfAxleCoords];
      }


      if (type === 'from' && false) {
        if (this.state.isRange) {
          if (value[typeOfAxleCoords] > this.state.to.total) {
            this.handleMoved = 'from';
            this.state.from.total = this.tempValue;
            this.state.to.total = value[typeOfAxleCoords];
          } else
          if (value[typeOfAxleCoords] > this.state.from.total && this.handleMoved === 'from') {
            this.state.from.total = this.tempValue;
            this.state.to.total = value[typeOfAxleCoords];
          } else {
            this.handleMoved = '';
            this.state.to.total = this.tempValue;
            this.state.from.total = value[typeOfAxleCoords];
          }
        } else {
          this.handleMoved = '';
          this.state.from.total = this.tempValue;
          this.state.from.total = value[typeOfAxleCoords];
        }
      }
      if (type === 'to' && false) {
        if (value[typeOfAxleCoords] < this.state.from.total) {
          this.handleMoved = 'to';
          this.state.to.total = this.tempValue;
          this.state.from.total = value[typeOfAxleCoords];
        } else
        if (value[typeOfAxleCoords] < this.state.to.total && this.handleMoved === 'to') {
          this.state.to.total = this.tempValue;
          this.state.from.total = value[typeOfAxleCoords];
        } else {
          this.handleMoved = '';
          this.state.from.total = this.tempValue;
          this.state.to.total = value[typeOfAxleCoords];
        }
      }
    }
    if (event === 'drop') {
      this.state[oppositeType].isHold = false;
      this.state[oppositeType].isAbstractHold = false;
      this.state[type].isAbstractHold = false;
      this.state[type].isHold = false;
      this.handleMoved = '';
      this.tempValue = 0;
    }
  }

  borderValidator() {
    if (this.state.from.total < this.state.min) { this.state.from.total = this.state.min; }
    if (this.state.from.total > this.state.max) { this.state.from.total = this.state.max; }
    if (this.state.to.total < this.state.min) { this.state.to.total = this.state.min; }
    if (this.state.to.total > this.state.max) { this.state.to.total = this.state.max; }
  }
  totalValueValidator() {
    const b1 = (v1:number)=>{
      return 100 / (this.state.max - this.state.min) * (v1 - this.state.min)
    };
    // this.state.from.percent = (this.state.from.total / b) * 100;
    // this.state.from.percent = this.state.from.total / ((this.state.max - this.state.min) / 100) + offSetPercent;
    this.state.from.percent = b1(this.state.from.total);
    this.state.to.percent = b1(this.state.to.total);
    // this.state.to.percent = this.state.to.total / ((this.state.max - this.state.min) / 100) + offSetPercent;
    this.state.from.px = ((this.state.horizontal?this.state.size.width:this.state.size.height) / 100) * this.state.from.percent;
    this.state.to.px = ((this.state.horizontal?this.state.size.width:this.state.size.height) / 100) * this.state.to.percent;
    // this.state.from = {
    //   ...this.state.from,
    //   percent: this.state.from.total / ((this.state.max - this.state.min) / 100),
    //   px: ((this.state.horizontal?this.state.size.width:this.state.size.height)/100),
    // };
    // this.state.to = {
    //   ...this.state.to,
    //   percent: this.state.to.total / ((this.state.max - this.state.min) / 100),
    //   px: (this.state.horizontal?this.state.size.width:this.state.size.height)/100,
    // };
  }
  stepValidator() {
    function checkStep(value: number, step: number): number {
      const stepCopy = (step <= 0 ? 0.01 : step);
      return +(Math.round(value / stepCopy) * stepCopy);
    }
    this.state.from.total = checkStep(this.state.from.total, this.state.step);
    this.state.to.total = checkStep(this.state.to.total, this.state.step);
  }
  toFixedValidator() {
    this.state = {
      ...this.state,
      from: {
        ...this.state.from,
        total: Math.floor(this.state.from.total * 100) / 100,
        px: Math.floor(this.state.from.px * 100) / 100,
        percent: Math.floor(this.state.from.percent * 100) / 100,
      },
      to: {
        ...this.state.to,
        total: Math.floor(this.state.to.total * 100) / 100,
        px: Math.floor(this.state.to.px * 100) / 100,
        percent: Math.floor(this.state.to.percent * 100) / 100,
      }
    }
  }

  normalizeActionValue(action: lineEvent | handleEvent | rangeEvent | scaleEvent) {
    const copyAction = { ...action };
    copyAction.value.x = this.convertPixelToValue(copyAction.value.x);
    copyAction.value.y = this.convertPixelToValue(copyAction.value.y);
    return copyAction;
  }

  testData(action: viewEventType) {
    if (action.type === 'resizeViewEvent') {
      this.state.size = { ...this.state.size, ...action.data };
      this.callback(this.state);
    }
    if (action.type === 'subViewEvent') {
      if (action.data.target === 'handle') { this.handleValidator(action.data); }
      if (action.data.target === 'line') { this.lineValidator(action.data); }
      if (action.data.target === 'range') { this.rangeValidator(action.data); }
      if (action.data.target === 'scale') { this.scaleValidator(action.data); }
    }
    this.stepValidator();
    this.borderValidator();
    this.totalValueValidator();
    this.toFixedValidator();
    this.callback(this.state);
  }
}

export { Model };
