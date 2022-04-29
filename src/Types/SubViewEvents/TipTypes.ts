import { subViewValue } from '../ViewEventTypes';

type tipTarget = 'tip';

type tipTypes = 'from' | 'to';

type tipActions = 'click' | 'move' | 'drop';

interface tipEvent {
  target: tipTarget,
  type: tipTypes,
  action: tipActions,
  value: subViewValue,
}

export {
  tipTarget,
  tipTypes,
  tipActions,
  tipEvent,
};
