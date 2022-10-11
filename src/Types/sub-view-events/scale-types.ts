import { SubViewValue } from '../view-event-types';

export type ScaleTarget = 'scale';

export type ScaleTypes = '';

export type ScaleActions = 'click';

export interface ScaleEvent {
  target: ScaleTarget,
  type: ScaleTypes,
  action: ScaleActions,
  value: SubViewValue,
}
