import { subViewElement } from '../subViewElement';
import { DefaultSubViewElement } from '../../../../Types/defaultSubViewElement';
import { sliderState } from '../../../../Types/state';


class Handle extends subViewElement implements DefaultSubViewElement {
  sliderNode: HTMLElement
  componentNode!: HTMLElement
  target: string = 'handle--from'

  constructor(sliderNode: HTMLElement) {
    super();
    this.sliderNode = sliderNode;
    this.createComponent();
    this.setListeners();
  }
  createComponent() {
    const element = document.createElement('div');
    element.classList.add('jq-slider__handle');
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
    this.onMove = this.onMove.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.componentNode.addEventListener('pointerdown', this.onClick);
  }
  update(state: sliderState) {
    if (state.type === 'horizontal') {
      this.componentNode.style.left = `${state.from}%`;
      this.componentNode.style.top = '';
    }
    if (state.type === 'vertical') {
      this.componentNode.style.left = '';
      this.componentNode.style.top = `${state.from}%`;
    }
  }

  onClick(event: PointerEvent) {
    event.stopPropagation();
    document.addEventListener('pointermove', this.onMove);
    document.addEventListener('pointerup', this.onDrop);
  }
  onMove(event: PointerEvent) {
    event.stopPropagation();
    // console.log(event.clientX)
    this.sendAction({
      target: this.target,
      value: {
        x: event.clientX,
        y: event.clientY,
      },
    });
  }
  onDrop(event: PointerEvent) {
    event.stopPropagation();
    document.removeEventListener('pointermove', this.onMove);
    document.removeEventListener('pointerup', this.onDrop);
  }
}

export { Handle };
