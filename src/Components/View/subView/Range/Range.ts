import { subViewElement } from '../subViewElement';
import { DefaultSubViewElement } from '../../../../Types/defaultSubViewElement';
import { viewSliderState } from '../../../../Types/state';
import { rangeTarget, rangeTypes } from '../../../../Types/SubViewEvents/RangeTypes';


class Range extends subViewElement implements DefaultSubViewElement {
  sliderNode: HTMLElement;
  componentNode!: HTMLElement;
  target: rangeTarget = 'range';
  type: rangeTypes = ''

  constructor(sliderNode: HTMLElement) {
    super();
    this.sliderNode = sliderNode;
    this.createComponent();
  }
  createComponent() {
    const element = document.createElement('div');
    element.classList.add('jq-slider__range');
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
    const { horizontal, isRange, from, to } = state;
    if (this.memoState([horizontal, isRange, from, to])) {
      const currentStartPosition = horizontal ? 'left' : 'top';
      const oppositeStartPosition = horizontal ? 'top' : 'left';
      const currentEndPosition = horizontal ? 'width' : 'height';
      const oppositeEndPosition = horizontal ? 'height' : 'width';

      if (isRange) {
        this.componentNode.style[oppositeStartPosition] = '';
        this.componentNode.style[oppositeEndPosition] = '';
        this.componentNode.style[currentStartPosition] = `${from.percent}%`;
        this.componentNode.style[currentEndPosition] = `${to.percent - from.percent}%`;
      }
      if (!isRange) {
        this.componentNode.style[oppositeStartPosition] = '';
        this.componentNode.style[oppositeEndPosition] = '';
        this.componentNode.style[currentStartPosition] = `${0}%`;
        this.componentNode.style[currentEndPosition] = `${from.percent}%`;
      }

      this.componentNode.classList.add(`jq-slider__range--${horizontal ? 'horizontal' : 'vertical'}`);
      this.componentNode.classList.remove(`jq-slider__range--${horizontal ? 'vertical' : 'horizontal'}`);
    }
  }

  onClick(e: PointerEvent) {
    this.sendAction({
      target: this.target,
      type: this.type,
      action: 'click',
      value: {
        x: e.clientX,
        y: e.clientY,
        total: false,
      },
    });
  }
}

export { Range };
