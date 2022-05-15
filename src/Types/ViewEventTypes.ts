import { lineEvent } from './SubViewEvents/LineTypes';
import { handleEvent } from './SubViewEvents/HandleTypes';
import { rangeEvent } from './SubViewEvents/RangeTypes';
import { scaleEvent } from './SubViewEvents/ScaleTypes';
import { tipEvent } from './SubViewEvents/TipTypes';



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
  x?: number | false,
  y?: number | false,
  total?: number | false,
}

type subViewEvent = lineEvent | handleEvent | rangeEvent | scaleEvent | tipEvent;
type viewCallbackFunction = (event: subViewEvent) => void;
export {
  subViewCoordsValue,
  subViewTotalValue,
  subViewValue,
  subViewEvent,
  viewCallbackFunction,
};
