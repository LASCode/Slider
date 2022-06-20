import { Model } from '../Model/Model';
import { View } from '../View/View';
import {
  SliderState,
  SliderStateModified,
  viewSliderState,
  presenterTempData,
} from '../../Types/state';
import { subViewEvent } from '../../Types/ViewEventTypes';
import {
  getScaleItemsArray, invertValue, pixelToValue, valueToPercent, valueToPixel,
} from '../../utils/utils';
import { presenterProps } from '../../Types/props';
import { handleEvent } from '../../Types/SubViewEvents/HandleTypes';
import { tipEvent } from '../../Types/SubViewEvents/TipTypes';

class Presenter {
  rootNode: HTMLElement;
  View: View;
  Model: Model;
  private tempData: presenterTempData = {
    handlePressedLast: null,
    handleMovingNow: null,
    handlePressedNow: null,
    handleSelected: null,
    handleValue: 0,
  }

  constructor(props: presenterProps) {
    this.rootNode = props.rootNode;
    this.Model = new Model({
      state: props.initialState,
      callback: this.modelEventHandler.bind(this),
    });
    this.View = new View({
      rootNode: this.rootNode,
      callback: this.viewEventHandler.bind(this),
    });
    this.View.update(this.convertStateToViewState(this.Model.getState()));
  }

  handleValidate(event: handleEvent | tipEvent): SliderStateModified {
    const {
      to, from, isRange, handleSplit,
    } = this.Model.getState();
    const { action, type } = event;
    const { handleSelected } = this.tempData;
    const value = this.getCorrectPositionFromEventValue(event);
    const result: SliderStateModified = {};

    if (value === false) return {};

    const isFrom = (type === 'from');
    const handleTypeOpposite = isFrom ? 'to' : 'from';
    const handleValue = {
      current: isFrom ? from : to,
      opposite: isFrom ? to : from,
    };
    const toLessValue = to < value;
    const toLargerValue = to > value;
    const fromLessValue = from < value;
    const fromLargerValue = from > value;
    const handlesHasSwitched = handleSelected === type;
    const movedInsideHisPlace = (isFrom ? toLargerValue : fromLessValue);
    const isMovingAwayFrom = (isFrom ? toLessValue : fromLargerValue);
    const isMovingCloseIn = (isFrom ? fromLessValue : toLargerValue) && handlesHasSwitched;

    if (action === 'click') {
      this.tempData.handleValue = handleValue.opposite;
      this.tempData.handlePressedNow = type;
      this.tempData.handlePressedLast = type;
    }
    if (action === 'move') {
      if (isRange) {
        if (handleSplit) {
          if (isMovingAwayFrom) {
            this.tempData.handleSelected = type;
            this.tempData.handleMovingNow = handleTypeOpposite;
            this.tempData.handlePressedLast = handleTypeOpposite;
            result[type] = this.tempData.handleValue;
            result[handleTypeOpposite] = value;
          } else
          if (isMovingCloseIn) {
            this.tempData.handleMovingNow = handleTypeOpposite;
            this.tempData.handlePressedLast = handleTypeOpposite;
            result[type] = this.tempData.handleValue;
            result[handleTypeOpposite] = value;
          } else {
            this.tempData.handlePressedLast = type;
            this.tempData.handleMovingNow = type;
            this.tempData.handleSelected = null;
            result[handleTypeOpposite] = this.tempData.handleValue;
            result[type] = value;
          }
        }
        if (!handleSplit) {
          if (movedInsideHisPlace) {
            result[type] = value;
            result[handleTypeOpposite] = handleValue.opposite;
          } else {
            result[type] = handleValue.opposite;
            result[handleTypeOpposite] = handleValue.opposite;
          }
        }
      } else {
        this.tempData.handleSelected = null;
        result[type] = value;
        result[handleTypeOpposite] = handleValue.opposite;
      }
    }
    if (action === 'drop') {
      this.tempData.handleSelected = null;
      this.tempData.handleMovingNow = null;
      this.tempData.handlePressedNow = null;
      this.tempData.handleValue = 0;
    }

    return result;
  }
  lineValidate(event: subViewEvent): SliderStateModified {
    const { to, from, isRange } = this.Model.getState();
    const { action } = event;
    const value = this.getCorrectPositionFromEventValue(event);
    const result: SliderStateModified = {};

    if (value === false) return {};

    if (action === 'click') {
      if (isRange && value <= ((to - from) / 2 + from)) {
        result.from = value;
      } else
      if (isRange && value > ((to - from) / 2 + from)) {
        result.to = value;
      } else
      if (!isRange) {
        result.from = value;
      }
    }
    return result;
  }

