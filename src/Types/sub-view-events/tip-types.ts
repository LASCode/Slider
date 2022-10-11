import { SubViewValue } from '../view-event-types';

export type TipTarget = 'tip';

export type TipTypes = 'from' | 'to';

export type TipActions = 'click' | 'move' | 'drop';

export interface TipEvent {
  target: TipTarget,
  type: TipTypes,
  action: TipActions,
  value: SubViewValue,
}
