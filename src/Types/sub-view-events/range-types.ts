import { SubViewValue } from '../view-event-types';

export type RangeTarget = 'range';

export type RangeTypes = '';

export type RangeActions = 'click';

export interface RangeEvent {
  target: RangeTarget,
  type: RangeTypes,
  action: RangeActions,
  value: SubViewValue,
}
