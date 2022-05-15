import { Model } from '../Model/Model';
import { View } from '../View/View';
import {
  SliderState,
  SliderStateModified,
  viewSliderState,
  presenterTempData,
} from '../../Types/state';
import { subViewEvent } from '../../Types/ViewEventTypes';
import { getScaleItemsArray, invertValue, pixelToValue, valueToPercent, valueToPixel } from '../../utils/utils';
import { presenterProps } from '../../Types/props';


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


  handleValidate(event: subViewEvent): SliderStateModified {
    const { to, from, isRange, handleSplit } = this.Model.getState();
    const { action, type } = event;
    const { handleSelected } = this.tempData;
    const value = this.getCorrectPositionFromEventValue(event);
    const result: SliderStateModified = {};

    if (value === false) return {};

    const isFrom = (type === 'from');
    const correctValue = value;
    const handleTypeOpposite = isFrom ? 'to' : 'from';
    const handleValue = { current: isFrom ? from : to, opposite: isFrom ? to : from };

    const toLessValue = to < value;
    const toLargerValue = to > value;
    const fromLessValue = from < value;
    const fromLargerValue = from > value;
    const handlesHasSwitched = handleSelected === type;
    const beyondHisPlace = (isFrom ? toLessValue : fromLargerValue);
    const insideHisPlace = (isFrom ? fromLessValue : toLargerValue);


    if (action === 'click') {
      this.tempData.handleValue = handleValue.opposite;
      this.tempData.handlePressedNow = type;
      this.tempData.handlePressedLast = type;
    }
    if (action === 'move') {
      if (isRange && handleSplit && beyondHisPlace) {
        this.tempData.handleSelected = type;
        this.tempData.handleMovingNow = handleTypeOpposite;
        this.tempData.handlePressedLast = handleTypeOpposite;
        result[type] = this.tempData.handleValue;
        result[handleTypeOpposite] = correctValue;
      } else
      if (isRange && handleSplit && insideHisPlace && handlesHasSwitched) {
        this.tempData.handleMovingNow = handleTypeOpposite;
        this.tempData.handlePressedLast = handleTypeOpposite;
        result[type] = this.tempData.handleValue;
        result[handleTypeOpposite] = correctValue;
      } else
      if (isRange && handleSplit) {
        this.tempData.handlePressedLast = type;
        this.tempData.handleMovingNow = type;
        this.tempData.handleSelected = null;
        result[handleTypeOpposite] = this.tempData.handleValue;
        result[type] = correctValue;
      } else
      if (isRange && !handleSplit && (isFrom ? toLargerValue : fromLessValue)) {
        result[type] = correctValue;
        result[handleTypeOpposite] = handleValue.opposite;
      } else
      if (isRange && !handleSplit && (isFrom ? toLessValue : fromLargerValue)) {
        result[type] = handleValue.opposite;
        result[handleTypeOpposite] = handleValue.current;
      } else
      if (!isRange) {
        this.tempData.handleSelected = null;
        result[type] = correctValue;
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
  };
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
    }
    this.updateModel(modelEvent);
  }
  modelEventHandler(state: SliderState): void {
    this.updateView(state);
  }
  updateView(state: SliderState): void {
    this.View.update(this.convertStateToViewState(state));
  }
  public updateModel(event: SliderStateModified): void {
    this.Model.setState(event);
  }

  convertStateToViewState(state: SliderState): viewSliderState {
    const { from, to, max, min, horizontal, scaleStep } = state;
    const { height, width } = this.View.getSize();
    return ({
      ...state,
      from: {
        percent: valueToPercent({
          max: max,
          min: min,
          value: from,
        }),
        px: valueToPixel({
          min: min,
          max: max,
          size: horizontal ? width : height,
          value: from
        }),
        total: from,
        movingNow: this.tempData.handleMovingNow === 'from',
        pressedNow: this.tempData.handlePressedNow === 'from',
        pressedLast: this.tempData.handlePressedLast === 'from',
      },
      to: {
        percent: valueToPercent({
          max: max,
          min: min,
          value: to,
        }),
        px: valueToPixel({
          min: min,
          max: max,
          size: horizontal ? width : height,
          value: to
        }),
        total: to,
        movingNow: this.tempData.handleMovingNow === 'to',
        pressedNow: this.tempData.handlePressedNow === 'to',
        pressedLast: this.tempData.handlePressedLast === 'to',
      },
      scaleItemsArray: getScaleItemsArray({
        max: max,
        min: min,
        step: scaleStep,
      }),
    });
  }
  getCorrectPositionFromEventValue(event: subViewEvent): number | false {
    let result: number = 0;
    const { horizontal, min, max, invert } = this.Model.getState();
    const { height, width } = this.View.getSize();
    const { x, y, total } = event.value;

    if (total === undefined && x === undefined && y === undefined) { return false }

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
        max: max,
        min: min,
      })
    } else
    if (invert) {
      result = pixelToValue({
        value: correctCoords,
        size: correctSize,
        max: max,
        min: min,
      })
      result = invertValue({
        max: max,
        min: min,
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

