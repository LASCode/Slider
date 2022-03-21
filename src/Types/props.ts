import { sliderState } from './state';

interface viewProps {
 rootNode: HTMLElement,
 callback: Function
}
interface modelProps {
  state: sliderState,
  callback: Function
}

export { viewProps, modelProps };

