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
    element.classList.add('jqsScale');
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
    const { scaleItemsArray, min, max, horizontal, invert } = state;

    if (this.MemoState('removeComponent', [scaleItemsArray])) {
      if (!scaleItemsArray.length && this.isMounted) { this.destroyComponent(); }
      if (scaleItemsArray.length && !this.isMounted) { this.createComponent(); }
    }

    if (this.MemoState('updateScaleItems', [scaleItemsArray, horizontal, invert])) {
      this.removeAllScaleItems();
      scaleItemsArray.forEach((el) => {
        const positionWithInvert = invert
          ? 100 - valueToPercent(el, max, min)
          : valueToPercent(el, max, min);
        const element = this.createScaleItem(el, positionWithInvert, horizontal ? 'left' : 'top');
        this.componentNode.appendChild(element);
        this.scaleElementsArray.push(element);
      });
    }

    if (this.MemoState('setClassModifiers', [horizontal, invert])) {
      this.componentNode.classList.toggle('jqsScale--horizontal', horizontal);
      this.componentNode.classList.toggle('jqsScale--vertical', !horizontal);
    }
  }

  removeAllScaleItems() {
    this.scaleElementsArray.forEach((el) => el.remove());
  }
  createScaleItem(value: number, position: number, align: 'top' | 'left') {
    const itemRootNode = document.createElement('div');
    itemRootNode.classList.add('jqsScale__item');
    itemRootNode.style[align] = `${position}%`;

    const itemTextNode = document.createElement('div');
    itemTextNode.classList.add('jqsScale__num');
    itemTextNode.textContent = `${value}`;

    itemRootNode.appendChild(itemTextNode);
    return itemRootNode;
  }


  onClick(e: PointerEvent) {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if ([...target.classList].includes('jqsScale__num')) {
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
