import { subViewElement } from '../subViewElement';
import { DefaultSubViewElement } from '../../../../Types/defaultSubViewElement';
import { viewSliderState } from '../../../../Types/state';

class TipTo extends subViewElement implements DefaultSubViewElement {
  sliderNode: HTMLElement;
  componentNode!: HTMLElement;
  target: string = 'tip';
  type: string = 'from';

  constructor(sliderNode: HTMLElement) {
    super();
    this.sliderNode = sliderNode;
    this.createComponent();
  }
  createComponent() {
    const element = document.createElement('div');
    element.classList.add('jq-slider__tip');
    this.sliderNode.appendChild(element);
    this.componentNode = element;
    this.isMounted = true;
    this.setListeners();
  }
  destroyComponent() {
    this.removeListeners();
    this.componentNode.remove();
    this.isMounted = false;
  }
  removeListeners() {
    this.componentNode.removeEventListener('pointerdown', this.onClick);
  }
  setListeners() {
    this.onClick = this.onClick.bind(this);
    this.componentNode.addEventListener('pointerdown', this.onClick);
  }
  update(state: viewSliderState) {
    const { to, horizontal, isRange } = state;
    if (this.memoState([to, horizontal, isRange])) {
      if (!isRange && this.isMounted) { this.destroyComponent(); return; }
      if (isRange && !this.isMounted) { this.createComponent(); }
      const currentStartPosition = horizontal ? 'left' : 'top';
      const oppositeStartPosition = horizontal ? 'top' : 'left';
      this.componentNode.classList.add(`jq-slider__tip--${horizontal ? 'horizontal' : 'vertical'}`);
      this.componentNode.classList.remove(`jq-slider__tip--${horizontal ? 'vertical' : 'horizontal'}`);
      this.componentNode.innerText = `${state.to.total}`;
      this.componentNode.style[currentStartPosition] = `${state.to.percent}%`;
      this.componentNode.style[oppositeStartPosition] = '';
      if (to.movingNow) { this.componentNode.classList.add('jq-slider__tip--handled'); }
      if (!to.movingNow) { this.componentNode.classList.remove('jq-slider__tip--handled'); }
    }
  }

  onClick(e: PointerEvent) {
  }
}

export { TipTo };