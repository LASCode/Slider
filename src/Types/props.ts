import { sliderState } from './state';

interface viewProps {
 rootNode: HTMLElement,
 state: sliderState,
 callback: Function
}
interface modelProps {
  state: sliderState,
  callback: Function
}

export { viewProps, modelProps };

