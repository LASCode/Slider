import { View } from './View';
import { ViewSliderState } from '../../Types/state';
import Mock = jest.Mock;
import { SubViewEvent, ViewCallbackFunction } from '../../Types/view-event-types';
import { Line } from './SubView/Line/Line';
import { Range } from './SubView/Range/Range';
import { HandleFrom } from './SubView/Handle/HandleFrom';
import { HandleTo } from './SubView/Handle/HandleTo';
import { TipTo } from './SubView/Tip/TipTo';
import { TipFrom } from './SubView/Tip/TipFrom';
import { Scale } from './SubView/Scale/Scale';

const defaultState: ViewSliderState = {
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
  tipsValueFunction: (value) => `${value}`,
};
let componentInstance: View;
const rootNode: HTMLElement = document.createElement('div');

describe('Initialization', () => {
  beforeEach(() => {
    const viewCallback: ViewCallbackFunction = (event: SubViewEvent) => event;
    componentInstance = new View({
      rootNode,
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
  let testEvent: SubViewEvent;
  let testCallback: (event: SubViewEvent) => SubViewEvent;
  let testCallbackWithMock: Mock<SubViewEvent, [event: SubViewEvent]>;
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
    testCallback = (event: SubViewEvent) => event;
    testCallbackWithMock = jest.fn(testCallback);
    componentInstance = new View({
      rootNode,
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
  test('Should correctly listen to events from the SubView', () => {
    componentInstance.components.forEach((el, index) => {
      expect(el.callback).toBeDefined();
      expect(typeof el.callback).toBe('function');
      el.callback(testEvent);
      expect(testCallbackWithMock.mock.results[index].value).toEqual(testEvent);
    });
    expect(testCallbackWithMock).toBeCalledTimes(componentInstance.components.length);
  });
});
describe('SubView updates', () => {
  beforeEach(() => {
    const viewCallback: ViewCallbackFunction = (event: SubViewEvent) => event;
    componentInstance = new View({
      rootNode,
      callback: viewCallback,
    });
  });
  test('Should correctly update all components', () => {
    componentInstance.updateComponents({ ...defaultState, horizontal: true });
    componentInstance.components.forEach((el) => {
      let hasClass = false;
      el.componentNode.classList.forEach((cl) => {
        if (/^.*--horizontal/gm.test(cl)) hasClass = true;
      });
      expect(hasClass).toBe(true);
    });

    componentInstance.updateComponents({ ...defaultState, horizontal: false });
    componentInstance.components.forEach((el) => {
      let hasClass = false;
      el.componentNode.classList.forEach((cl) => {
        if (/^.*--vertical/gm.test(cl)) hasClass = true;
      });
      expect(hasClass).toBe(true);
    });
  });
  test('The component update function can be called', () => {
    componentInstance.updateComponents = jest.fn(componentInstance.updateComponents);
    componentInstance.update({ ...defaultState });
    expect(componentInstance.updateComponents).toBeCalled();
  });
});
describe('SliderNode custom class / id', () => {
  beforeEach(() => {
    const viewCallback: ViewCallbackFunction = (event: SubViewEvent) => event;
    componentInstance = new View({
      rootNode,
      callback: viewCallback,
    });
  });
  test('The sliderNode update function can be called', () => {
    componentInstance.updateViewNode = jest.fn(componentInstance.updateViewNode);
    componentInstance.update({ ...defaultState });
    expect(componentInstance.updateViewNode).toBeCalled();
  });

  test('Should change the class of the slider if it does not match the current one', () => {
    componentInstance.updateViewNode({ ...defaultState, customClass: 'test0' });
    componentInstance.updateViewNode({ ...defaultState, customClass: 'test1' });
    expect(componentInstance.sliderNode.classList.contains('test0')).toBe(false);
    expect(componentInstance.sliderNode.classList.contains('test1')).toBe(true);
  });
  test('Should not change the class of the slider if it matches the current one', () => {
    componentInstance.updateViewNode({ ...defaultState, customClass: 'test0' });
    componentInstance.updateViewNode({ ...defaultState, customClass: 'test0' });
    expect(componentInstance.sliderNode.classList.contains('test0')).toBe(true);
  });
  test('Should remove the custom class if an empty string is received', () => {
    componentInstance.updateViewNode({ ...defaultState, customId: 'test0' });
    componentInstance.updateViewNode({ ...defaultState, customClass: '' });
    expect(componentInstance.sliderNode.classList.length).toBe(1);
  });

  test('Should change the id of the slider if it does not match the current one', () => {
    componentInstance.updateViewNode({ ...defaultState, customId: 'test0' });
    componentInstance.updateViewNode({ ...defaultState, customId: 'test1' });
    expect(componentInstance.sliderNode.id).toBe('test1');
  });
  test('Should not change the id of the slider if it matches the current one', () => {
    componentInstance.updateViewNode({ ...defaultState, customId: 'test0' });
    componentInstance.updateViewNode({ ...defaultState, customId: 'test0' });
    expect(componentInstance.sliderNode.id).toBe('test0');
  });
  test('Must remove the id attribute if an empty string is received', () => {
    componentInstance.updateViewNode({ ...defaultState, customId: 'test0' });
    componentInstance.updateViewNode({ ...defaultState, customId: '' });
    expect(componentInstance.sliderNode.getAttribute('id')).toBeFalsy();
    expect(componentInstance.sliderNode.id).toBeFalsy();
  });
});
describe('Public function', () => {
  beforeEach(() => {
    const viewCallback: ViewCallbackFunction = (event: SubViewEvent) => event;
    componentInstance = new View({
      rootNode,
      callback: viewCallback,
    });
  });
  test('getSize method should return correct slider size object', () => {
    componentInstance.sliderNode.getBoundingClientRect = () => new DOMRect(100, 100, 300, 300);
    const result = {
      width: 300,
      height: 300,
      clientOffSetX: 100,
      clientOffSetY: 100,
    };
    expect(componentInstance.getSize()).toEqual(result);
  });
});
