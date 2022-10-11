import { SliderState, SliderStateModified } from './state';
import { ViewCallbackFunction } from './view-event-types';

export interface PresenterProps {
  rootNode: HTMLElement,
  initialState: SliderStateModified,
}
export interface ViewProps {
 rootNode: HTMLElement,
 callback: ViewCallbackFunction
}
export interface ModelProps {
  state: SliderStateModified,
  callback: (state: SliderState) => SliderState;
}
export interface ValueToPercentProps {
  max: number,
  min: number,
  value: number,
}
export interface ValueToPixelProps {
  size: number,
  max: number,
  min: number,
  value: number,
}
export interface PixelToPercentProps {
  value: number,
  size: number,
}
export interface PixelToValueProps {
  value: number,
  size: number,
  max: number,
  min: number,
}
export interface PercentToValueProps {
  value: number,
  max: number,
  min: number,
}
export interface ToFixedProps {
  value: number,
  fixed: number,
}
export interface GetNumAfterCommaProps {
  value: number,
}
export interface GetFixedValueWithStepProps {
  value: number,
  step: number,
}
export interface GetScaleItemsArrayProps {
  max: number,
  min: number,
  step: number,
}
export interface InvertValueProps {
  max: number,
  min: number,
  value: number,
}
export interface CheckStepProps {
  value: number,
  step: number,
}
