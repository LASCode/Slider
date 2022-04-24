import { SliderState } from './state';
import { viewCallbackFunction } from './ViewEventTypes';

interface viewProps {
 rootNode: HTMLElement,
 callback: viewCallbackFunction
}
interface modelProps {
  state: SliderState,
  callback: viewCallbackFunction
}

export { viewProps, modelProps };

