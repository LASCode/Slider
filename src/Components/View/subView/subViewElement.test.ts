/** @jest-environment jsdom */
/* eslint-disable no-undef */
import { SubViewElement } from './subViewElement';
import { lineEvent } from '../../../Types/SubViewEvents/LineTypes';
import { subViewEvent } from '../../../Types/ViewEventTypes';

describe('Initialization tests:', () => {
  let componentInstance: SubViewElement;
  beforeEach(() => {
    componentInstance = new SubViewElement();
  });
  test('Initialized', () => {
    expect(componentInstance).toBeInstanceOf(SubViewElement);
    expect(componentInstance).toBeDefined();
  });
});

describe('Callback tests:', () => {
  let componentInstance: SubViewElement;
  let testSubViewEvent: lineEvent;
  let testCallbackFunction: (event: subViewEvent) => void;
  let testCallbackFunctionWithMock: (event: subViewEvent) => void;
  beforeEach(() => {
    componentInstance = new SubViewElement();
    testSubViewEvent = {
      target: 'line',
      type: '',
      action: 'click',
      value: {
        x: 0,
        y: 0,
        total: false,
      },
    };
    testCallbackFunction = (event: subViewEvent): void => {};
    testCallbackFunctionWithMock = jest.fn(testCallbackFunction);
  });
  test('Can get callback function', () => {
    componentInstance.setCallback(testCallbackFunctionWithMock);
    expect(componentInstance.callback).toBeDefined();
    expect(typeof (componentInstance.callback)).toBe('function');
  });
  test('Can trigger a callback function', () => {
    componentInstance.setCallback(testCallbackFunctionWithMock);
    componentInstance.sendAction(testSubViewEvent);
    expect(testCallbackFunctionWithMock).toBeCalled();
    expect(testCallbackFunctionWithMock).toBeCalledTimes(1);
  });
});

describe('Memoization tests:', () => {
  let componentInstance: SubViewElement;
  let data: any[];
  let modifyData: any[];

  beforeEach(() => {
    componentInstance = new SubViewElement();
    data = [false, false, false];
    modifyData = [...data, true];
  });
  test('The value was not remembered before', () => {
    expect(componentInstance.MemoState('testDataName', data)).toBe(true);
  });
  test('The value has been memorized before', () => {
    componentInstance.MemoState('testDataName', data);
    expect(componentInstance.MemoState('testDataName', data)).toBe(false);
  });
  test('A value was sent that differs from the one stored', () => {
    componentInstance.MemoState('testDataName', data);
    expect(componentInstance.MemoState('testDataName', modifyData)).toBe(true);
  });
});
