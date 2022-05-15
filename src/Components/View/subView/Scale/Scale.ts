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

    if (this.MemoState('Mount/Unmount component', [scaleItemsArray])) {
      if (!scaleItemsArray.length && this.isMounted) { this.destroyComponent(); }
      if (scaleItemsArray.length && !this.isMounted) { this.createComponent(); }
    }

    if (this.MemoState('Position and value data', [scaleItemsArray, horizontal, invert])) {
      this.removeAllScaleItems();
      const scaleArrayCopy = invert ? scaleItemsArray.reverse() : scaleItemsArray;
      scaleArrayCopy.forEach((el) => {
        const percent = valueToPercent({
          max: max,
          min: min,
          value: el,
        });
        const positionWithInvert = invert
          ? 100 - percent
          : percent;
        const element = this.createScaleItem(el, positionWithInvert, horizontal ? 'left' : 'top');
        this.componentNode.appendChild(element);
        this.scaleElementsArray.push(element);
      });
    }

    if (this.MemoState('Class modifiers data', [horizontal, invert, scaleItemsArray])) {
      this.componentNode.classList.toggle('jqsScale--horizontal', horizontal);
      this.componentNode.classList.toggle('jqsScale--vertical', !horizontal);
    }
  }

  removeAllScaleItems() {
    this.scaleElementsArray.forEach((el) => el.remove());
    this.scaleElementsArray = [];
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
    const target = e.target as HTMLElement;
    if ([...target.classList].includes('jqsScale__num')) {
      this.sendAction({
        target: this.target,
        type: this.type,
        action: 'click',
        value: {
          total: Number(target.innerHTML),
        },
      });
    }
  }
}
export { Scale };
