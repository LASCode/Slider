/* eslint-disable no-undef */

import { HandleFrom } from './HandleFrom';
import { viewSliderState } from '../../../../Types/state';
import { subViewEvent } from '../../../../Types/ViewEventTypes';
import { handleEvent } from '../../../../Types/SubViewEvents/HandleTypes';
import Mock = jest.Mock;



const defaultState: viewSliderState = {
  max: 100,
  min: -100,
  horizontal: true,
  isRange: true,
  invert: false,
  tips: false,
  handleSplit: true,
  from: {
    movingNow: false,
    percent: 25,
    pressedLast: false,
    pressedNow: false,
    px: 102.25,
    total: -500,
  },
  to: {
    movingNow: false,
    percent: 75,
    pressedLast: false,
    pressedNow: false,
    px: 306.75,
    total: 500,
  },
  scaleItemsArray: [-1000, -750, -500, -250, 0, 250, 500, 750, 1000],
  customClass: 'slider1',
  customId: 'UwU',
};
let componentInstance: HandleFrom;
let rootNode: HTMLElement;
const componentName: string = 'jqsHandle';

describe('Initialization', () => {
  beforeEach(() => {
    const newElement = document.createElement('div');
    rootNode = newElement;
    componentInstance = new HandleFrom(newElement);
  });
  test('Must be initialized', () => {
    expect(componentInstance).toBeDefined();
    expect(componentInstance).toBeInstanceOf(HandleFrom);
    expect(componentInstance.componentNode).toBeDefined();
  });
  test('Must not have any styles on initialization', () => {
    expect(componentInstance.componentNode.style.left).toBe('');
    expect(componentInstance.componentNode.style.right).toBe('');
    expect(componentInstance.componentNode.style.top).toBe('');
    expect(componentInstance.componentNode.style.bottom).toBe('');
    expect(componentInstance.componentNode.style.width).toBe('');
    expect(componentInstance.componentNode.style.height).toBe('');
  });
});
describe('Mount / Unmount', () => {
  beforeEach(() => {
    const newElement = document.createElement('div');
    rootNode = newElement;
    componentInstance = new HandleFrom(newElement);
  });
  test('Can be mount', () => {
    componentInstance.destroyComponent();
    componentInstance.createComponent();
    expect(componentInstance.isMounted).toBe(true);
    expect(componentInstance.sliderNode.getElementsByClassName(`${componentName}`).length).toBe(1);
  });
  test('Can be unmount', () => {
    componentInstance.destroyComponent();
    expect(componentInstance.isMounted).toBe(false);
    expect(componentInstance.sliderNode.getElementsByClassName(`${componentName}`).length).toBe(0);
  });
});
describe('Orientation align (horizontal / vertical)', () => {
  beforeEach(() => {
    const newElement = document.createElement('div');
    rootNode = newElement;
    componentInstance = new HandleFrom(newElement);
  });
  test('Must get class "--horizontal" on getting {horizontal: true}', () => {
    componentInstance.update({ ...defaultState, horizontal: true });
    const componentClassList = componentInstance.componentNode.classList;
    expect(componentClassList.contains(`${componentName}--horizontal`)).toBe(true);
  });
  test('Must not have class "--vertical" when getting {horizontal: true}', () => {
    componentInstance.update({ ...defaultState, horizontal: true });
    const componentClassList = componentInstance.componentNode.classList;
    expect(componentClassList.contains(`${componentName}--vertical`)).toBe(false);
  });
  test('Must have "left" and no "top" styles when {horizontal: true}', () => {
    componentInstance.update({ ...defaultState, horizontal: true });
    expect(componentInstance.componentNode.style.top).toBe('');
    expect(componentInstance.componentNode.style.left).not.toBe('');
  });
  test('Must not change the class "--horizontal" if it has already been assigned', () => {
    componentInstance.update({ ...defaultState, horizontal: true });
    componentInstance.update({ ...defaultState, horizontal: true });
    const componentClassList = componentInstance.componentNode.classList;
    expect(componentClassList.contains(`${componentName}--horizontal`)).toBe(true);
  });

  test('Must get class "--vertical" on getting {horizontal: false}', () => {
    componentInstance.update({ ...defaultState, horizontal: false });
    const componentClassList = componentInstance.componentNode.classList;
    expect(componentClassList.contains(`${componentName}--vertical`)).toBe(true);
  });
  test('Must not have class "--horizontal" when getting {horizontal: false}', () => {
    componentInstance.update({ ...defaultState, horizontal: false });
    const componentClassList = componentInstance.componentNode.classList;
    expect(componentClassList.contains(`${componentName}--horizontal`)).toBe(false);
  });
  test('Must have "left" and no "top" styles when {horizontal: false}', () => {
    componentInstance.update({ ...defaultState, horizontal: false });
    expect(componentInstance.componentNode.style.left).toBe('');
    expect(componentInstance.componentNode.style.top).not.toBe('');
  });
  test('Must not change the class "--vertical" if it has already been assigned', () => {
    componentInstance.update({ ...defaultState, horizontal: false });
    componentInstance.update({ ...defaultState, horizontal: false });
    const componentClassList = componentInstance.componentNode.classList;
    expect(componentClassList.contains(`${componentName}--vertical`)).toBe(true);
  });
});
describe('Invert', () => {
  let stateCopy: viewSliderState;
  beforeEach(() => {
    const newElement = document.createElement('div');
    rootNode = newElement;
    componentInstance = new HandleFrom(newElement);
    stateCopy = { ...defaultState, from: { ...defaultState.from, percent: 25 }, horizontal: false };
  });
  test('Must have correct position when {invert: false}', () => {
    componentInstance.update({ ...stateCopy, invert: false });
    expect(componentInstance.componentNode.style.top).toBe('25%');
  });
  test('Must have correct position when {invert: true}', () => {
    componentInstance.update({ ...stateCopy, invert: true });
    expect(componentInstance.componentNode.style.top).toBe('75%');
  });
});
describe('Callback and listeners', () => {
  let testCallback: (event: subViewEvent) => subViewEvent;
  let testCallbackWithMock: Mock<subViewEvent, [event: subViewEvent]>;
  let pointerEvent: {
    pointerdown: PointerEvent,
    pointermove: PointerEvent,
    pointerup: PointerEvent,
  };
  let resultEvent: {
    pointerdown: handleEvent,
    pointermove: handleEvent,
    pointerup: handleEvent,
  };
  beforeEach(() => {
    const newElement = document.createElement('div');
    rootNode = newElement;
    componentInstance = new HandleFrom(newElement);
    testCallback = (event: subViewEvent) => event;
    resultEvent = {
      pointerdown: {
        target: 'handle',
        type: 'from',
        action: 'click',
        value: {
          x: 0,
          y: 0,
          total: false,
        },
      },
      pointermove: {
        target: 'handle',
        type: 'from',
        action: 'move',
        value: {
          x: 0,
          y: 0,
          total: false,
        },
      },
      pointerup: {
        target: 'handle',
        type: 'from',
        action: 'drop',
        value: {
          x: 0,
          y: 0,
          total: false,
        },
      },
    };
    pointerEvent = {
      pointerdown: new PointerEvent('pointerdown', { bubbles: true }),
      pointermove: new PointerEvent('pointermove', { bubbles: true }),
      pointerup: new PointerEvent('pointerup', { bubbles: true }),
    };
  });
  test('Must correctly receive a callback', () => {
    componentInstance.setCallback(testCallback);
    expect(componentInstance.callback).toBeDefined();
    expect(typeof componentInstance.callback).toBe('function');
  });
  test('Must correctly send event to callback', () => {
    testCallbackWithMock = jest.fn(testCallback);
    componentInstance.setCallback(testCallbackWithMock);
    componentInstance.sendAction(resultEvent.pointerdown);
    expect(testCallbackWithMock.mock.results[0].value).toEqual(resultEvent.pointerdown);
    expect(testCallbackWithMock).toBeCalled();
    expect(testCallbackWithMock).toBeCalledTimes(1);
  });
  test('Should correctly handle a pointerdown on the tip', () => {
    componentInstance.update({ ...defaultState, tips: true });
    testCallbackWithMock = jest.fn(testCallback);
    componentInstance.setCallback(testCallbackWithMock);
    componentInstance.componentNode.dispatchEvent(pointerEvent.pointerdown);
    expect(testCallbackWithMock).toBeCalledTimes(1);
    expect(testCallbackWithMock.mock.results[0].value).toEqual(resultEvent.pointerdown);
  });
  test('Should correctly handle a pointermove on the tip', () => {
    componentInstance.update({ ...defaultState, tips: true });
    testCallbackWithMock = jest.fn(testCallback);
    componentInstance.setCallback(testCallbackWithMock);
    componentInstance.componentNode.dispatchEvent(pointerEvent.pointerdown);
    document.dispatchEvent(pointerEvent.pointermove);
    expect(testCallbackWithMock.mock.results[0].value).toEqual(resultEvent.pointerdown);
    expect(testCallbackWithMock.mock.results[1].value).toEqual(resultEvent.pointermove);
    expect(testCallbackWithMock).toBeCalledTimes(2);
  });
  test('Should correctly handle a pointerup on the tip', () => {
    componentInstance.update({ ...defaultState, tips: true });
    testCallbackWithMock = jest.fn(testCallback);
    componentInstance.setCallback(testCallbackWithMock);
    componentInstance.componentNode.dispatchEvent(pointerEvent.pointerdown);
    document.dispatchEvent(pointerEvent.pointermove);
    document.dispatchEvent(pointerEvent.pointerup);
    expect(testCallbackWithMock.mock.results[0].value).toEqual(resultEvent.pointerdown);
    expect(testCallbackWithMock.mock.results[1].value).toEqual(resultEvent.pointermove);
    expect(testCallbackWithMock.mock.results[2].value).toEqual(resultEvent.pointerup);
    expect(testCallbackWithMock).toBeCalledTimes(3);
  });
});




















