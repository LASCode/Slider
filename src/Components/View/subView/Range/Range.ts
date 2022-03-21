import { subViewElement } from '../subViewElement';
import { DefaultSubViewElement } from '../../../../Types/defaultSubViewElement';
import { sliderState } from '../../../../Types/state';


class Range extends subViewElement implements DefaultSubViewElement {
  sliderNode: HTMLElement;
  componentNode!: HTMLElement;
  target: string = 'range';
  type: string = ''

  constructor(sliderNode: HTMLElement) {
    super();
    this.sliderNode = sliderNode;
    this.createComponent();
    this.setListeners();
  }
  createComponent() {
    const element = document.createElement('div');
    element.classList.add('jq-slider__range');
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
    if (state.isRange) {
      this.componentNode.style.left = `${state.from}%`;
      this.componentNode.style.width = `${state.to - state.from}%`;
    } else {
      this.componentNode.style.left = `${0}%`;
      this.componentNode.style.width = `${state.from}%`;
    }
  }

  onClick(e: PointerEvent) {
    this.sendAction({
      target: this.target,
      type: this.type,
      event: 'click',
      value: {
        x: e.clientX,
        y: e.clientY,
      },
    });
  }
}

export { Range };
