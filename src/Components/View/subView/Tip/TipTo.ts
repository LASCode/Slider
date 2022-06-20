import { SubViewElement } from '../subViewElement';
import { DefaultSubViewElement } from '../../../../Types/defaultSubViewElement';
import { viewSliderState } from '../../../../Types/state';
import { tipTarget, tipTypes } from '../../../../Types/SubViewEvents/TipTypes';

class TipTo extends SubViewElement implements DefaultSubViewElement {
  sliderNode: HTMLElement;

  componentNode!: HTMLElement;

  textNode!: HTMLElement;

  target: tipTarget = 'tip';

  type: tipTypes = 'to';

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

  update(state: viewSliderState) {
    const {
      to, horizontal, isRange, invert, tips, handleSplit, tipsValueFunction,
    } = state;
    const currentStartPosition = horizontal ? 'left' : 'top';
    const oppositeStartPosition = horizontal ? 'top' : 'left';
    const valueWithInvert = invert ? 100 - to.percent : to.percent;

    if (this.MemoState('Mount/Unmount component', [tips, isRange])) {
      if (!tips && this.isMounted) { this.destroyComponent(); }
      if (tips && !this.isMounted) { this.createComponent(); }
      if (!isRange && this.isMounted) { this.destroyComponent(); }
    }

    if (this.MemoState('Position and value data', [to, horizontal, isRange, invert, handleSplit, tips])) {
      this.textNode.innerText = tipsValueFunction(to.total);
      this.componentNode.style[currentStartPosition] = `${valueWithInvert}%`;
      this.componentNode.style[oppositeStartPosition] = '';
    }

    if (this.MemoState('Class modifiers data', [to.pressedLast, to.movingNow, horizontal, tips, isRange])) {
      this.componentNode.classList.toggle('jqsTips--horizontal', horizontal);
      this.componentNode.classList.toggle('jqsTips--vertical', !horizontal);
      this.componentNode.classList.toggle('jqsTips--pressedLast', to.pressedLast);
      this.componentNode.classList.toggle('jqsTips--handled', to.movingNow);
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

export { TipTo };
