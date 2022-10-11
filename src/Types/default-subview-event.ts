import { ViewSliderState } from './state';

interface DefaultSubViewElement {
  sliderNode: HTMLElement,
  componentNode: HTMLElement,
  target: string,
  type: string,

  createComponent(): void
  destroyComponent(): void
  setListeners(): void
  removeListeners(): void
  update(state: ViewSliderState): void
}

export { DefaultSubViewElement };
