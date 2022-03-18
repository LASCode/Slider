import { subViewElement } from '../subViewElement';
import { DefaultSubViewElement } from '../../../../Types/defaultSubViewElement';
import { sliderState } from '../../../../Types/state';

class Line extends subViewElement implements DefaultSubViewElement {
  sliderNode: HTMLElement;
  componentNode!: HTMLElement;
  target: string = 'line';

  constructor(sliderNode: HTMLElement) {
    super();
    this.sliderNode = sliderNode;
    this.createComponent();
    this.setListeners();
  }
  createComponent() {
    const element = document.createElement('div');
    element.classList.add('jq-slider__line');
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
  update(state: sliderState) {

  }

  onClick(e: PointerEvent) {
    this.sendAction({
      target: this.target,
      value: {
        x: e.clientX,
        y: e.clientY,
      },
    });
  }
}

export { Line };
