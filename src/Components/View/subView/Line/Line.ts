import { SubViewElement } from '../subViewElement';
import { DefaultSubViewElement } from '../../../../Types/defaultSubViewElement';
import { viewSliderState } from '../../../../Types/state';
import { lineTarget, lineTypes } from '../../../../Types/SubViewEvents/LineTypes';

class Line extends SubViewElement implements DefaultSubViewElement {
  sliderNode: HTMLElement;

  componentNode!: HTMLElement;

  target: lineTarget = 'line';

  type: lineTypes = '';

  constructor(sliderNode: HTMLElement) {
    super();
    this.sliderNode = sliderNode;
    this.createComponent();
  }

  createComponent() {
    const element = document.createElement('div');
    element.classList.add('jqsLine');
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
    const { horizontal } = state;

    if (this.MemoState('classModifiers', [horizontal])) {
      this.componentNode.classList.toggle('jqsLine--horizontal', horizontal);
      this.componentNode.classList.toggle('jqsLine--vertical', !horizontal);
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

export { Line };
