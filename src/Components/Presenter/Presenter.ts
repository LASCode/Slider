import { Model } from '../Model/Model';
import { View } from '../View/View';
import {
  SliderState,
  SliderStateModified,
  viewSliderState,
  presenterTempData,
} from '../../Types/state';
import { subViewEvent, subViewValue } from '../../Types/ViewEventTypes';
import { getScaleItemsArray, invertValue, pixelToValue, valueToPercent, valueToPixel } from '../../utils/utils';


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

  constructor(element: HTMLElement, state: SliderStateModified) {
    this.rootNode = element;
    this.Model = new Model({
      state: state,
      callback: this.modelEventHandler.bind(this),
    });
    this.View = new View({
      rootNode: this.rootNode,
      callback: this.viewEventHandler.bind(this),
    });
    this.View.update(this.convertStateToViewState(this.Model.getState()));
  }

  getCoordsWithOffSet(coords: {x: number, y: number}) {
    const { clientOffSetX, clientOffSetY } = this.View.getOffSet();
    return ({
      x: coords.x - clientOffSetX,
      y: coords.y - clientOffSetY,
    });
  }
  handleValidate = (event: subViewEvent) => {
    const { to, from, isRange, handleSplit } = this.Model.getState();
    const { action, type } = event;
    const { handleSelected } = this.tempData;
    const value = this.normalizeEventValue(event.value);

    const isFrom = (type === 'from');
    const correctValue = value;
    const handleTypeOpposite = isFrom ? 'to' : 'from';
    const handleValue = { current: isFrom ? from : to, opposite: isFrom ? to : from };
    const result: SliderStateModified = {};

    if (action === 'click') {
      this.tempData.handleValue = handleValue.opposite;
      this.tempData.handlePressedNow = type;
      this.tempData.handlePressedLast = type;
    }
    if (action === 'move') {
      if (isRange) {
        if (handleSplit) {
          if ((isFrom ? correctValue > to : correctValue < from)) {
            this.tempData.handleSelected = type;
            this.tempData.handleMovingNow = handleTypeOpposite;
            this.tempData.handlePressedLast = handleTypeOpposite;
            result[type] = this.tempData.handleValue;
            result[handleTypeOpposite] = correctValue;
          } else if ((isFrom
            ? correctValue > from
            : correctValue < to)
            && handleSelected === type) {
            this.tempData.handleMovingNow = handleTypeOpposite;
            result[type] = this.tempData.handleValue;
            this.tempData.handlePressedLast = handleTypeOpposite;
            result[handleTypeOpposite] = correctValue;
          } else {
            this.tempData.handlePressedLast = type;
            this.tempData.handleMovingNow = type;
            this.tempData.handleSelected = null;
            result[handleTypeOpposite] = this.tempData.handleValue;
            result[type] = correctValue;
          }
        } else if (isFrom ? correctValue < to : correctValue > from) {
          result[type] = correctValue;
        } else if (isFrom ? correctValue > to : correctValue < from) {
          result[type] = handleValue.opposite;
        }
      } else {
        this.tempData.handleSelected = null;
        result[type] = correctValue;
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
  lineValidate(event: subViewEvent) {
    const { to, from, isRange } = this.Model.getState();
    const { action } = event;
    const value = this.normalizeEventValue(event.value);
    const result: SliderStateModified = {};
    if (action === 'click') {
      if (isRange) {
        if ((to - from) / 2 + from > value) {
          result.from = value;
        } else {
          result.to = value;
        }
      } else {
        result.from = value;
      }
    }
    return result;
  }
  viewEventHandler(event: subViewEvent) {
    const eventCopy: subViewEvent = {
      ...event,
      value: {
        ...event.value,
        ...this.getCoordsWithOffSet({
          x: event.value.x, y: event.value.y,
        }),
      },
    };
    let modelEvent: SliderStateModified = {};
    switch (event.target) {
      case 'line': modelEvent = this.lineValidate(eventCopy); break;
      case 'range': modelEvent = this.lineValidate(eventCopy); break;
      case 'scale': modelEvent = this.lineValidate(eventCopy); break;
      case 'handle': modelEvent = this.handleValidate(eventCopy); break;
      case 'tip': modelEvent = this.handleValidate(eventCopy); break;

      default: break;
    }
    this.updateModel(modelEvent);
  }
  modelEventHandler(state: SliderState) {
    this.updateView(state);
  }
  updateView(state: SliderState) {
    this.View.update(this.convertStateToViewState(state));
  }
  public updateModel(event: SliderStateModified) {
    this.Model.setState(event);
  }
  convertStateToViewState(state: SliderState): viewSliderState {
    const { from, to, max, min, horizontal, scaleStep } = state;
    const { height, width } = this.View.getSize();
    return ({
      ...state,
      from: {
        percent: valueToPercent(from, max, min),
        px: valueToPixel(from, horizontal ? width : height, max, min),
        total: from,
        movingNow: this.tempData.handleMovingNow === 'from',
        pressedNow: this.tempData.handlePressedNow === 'from',
        pressedLast: this.tempData.handlePressedLast === 'from',
      },
      to: {
        percent: valueToPercent(to, max, min),
        px: valueToPixel(to, horizontal ? width : height, max, min),
        total: to,
        movingNow: this.tempData.handleMovingNow === 'to',
        pressedNow: this.tempData.handlePressedNow === 'to',
        pressedLast: this.tempData.handlePressedLast === 'to',
      },
      scaleItemsArray: getScaleItemsArray(max, min, scaleStep),
    });
  }
  normalizeEventValue(eventValue: subViewValue): number {
    const { horizontal, min, max, invert } = this.Model.getState();
    const { height, width } = this.View.getSize();
    const { total, y, x} = eventValue;
    let result = 0;
    if (typeof total === 'number') {
      result = total;
    } else
    if (horizontal) {
      result = invert
        ? invertValue(max, min, pixelToValue(x, horizontal ? width : height, max, min))
        : pixelToValue(x, horizontal ? width : height, max, min);
    } else
    if (!horizontal) {
      result = invert
        ? invertValue(max, min, pixelToValue(y, horizontal ? width : height, max, min))
        : pixelToValue(y, horizontal ? width : height, max, min);
    }
    return result;
  }
}

export { Presenter };

