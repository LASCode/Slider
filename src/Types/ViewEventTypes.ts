import { lineEvent } from './SubViewEvents/LineTypes';
import { handleEvent } from './SubViewEvents/HandleTypes';
import { rangeEvent } from './SubViewEvents/RangeTypes';
import { scaleEvent } from './SubViewEvents/ScaleTypes';



interface subViewCoordsValue {
  type: 'coords',
  data: {
    x: number,
    y: number,
  },
}
interface subViewTotalValue {
  type: 'total',
  data: number,
}
interface subViewValue {
  x: number,
  y: number,
  total: number | boolean,
}

type subViewEvent = lineEvent | handleEvent | rangeEvent | scaleEvent
type viewCallbackFunction = (event: subViewEvent) => void;
export {
  subViewCoordsValue,
  subViewTotalValue,
  subViewValue,
  subViewEvent,
  viewCallbackFunction,
};