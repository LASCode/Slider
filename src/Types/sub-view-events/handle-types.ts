import { SubViewValue } from '../view-event-types';

export type HandleTarget = 'handle';

export type HandleTypes = 'from' | 'to';

export type HandleActions = 'click' | 'move' | 'drop';

export interface HandleEvent {
  target: HandleTarget,
  type: HandleTypes,
  action: HandleActions,
  value: SubViewValue,
}
