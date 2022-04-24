import { subViewElement } from '../subViewElement';
import { DefaultSubViewElement } from '../../../../Types/defaultSubViewElement';
import { viewSliderState} from '../../../../Types/state';
import { handleTarget, handleTypes } from '../../../../Types/SubViewEvents/HandleTypes';


class HandleFrom extends subViewElement implements DefaultSubViewElement {
  sliderNode: HTMLElement
  componentNode!: HTMLElement
  target: handleTarget = 'handle'
  type: handleTypes = 'from'

  constructor(sliderNode: HTMLElement) {
    super();
    this.sliderNode = sliderNode;
    this.createComponent();
  }
  createComponent() {
    const element = document.createElement('div');
    element.classList.add('jq-slider__handle');
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
  update(state: viewSliderState) {
    const { horizontal, from } = state;
    if (this.memoState([horizontal, from])) {
      const currentStartPosition = horizontal ? 'left' : 'top';
      const oppositeStartPosition = horizontal ? 'top' : 'left';

      if (from.movingNow) { this.componentNode.classList.add('jq-slider__handle--handled'); }
      if (!from.movingNow) { this.componentNode.classList.remove('jq-slider__handle--handled'); }
      this.componentNode.classList.add(`jq-slider__handle--${horizontal ? 'horizontal' : 'vertical'}`);
      this.componentNode.classList.remove(`jq-slider__handle--${horizontal ? 'vertical' : 'horizontal'}`);
      this.componentNode.style[currentStartPosition] = `${state.from.percent}%`;
      this.componentNode.style[oppositeStartPosition] = '';
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
