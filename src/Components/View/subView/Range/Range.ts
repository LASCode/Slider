import { SubViewElement } from '../subViewElement';
import { DefaultSubViewElement } from '../../../../Types/defaultSubViewElement';
import { viewSliderState } from '../../../../Types/state';
import { rangeTarget, rangeTypes } from '../../../../Types/SubViewEvents/RangeTypes';

class Range extends SubViewElement implements DefaultSubViewElement {
  sliderNode: HTMLElement;
  componentNode!: HTMLElement;
  target: rangeTarget = 'range';
  type: rangeTypes = '';

  constructor(sliderNode: HTMLElement) {
    super();
    this.sliderNode = sliderNode;
    this.createComponent();
  }
  createComponent() {
    const element = document.createElement('div');
    element.classList.add('jqsRange');
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
    const {
      horizontal, isRange, from, to, invert,
    } = state;
    const currentStartPosition = horizontal ? 'left' : 'top';
    const currentEndPosition = horizontal ? 'width' : 'height';

    if (this.MemoState('move', [from, to, isRange, invert])) {
      this.componentNode.style.cssText = '';
      if (isRange) {
        const horizontalWithInvert = invert ? 100 - to.percent : from.percent;
        this.componentNode.style[currentStartPosition] = `${horizontalWithInvert}%`;
        this.componentNode.style[currentEndPosition] = `${to.percent - from.percent}%`;
      } else {
        const horizontalWithInvert = invert ? 100 - from.percent : 0;
        this.componentNode.style[currentStartPosition] = `${horizontalWithInvert}%`;
        this.componentNode.style[currentEndPosition] = `${from.percent}%`;
      }
    }

    if (this.MemoState('classModifiers', [horizontal])) {
      this.componentNode.classList.toggle('jqsRange--horizontal', horizontal);
      this.componentNode.classList.toggle('jqsRange--vertical', !horizontal);
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
