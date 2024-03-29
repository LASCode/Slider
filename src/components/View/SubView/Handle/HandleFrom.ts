import { SubViewElement } from '../SubViewElement';
import { DefaultSubViewElement } from '../../../../Types/default-subview-event';
import { ViewSliderState } from '../../../../Types/state';
import { HandleTarget, HandleTypes } from '../../../../Types/sub-view-events/handle-types';

class HandleFrom extends SubViewElement implements DefaultSubViewElement {
  sliderNode: HTMLElement

  componentNode!: HTMLElement

  target: HandleTarget = 'handle'

  type: HandleTypes = 'from'

  constructor(sliderNode: HTMLElement) {
    super();
    this.sliderNode = sliderNode;
    this.createComponent();
  }

  createComponent() {
    const element = document.createElement('div');
    element.classList.add('jqsHandle');
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
    this.onMove = this.onMove.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.componentNode.addEventListener('pointerdown', this.onClick);
  }

  update(state: ViewSliderState) {
    const {
      horizontal, from, invert, handleSplit,
    } = state;
    const currentStartPosition = horizontal ? 'left' : 'top';
    const oppositeStartPosition = horizontal ? 'top' : 'left';
    const valueWithInvert = invert ? 100 - from.percent : from.percent;

    if (this.memo('move', [from, horizontal, invert, handleSplit])) {
      this.componentNode.style[currentStartPosition] = `${valueWithInvert}%`;
      this.componentNode.style[oppositeStartPosition] = '';
    }

    if (this.memo('classModifiers', [from.pressedLast, from.movingNow, horizontal])) {
      this.componentNode.classList.toggle('jqsHandle--pressedLast', from.pressedLast);
      this.componentNode.classList.toggle('jqsHandle--handled', from.movingNow);
      this.componentNode.classList.toggle('jqsHandle--horizontal', horizontal);
      this.componentNode.classList.toggle('jqsHandle--vertical', !horizontal);
    }
  }

  onClick(event: PointerEvent) {
    event.stopPropagation();
    this.sendAction({
      target: this.target,
      type: this.type,
      action: 'click',
      value: {
        x: event.clientX,
        y: event.clientY,
        total: false,
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
      action: 'move',
      value: {
        x: event.clientX,
        y: event.clientY,
        total: false,
      },
    });
  }

  onDrop(event: PointerEvent) {
    event.stopPropagation();
    this.sendAction({
      target: this.target,
      type: this.type,
      action: 'drop',
      value: {
        x: event.clientX,
        y: event.clientY,
        total: false,
      },
    });
    document.removeEventListener('pointermove', this.onMove);
    document.removeEventListener('pointerup', this.onDrop);
  }
}

export { HandleFrom };
