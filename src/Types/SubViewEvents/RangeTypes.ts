import { subViewValue } from '../ViewEventTypes';

type rangeTarget = 'range';

type rangeTypes = '';

type rangeActions = 'click';

interface rangeEvent {
  target: rangeTarget,
  type: rangeTypes,
  action: rangeActions,
  value: subViewValue,
}

export {
  rangeActions,
  rangeTypes,
  rangeTarget,
  rangeEvent,
};
