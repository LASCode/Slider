import { LineEvent } from './sub-view-events/line-types';
import { HandleEvent } from './sub-view-events/handle-types';
import { RangeEvent } from './sub-view-events/range-types';
import { ScaleEvent } from './sub-view-events/scale-types';
import { TipEvent } from './sub-view-events/tip-types';

export interface SubViewCoordsValue {
  type: 'coords',
  data: {
    x: number,
    y: number,
  },
}
export interface SubViewTotalValue {
  type: 'total',
  data: number,
}
export interface SubViewValue {
  x?: number | false,
  y?: number | false,
  total?: number | false,
}
export type SubViewEvent = LineEvent | HandleEvent | RangeEvent | ScaleEvent | TipEvent;
export type ViewCallbackFunction = (event: SubViewEvent) => void;
