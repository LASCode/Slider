/* eslint-disable no-undef */

import { SliderState, SliderStateModified } from '../../Types/state';
import { Model } from './Model';
import Mock = jest.Mock;

const defaultState: SliderState = {
  max: 100,
  min: 0,
  from: 0,
  to: 0,
  step: 0.00001,
  scaleStep: 0,
  isRange: false,
  horizontal: true,
  tips: true,
  handleSplit: true,
  invert: false,
  customId: '',
  customClass: '',
  onChangeFunction: (state) => undefined,
  changeValueFunction: (value) => value,
};
let componentInstance: Model;
const modelCallback = (state: SliderState) => state;

describe('Initialization', () => {
  beforeEach(() => {

  });
  test('Should be initialized', () => {
    componentInstance = new Model({
      callback: modelCallback,
      state: defaultState,
    });
    expect(componentInstance).toBeDefined();
    expect(componentInstance).toBeInstanceOf(Model);
  });
  test('Should merge the specified state with the default one', () => {
    const initialState: SliderStateModified = { max: 1000, from: 15, invert: true };
    componentInstance = new Model({
      callback: modelCallback,
      state: initialState,
    });
    expect(componentInstance.getState().max).toBe(1000);
    expect(componentInstance.getState().from).toBe(15);
    expect(componentInstance.getState().invert).toBe(true);
    expect(componentInstance.getState().min).toBe(0);
    expect(componentInstance.getState().to).toBe(0);
  });
});
describe('State action', () => {
  beforeEach(() => {
    componentInstance = new Model({
      callback: modelCallback,
      state: defaultState,
    });
  });
  test('Should return actual state', () => {
    expect(componentInstance.getState()).toEqual(defaultState);
  });
  test('Should set values to state', () => {
    componentInstance.setState({ from: 15, horizontal: false });
    expect(componentInstance.getState()).toEqual({ ...defaultState, from: 15, horizontal: false });
  });
});
describe('State validate', () => {
  beforeEach(() => {
    componentInstance = new Model({
      callback: modelCallback,
      state: defaultState,
    });
  });
  test('MIN should not be greater than MAX', () => {
    componentInstance.setState({ max: 100, min: 110 });
    expect(componentInstance.getState().max).toBe(100);
    expect(componentInstance.getState().min).toBe(99);
  });
  test('STEP Can be greater than 0', () => {
    componentInstance.setState({ step: 11 });
    expect(componentInstance.getState().step).toBe(11);
  });
  test('STEP must not be less than 0.00001', () => {
    componentInstance.setState({ step: -10 });
    expect(componentInstance.getState().step).toBe(0.00001);
    componentInstance.setState({ step: 11 });
    expect(componentInstance.getState().step).toBe(11);
  });
  test('STEP the number of decimal places cannot be more than 5', () => {
    componentInstance.setState({ step: 0.0000000000001 });
    expect(componentInstance.getState().step).toBe(0.00001);
  });
  test('SCALE STEP must not be less than 0', () => {
    componentInstance.setState({ scaleStep: -10 });
    expect(componentInstance.getState().scaleStep).toBe(0);
  });
  test('FROM cannot be greater than TO when isRange: true', () => {
    componentInstance.setState({
      from: 20, to: 10, handleSplit: true, isRange: true,
    });
    expect(componentInstance.getState().from).toBe(20);
    expect(componentInstance.getState().to).toBe(20);

    componentInstance.setState({
      from: 20, to: 10, handleSplit: false, isRange: true,
    });
    expect(componentInstance.getState().from).toBe(20);
    expect(componentInstance.getState().to).toBe(20);
  });
  test('FROM has no effect on TO when isRange: false', () => {
    componentInstance.setState({
      from: 20, to: 10, handleSplit: true, isRange: false,
    });
    expect(componentInstance.getState().from).toBe(20);
    expect(componentInstance.getState().to).toBe(10);

    componentInstance.setState({
      from: 20, to: 10, handleSplit: false, isRange: false,
    });
    expect(componentInstance.getState().from).toBe(20);
    expect(componentInstance.getState().to).toBe(10);
  });
  test('FROM should not be greater than MAX', () => {
    componentInstance.setState({ max: 100, from: 110 });
    expect(componentInstance.getState().from).toBe(100);
    expect(componentInstance.getState().max).toBe(100);
  });
  test('TO should not be greater than MAX', () => {
    componentInstance.setState({ max: 100, to: 110 });
    expect(componentInstance.getState().to).toBe(100);
    expect(componentInstance.getState().max).toBe(100);
  });
});
describe('Callback', () => {
  let testCallbackWithMock: Mock;
  beforeEach(() => {
    testCallbackWithMock = jest.fn(modelCallback);
    componentInstance = new Model({
      state: defaultState,
      callback: testCallbackWithMock,
    });
  });
  test('Must correctly receive a callback', () => {
    expect(componentInstance.callback).toBeDefined();
    expect(typeof componentInstance.callback).toBe('function');
  });
  test('Must correctly send event to callback', () => {
    componentInstance.callback(componentInstance.getState());
    expect(testCallbackWithMock.mock.results[0].value).toEqual(defaultState);
    expect(testCallbackWithMock).toBeCalled();
    expect(testCallbackWithMock).toBeCalledTimes(1);
  });
});
describe('defaultState test', () => {
  let testCallbackWithMock: Mock;
  beforeEach(() => {
    testCallbackWithMock = jest.fn(modelCallback);
    componentInstance = new Model({
      state: defaultState,
      callback: testCallbackWithMock,
    });
  });
  test('ChangeValueFunc', () => {
    componentInstance.getDefaultState().changeValueFunction('');
  });
  test('OnChangeFunc', () => {
    componentInstance.getDefaultState().onChangeFunction(defaultState);
  });
});
