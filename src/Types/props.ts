import { SliderState, SliderStateModified } from './state';
import { viewCallbackFunction } from './ViewEventTypes';

interface presenterProps {
  rootNode: HTMLElement,
  initialState: SliderStateModified,
}
interface viewProps {
 rootNode: HTMLElement,
 callback: viewCallbackFunction
}
interface modelProps {
  state: SliderStateModified,
  callback: (state: SliderState) => SliderState;
}
interface valueToPercentProps {
  max: number,
  min: number,
  value: number,
}
interface valueToPixelProps {
  size: number,
  max: number,
  min: number,
  value: number,
}
interface pixelToPercentProps {
  value: number,
  size: number,
}
interface pixelToValueProps {
  value: number,
  size: number,
  max: number,
  min: number,
}
interface percentToValueProps {
  value: number,
  max: number,
  min: number,
}
interface toFixedProps {
  value: number,
  fixed: number,
}
interface getNumAfterCommaProps {
  value: number,
}
interface getFixedValueWithStepProps {
  value: number,
  step: number,
}
interface getScaleItemsArrayProps {
  max: number,
  min: number,
  step: number,
}
interface invertValueProps {
  max: number,
  min: number,
  value: number,
}
interface checkStepProps {
  value: number,
  step: number,
}

export {
  presenterProps,
  viewProps,
  modelProps,
  valueToPixelProps,
  valueToPercentProps,
  pixelToPercentProps,
  percentToValueProps,
  pixelToValueProps,
  toFixedProps,
  getNumAfterCommaProps,
  getFixedValueWithStepProps,
  getScaleItemsArrayProps,
  invertValueProps,
  checkStepProps,
};
