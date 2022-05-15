import { subViewCoordsValue, subViewValue } from '../ViewEventTypes';

type lineTarget = 'line';

type lineTypes = '';

type lineActions = 'click';

interface lineEvent {
  target: lineTarget,
  type: lineTypes,
  action: lineActions,
  value: subViewValue,
}

export {
  lineActions,
  lineTypes,
  lineTarget,
  lineEvent,
};
