import { SubViewValue } from '../view-event-types';

export type LineTarget = 'line';

export type LineTypes = '';

export type LineActions = 'click';

export interface LineEvent {
  target: LineTarget,
  type: LineTypes,
  action: LineActions,
  value: SubViewValue,
}
