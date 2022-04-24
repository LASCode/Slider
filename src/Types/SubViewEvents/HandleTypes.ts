import { subViewValue } from '../ViewEventTypes';

type handleTarget = 'handle';

type handleTypes = 'from' | 'to';

type handleActions = 'click' | 'move' | 'drop';

interface handleEvent {
  target: handleTarget,
  type: handleTypes,
  action: handleActions,
  value: subViewValue,
}

export {
  handleTarget,
  handleTypes,
  handleActions,
  handleEvent,
};