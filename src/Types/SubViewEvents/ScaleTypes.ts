import { subViewValue } from '../ViewEventTypes';

type scaleTarget = 'scale';

type scaleTypes = '';

type scaleActions = 'click';

interface scaleEvent {
  target: scaleTarget,
  type: scaleTypes,
  action: scaleActions,
  value: subViewValue,
}

export {
  scaleActions,
  scaleTypes,
  scaleTarget,
  scaleEvent,
};