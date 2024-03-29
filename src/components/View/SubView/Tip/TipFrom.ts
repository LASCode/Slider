import { SubViewElement } from '../SubViewElement';
import { DefaultSubViewElement } from '../../../../Types/default-subview-event';
import { ViewSliderState } from '../../../../Types/state';
import { TipTarget, TipTypes } from '../../../../Types/sub-view-events/tip-types';

class TipFrom extends SubViewElement implements DefaultSubViewElement {
  sliderNode: HTMLElement;

  componentNode!: HTMLElement;

  textNode!: HTMLElement;

  target: TipTarget = 'tip';

  type: TipTypes = 'from';

  constructor(sliderNode: HTMLElement) {
    super();
    this.sliderNode = sliderNode;
    this.createComponent();
  }

  createComponent() {
    const element = document.createElement('div');
    element.classList.add('jqsTips');
    const text = document.createElement('div');
    text.classList.add('jqsTips__text');
    element.appendChild(text);
    this.sliderNode.appendChild(element);
    this.textNode = text;
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
      from, horizontal, isRange, invert, tips, handleSplit, tipsValueFunction,
    } = state;
    const currentStartPosition = horizontal ? 'left' : 'top';
    const oppositeStartPosition = horizontal ? 'top' : 'left';
    const valueWithInvert = invert ? 100 - from.percent : from.percent;

    if (this.memo('tips', [tips])) {
      if (!tips && this.isMounted) { this.destroyComponent(); }
      if (tips && !this.isMounted) { this.createComponent(); }
    }

    if (this.memo('move', [from, horizontal, isRange, invert, handleSplit, tips])) {
      this.textNode.innerText = tipsValueFunction(from.total);
      this.componentNode.style[currentStartPosition] = `${valueWithInvert}%`;
      this.componentNode.style[oppositeStartPosition] = '';
    }

    if (this.memo('classModifiers', [from.pressedLast, from.movingNow, horizontal, tips, isRange])) {
      this.componentNode.classList.toggle('jqsTips--horizontal', horizontal);
      this.componentNode.classList.toggle('jqsTips--vertical', !horizontal);
      this.componentNode.classList.toggle('jqsTips--pressedLast', from.pressedLast);
      this.componentNode.classList.toggle('jqsTips--handled', from.movingNow);
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

export { TipFrom };
