/* eslint-disable no-undef */

import { View } from './View';
import { viewSliderState } from '../../Types/state';
import Mock = jest.Mock;
import { viewProps } from '../../Types/props';
import { subViewEvent, viewCallbackFunction } from '../../Types/ViewEventTypes';
import { Line } from './subView/Line/Line';
import { Range } from './subView/Range/Range';
import { HandleFrom } from './subView/Handle/HandleFrom';
import { HandleTo } from './subView/Handle/HandleTo';
import { TipTo } from './subView/Tip/TipTo';
import { TipFrom } from './subView/Tip/TipFrom';
import { Scale } from './subView/Scale/Scale';



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
let componentInstance: View;
const rootNode: HTMLElement = document.createElement('div');

describe('Initialization', () => {
  beforeEach(() => {
    const viewCallback: viewCallbackFunction = (event: subViewEvent) => event;
    componentInstance = new View({
      rootNode: rootNode,
      callback: viewCallback,
    });
  });
  test('Must be initialized', () => {
    expect(componentInstance).toBeDefined();
    expect(componentInstance).toBeInstanceOf(View);
  });
  test('Must have an array of all subviews', () => {
    expect(componentInstance.components.length).toBe(7);
    expect(componentInstance.components[0]).toBeInstanceOf(Line);
    expect(componentInstance.components[1]).toBeInstanceOf(Range);
    expect(componentInstance.components[2]).toBeInstanceOf(HandleFrom);
    expect(componentInstance.components[3]).toBeInstanceOf(HandleTo);
    expect(componentInstance.components[4]).toBeInstanceOf(TipFrom);
    expect(componentInstance.components[5]).toBeInstanceOf(TipTo);
    expect(componentInstance.components[6]).toBeInstanceOf(Scale);
  });
});
describe('Callback and listeners', () => {
  let testEvent: subViewEvent;
  let testCallback: (event: subViewEvent) => subViewEvent;
  let testCallbackWithMock: Mock<subViewEvent, [event: subViewEvent]>;
  beforeEach(() => {
    testEvent = {
      target: 'handle',
      type: 'from',
      action: 'click',
      value: {
        x: 0,
        y: 0,
        total: false,
      },
    };
    testCallback = (event: subViewEvent) => event;
    testCallbackWithMock = jest.fn(testCallback);
    componentInstance = new View({
      rootNode: rootNode,
      callback: testCallbackWithMock,
    });
  });
  test('Must correctly receive a callback', () => {
    expect(componentInstance.callback).toBeDefined();
    expect(typeof componentInstance.callback).toBe('function');
  });
  test('Must correctly send event to callback', () => {
    componentInstance.subViewEventHandler(testEvent);
    expect(testCallbackWithMock.mock.results[0].value).toEqual(testEvent);
    expect(testCallbackWithMock).toBeCalled();
    expect(testCallbackWithMock).toBeCalledTimes(1);
  });
  test('Should correctly give callback to all subviews', () => {
    componentInstance.components.forEach((el, index) => {
      expect(el.callback).toBeDefined();
      expect(typeof el.callback).toBe('function');
      el.callback(testEvent);
    });
    expect(testCallbackWithMock).toBeCalledTimes(componentInstance.components.length);
  });
  test('Should correctly listen to events from the subview', () => {
    componentInstance.components.forEach((el, index) => {
      expect(el.callback).toBeDefined();
      expect(typeof el.callback).toBe('function');
      el.callback(testEvent);
      expect(testCallbackWithMock.mock.results[index].value).toEqual(testEvent);
    });
    expect(testCallbackWithMock).toBeCalledTimes(componentInstance.components.length);
  });
});
describe('Public function', () => {
  beforeEach(() => {
    const viewCallback: viewCallbackFunction = (event: subViewEvent) => event;
    componentInstance = new View({
      rootNode: rootNode,
      callback: viewCallback,
    });
    document.body.appendChild(rootNode);
  });
  test('getSize method should return correct slider size object', () => {
    componentInstance.sliderNode.style.width = '1000';
    console.log(componentInstance.getSize());
    console.log(componentInstance.getOffSet());
    console.log(componentInstance.sliderNode.clientWidth);
    console.log(componentInstance.sliderNode.getBoundingClientRect());
  });
});

// Element.prototype.getBoundingClientRect = jest.fn(() => {
//   return new DOMRect(0, 0, 100, 100);
// });
// console.log(componentInstance.sliderNode.getBoundingClientRect())