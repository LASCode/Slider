import { sliderState } from './state';


interface DefaultSubViewElement {
  sliderNode: HTMLElement,
  componentNode: HTMLElement,
  target: string,

  createComponent(): void
  destroyComponent(): void
  setListeners(): void
  removeListeners(): void
  update(state: sliderState): void
}

export { DefaultSubViewElement };
