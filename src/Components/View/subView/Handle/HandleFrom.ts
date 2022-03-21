import { subViewElement } from '../subViewElement';
import { DefaultSubViewElement } from '../../../../Types/defaultSubViewElement';
import { sliderState } from '../../../../Types/state';


class HandleFrom extends subViewElement implements DefaultSubViewElement {
  sliderNode: HTMLElement
  componentNode!: HTMLElement
  target: string = 'handle'
  type: string = 'from'

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
    if (state.horizontal) {
      this.componentNode.classList.add('jq-slider__handle--horizontal');
      this.componentNode.style.left = `${state.from}%`;
      this.componentNode.style.top = '';
    }
    if (!state.horizontal) {
      this.componentNode.classList.add('jq-slider__handle--vertical');
      this.componentNode.style.left = '';
      this.componentNode.style.top = `${state.from}%`;
    }
  }

  onClick(event: PointerEvent) {
    event.stopPropagation();
    this.sendAction({
      target: this.target,
      type: this.type,
      event: 'click',
      value: {
        x: event.clientX,
        y: event.clientY,
      },
    });
    document.addEventListener('pointermove', this.onMove);
    document.addEventListener('pointerup', this.onDrop);
  }
  onMove(event: PointerEvent) {
    event.stopPropagation();
    this.sendAction({
      target: this.target,
      type: this.type,
      event: 'move',
      value: {
        x: event.clientX,
        y: event.clientY,
      },
    });
  }
  onDrop(event: PointerEvent) {
    event.stopPropagation();
    this.sendAction({
      target: this.target,
      type: this.type,
      event: 'drop',
      value: {
        x: event.clientX,
        y: event.clientY,
      },
    });
    document.removeEventListener('pointermove', this.onMove);
    document.removeEventListener('pointerup', this.onDrop);
  }
}


export { HandleFrom };
