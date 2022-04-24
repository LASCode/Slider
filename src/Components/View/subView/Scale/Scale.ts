import { subViewElement } from '../subViewElement';
import { DefaultSubViewElement } from '../../../../Types/defaultSubViewElement';
import { viewSliderState } from '../../../../Types/state';
import { valueToPercent } from '../../../../utils/utils';
import { scaleTarget, scaleTypes } from '../../../../Types/SubViewEvents/ScaleTypes';


class Scale extends subViewElement implements DefaultSubViewElement {
  sliderNode: HTMLElement;
  componentNode!: HTMLElement;
  scaleElementsArray: Array<HTMLElement> = [];
  target: scaleTarget = 'scale';
  type: scaleTypes = '';

  constructor(sliderNode: HTMLElement) {
    super();
    this.sliderNode = sliderNode;
    this.createComponent();
  }
  createComponent() {
    const element = document.createElement('div');
    element.classList.add('jq-slider__scale');
    this.sliderNode.appendChild(element);
    this.componentNode = element;
    this.isMounted = true;
    this.setListeners();
  }
  destroyComponent() {
    this.componentNode.remove();
    this.removeListeners();
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
    const { scaleItemsArray, min, max, horizontal } = state;
    if (this.memoState([scaleItemsArray, horizontal])) {
      if (!scaleItemsArray.length && this.isMounted) { this.destroyComponent(); return; }
      if (scaleItemsArray.length && !this.isMounted) { this.createComponent(); }
      this.componentNode.classList.add(`jq-slider__scale--${horizontal ? 'horizontal' : 'vertical'}`);
      this.componentNode.classList.remove(`jq-slider__scale--${horizontal ? 'vertical' : 'horizontal'}`);
      this.removeAllScaleItems();
      scaleItemsArray.forEach((el) => {
        const element = this.createScaleItem(el, valueToPercent(el, max, min), horizontal ? 'left' : 'top');
        this.componentNode.appendChild(element);
        this.scaleElementsArray.push(element);
      });
    }
  }

  removeAllScaleItems() {
    this.scaleElementsArray.forEach((el) => el.remove());
  }
  createScaleItem(value: number, position: number, align: 'top' | 'left') {
    const itemRootNode = document.createElement('div');
    itemRootNode.classList.add('jq-slider__scale-item');
    itemRootNode.style[align] = `${position}%`;

    const itemTextNode = document.createElement('div');
    itemTextNode.classList.add('jq-slider__scale-num');
    itemTextNode.textContent = `${value}`;

    itemRootNode.appendChild(itemTextNode);
    return itemRootNode;
  }


  onClick(e: PointerEvent) {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if ([...target.classList].includes('jq-slider__scale-num')) {
      this.sendAction({
        target: this.target,
        type: this.type,
        action: 'click',
        value: {
          x: e.clientX,
          y: e.clientY,
          total: Number(target.innerHTML),
        },
      });
    }
  }
}
export { Scale };