// /** @jest-environment jsdom */
// /* eslint-disable no-undef */
// import { HandleFrom } from './HandleFrom';
// import { viewSliderState } from '../../../../Types/state';
// import { subViewEvent } from '../../../../Types/ViewEventTypes';
// import { rangeEvent } from '../../../../Types/SubViewEvents/RangeTypes';
// import { handleEvent } from '../../../../Types/SubViewEvents/HandleTypes';
//
//
// if (!global.PointerEvent) {
//   class PointerEvent extends MouseEvent {
//     public height?: number;
//     public isPrimary?: boolean;
//     public pointerId?: number;
//     public pointerType?: string;
//     public pressure?: number;
//     public tangentialPressure?: number;
//     public tiltX?: number;
//     public tiltY?: number;
//     public twist?: number;
//     public width?: number;
//
//     constructor(type: string, params: PointerEventInit = {}) {
//       super(type, params);
//       this.pointerId = params.pointerId;
//       this.width = params.width;
//       this.height = params.height;
//       this.pressure = params.pressure;
//       this.tangentialPressure = params.tangentialPressure;
//       this.tiltX = params.tiltX;
//       this.tiltY = params.tiltY;
//       this.pointerType = params.pointerType;
//       this.isPrimary = params.isPrimary;
//     }
//   }
//   global.PointerEvent = PointerEvent as any;
// }
//
// describe('Initialization tests:', () => {
//   let componentInstance: HandleFrom;
//   let slider: HTMLElement;
//   let subViewState: viewSliderState;
//   beforeEach(() => {
//     const newElement = document.createElement('div');
//     slider = newElement;
//     componentInstance = new HandleFrom(newElement);
//     subViewState = {
//       max: 100,
//       min: -100,
//       horizontal: true,
//       isRange: true,
//       invert: false,
//       tips: false,
//       handleSplit: true,
//       from: {
//         movingNow: false,
//         percent: 25,
//         pressedLast: false,
//         pressedNow: false,
//         px: 102.25,
//         total: -500,
//       },
//       to: {
//         movingNow: false,
//         percent: 75,
//         pressedLast: false,
//         pressedNow: false,
//         px: 306.75,
//         total: 500,
//       },
//       scaleItemsArray: [-750, -500, -250, -1000, 0, 250, 500, 750, 1000],
//       customClass: 'slider1',
//       customId: 'UwU',
//     };
//   });
//
//
//   test('Initialized', () => {
//     expect(componentInstance).toBeInstanceOf(HandleFrom);
//     expect(componentInstance).toBeDefined();
//     expect(componentInstance.componentNode).toBeDefined();
//   });
//   test('Can be mount', () => {
//     componentInstance.destroyComponent();
//     componentInstance.createComponent();
//     expect(componentInstance.isMounted).toBe(true);
//     expect(componentInstance.sliderNode.getElementsByClassName('jqsHandle').length).toBe(1);
//   });
//   test('Can be unmount', () => {
//     componentInstance.destroyComponent();
//     expect(componentInstance.isMounted).toBe(false);
//     expect(componentInstance.sliderNode.getElementsByClassName('jqsHandle').length).toBe(0);
//   });
//   test('Initially has no positioning styles', () => {
//     expect(componentInstance.componentNode.style.left).toBe('');
//     expect(componentInstance.componentNode.style.right).toBe('');
//     expect(componentInstance.componentNode.style.top).toBe('');
//     expect(componentInstance.componentNode.style.bottom).toBe('');
//     expect(componentInstance.componentNode.style.width).toBe('');
//     expect(componentInstance.componentNode.style.height).toBe('');
//   });
//   test('Can correctly change position when change orientation', () => {
//     componentInstance.update({ ...subViewState, horizontal: true, isRange: true });
//     expect(componentInstance.componentNode.style.left).toBe('25%');
//     expect(componentInstance.componentNode.style.top).toBe('');
//
//     componentInstance.update({ ...subViewState, horizontal: false, isRange: true });
//     expect(componentInstance.componentNode.style.left).toBe('');
//     expect(componentInstance.componentNode.style.top).toBe('25%');
//   });
//   test('Can correctly work when changing isRange', () => {
//     componentInstance.update({ ...subViewState, isRange: true });
//     expect(componentInstance.isMounted).toBe(true);
//     expect([...componentInstance.sliderNode.children].filter((el) => el.classList.contains('jqsHandle')).length).toBe(1);
//
//     componentInstance.update({ ...subViewState, isRange: false });
//     expect(componentInstance.isMounted).toBe(true);
//     expect([...componentInstance.sliderNode.children].filter((el) => el.classList.contains('jqsHandle')).length).toBe(1);
//   });
//   test('Can correctly invert position', () => {
//     componentInstance.update({ ...subViewState, invert: true, horizontal: true });
//     expect(componentInstance.componentNode.style.left).toBe('75%');
//     expect(componentInstance.componentNode.style.top).toBe('');
//     componentInstance.update({ ...subViewState, invert: true, horizontal: false });
//     expect(componentInstance.componentNode.style.top).toBe('75%');
//     expect(componentInstance.componentNode.style.left).toBe('');
//   });
//   test('Can correctly change orientation class ( horizontal / vertical )', () => {
//     componentInstance.update({ ...subViewState, horizontal: true });
//     expect(componentInstance.componentNode.classList).toContain('jqsHandle--horizontal');
//     expect(componentInstance.componentNode.classList).not.toContain('jqsHandle--vertical');
//
//     componentInstance.update({ ...subViewState, horizontal: false });
//     expect(componentInstance.componentNode.classList).toContain('jqsHandle--vertical');
//     expect(componentInstance.componentNode.classList).not.toContain('jqsHandle--horizontal');
//   });
//   test('Can set callback', () => {
//     const testCallback = (event: subViewEvent) => {};
//     componentInstance.setCallback(testCallback);
//     expect(componentInstance.callback).toBeDefined();
//     expect(typeof componentInstance.callback).toBe('function');
//   });
//   test('Can send event to callback', () => {
//     const testEvent: rangeEvent = {
//       target: 'range',
//       type: '',
//       action: 'click',
//       value: {
//         x: 0,
//         y: 0,
//         total: false,
//       },
//     };
//     const testCallback = (event: subViewEvent) => {};
//     const testCallbackWithMock = jest.fn(testCallback);
//     componentInstance.setCallback(testCallbackWithMock);
//     componentInstance.sendAction(testEvent);
//     expect(testCallbackWithMock).toBeCalled();
//     expect(testCallbackWithMock).toBeCalledTimes(1);
//   });
//   test('Component pointerEvent test', () => {
//     const resultClickEvent: handleEvent = {
//       target: 'handle',
//       type: 'from',
//       action: 'click',
//       value: {
//         x: 0,
//         y: 0,
//         total: false,
//       },
//     };
//     const resultMoveEvent: handleEvent = {
//       ...resultClickEvent,
//       action: 'move',
//     };
//     const resultDropEvent: handleEvent = {
//       ...resultClickEvent,
//       action: 'drop',
//     };
//     const testCallback = (event: subViewEvent) => event;
//     const testCallbackWithMock = jest.fn(testCallback);
//     componentInstance.setCallback(testCallbackWithMock);
//     componentInstance.componentNode.dispatchEvent(new PointerEvent('pointerdown'));
//     document.dispatchEvent(new PointerEvent('pointermove'));
//     document.dispatchEvent(new PointerEvent('pointerup'));
//     expect(testCallbackWithMock).toBeCalled();
//     expect(testCallbackWithMock.mock.results[0].value).toEqual(resultClickEvent);
//     expect(testCallbackWithMock.mock.results[1].value).toEqual(resultMoveEvent);
//     expect(testCallbackWithMock.mock.results[2].value).toEqual(resultDropEvent);
//   });
// });
