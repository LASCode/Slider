import { subViewElement } from '../subViewElement';
import { DefaultSubViewElement } from '../../../../Types/defaultSubViewElement';
import { viewSliderState } from '../../../../Types/state';

class TipFrom extends subViewElement implements DefaultSubViewElement {
  sliderNode: HTMLElement;
  componentNode!: HTMLElement;
  target: string = 'tip';
  type: string = 'from';

  constructor(sliderNode: HTMLElement) {
    super();
    this.sliderNode = sliderNode;
    this.createComponent();
    this.setListeners();
  }
  createComponent() {
    const element = document.createElement('div');
    element.classList.add('jq-slider__tip');
    this.sliderNode.appendChild(element);
    this.componentNode = element;
  }
  destroyComponent() {
    this.removeListeners();
    this.componentNode.remove();
  }
  removeListeners() {
    this.componentNode.removeEventListener('pointerdown', this.onClick);
  }
  setListeners() {
    this.onClick = this.onClick.bind(this);
    this.componentNode.addEventListener('pointerdown', this.onClick);
  }
  update(state: viewSliderState) {
    const { from, horizontal } = state;
    if (this.memoState([from, horizontal])) {
      const currentStartPosition = horizontal ? 'left' : 'top';
      const oppositeStartPosition = horizontal ? 'top' : 'left';
      this.componentNode.classList.add(`jq-slider__tip--${horizontal ? 'horizontal' : 'vertical'}`);
      this.componentNode.classList.remove(`jq-slider__tip--${horizontal ? 'vertical' : 'horizontal'}`);
      this.componentNode.innerText = `${state.from.total}`;
      this.componentNode.style[currentStartPosition] = `${state.from.percent}%`;
      this.componentNode.style[oppositeStartPosition] = '';
      if (from.movingNow) { this.componentNode.classList.add('jq-slider__tip--handled'); }
      if (!from.movingNow) { this.componentNode.classList.remove('jq-slider__tip--handled'); }
    }
  }

  onClick(e: PointerEvent) {
  }
}

export { TipFrom };