  viewEventHandler(event: subViewEvent): void {
    let modelEvent: SliderStateModified = {};
    switch (event.target) {
      case 'line': modelEvent = this.lineValidate(event); break;
      case 'range': modelEvent = this.lineValidate(event); break;
      case 'scale': modelEvent = this.lineValidate(event); break;
      case 'handle': modelEvent = this.handleValidate(event); break;
      case 'tip': modelEvent = this.handleValidate(event); break;
      default: break;
    }
    this.updateModel(modelEvent);
  }
  modelEventHandler(state: SliderState): SliderState {
    this.updateView(state);
    return state;
  }
  updateView(state: SliderState): void {
    this.View.update(this.convertStateToViewState(state));
  }
  public updateModel(event: SliderStateModified): void {
    this.Model.setState(event);
  }

  convertStateToViewState(state: SliderState): viewSliderState {
    const {
      from, to, max, min, horizontal, scaleStep, tipsValueFunction,
    } = state;
    const { height, width } = this.View.getSize();
    return ({
      ...state,
      from: {
        percent: valueToPercent({
          max,
          min,
          value: from,
        }),
        px: valueToPixel({
          min,
          max,
          size: horizontal ? width : height,
          value: from,
        }),
        total: from,
        movingNow: this.tempData.handleMovingNow === 'from',
        pressedNow: this.tempData.handlePressedNow === 'from',
        pressedLast: this.tempData.handlePressedLast === 'from',
      },
      to: {
        percent: valueToPercent({
          max,
          min,
          value: to,
        }),
        px: valueToPixel({
          min,
          max,
          size: horizontal ? width : height,
          value: to,
        }),
        total: to,
        movingNow: this.tempData.handleMovingNow === 'to',
        pressedNow: this.tempData.handlePressedNow === 'to',
        pressedLast: this.tempData.handlePressedLast === 'to',
      },
      scaleItemsArray: getScaleItemsArray({
        max,
        min,
        step: scaleStep,
      }),
      tipsValueFunction,
    });
  }
  getCorrectPositionFromEventValue(event: subViewEvent): number | false {
    let result = 0;
    const {
      horizontal, min, max, invert,
    } = this.Model.getState();
    const { height, width } = this.View.getSize();
    const { x, y, total } = event.value;
    const isEmptyObj = total === undefined && x === undefined && y === undefined;

    if (isEmptyObj) { return false; }

    const correctX = this.getCoordsWithOffSet((x || 0), 'x');
    const correctY = this.getCoordsWithOffSet((y || 0), 'y');
    const correctSize = horizontal ? width : height;
    const correctCoords = horizontal ? correctX : correctY;
    const correctTotal = total;

    if (total !== undefined && typeof correctTotal === 'number') {
      result = correctTotal;
    } else
    if (!invert) {
      result = pixelToValue({
        value: correctCoords,
        size: correctSize,
        max,
        min,
      });
    } else
    if (invert) {
      result = pixelToValue({
        value: correctCoords,
        size: correctSize,
        max,
        min,
      });
      result = invertValue({
        max,
        min,
        value: result,
      });
    }

    return result;
  }
  getCoordsWithOffSet(coords: number, type: 'x' | 'y'): number {
    const { clientOffSetX, clientOffSetY } = this.View.getSize();
    return coords - (type === 'x' ? clientOffSetX : clientOffSetY);
  }
}

export { Presenter };
