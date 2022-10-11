import { SliderState, SliderStateModified } from '../../Types/state';
import { Presenter } from './Presenter';
import { View } from '../View/View';
import { Model } from '../Model/Model';
import { LineEvent } from '../../Types/sub-view-events/line-types';
import { RangeEvent } from '../../Types/sub-view-events/range-types';
import { ScaleEvent } from '../../Types/sub-view-events/scale-types';
import { HandleEvent } from '../../Types/sub-view-events/handle-types';
import { TipEvent } from '../../Types/sub-view-events/tip-types';
import { SubViewEvent } from '../../Types/view-event-types';
import Mock = jest.Mock;

const defaultState: SliderState = {
  max: 100,
  min: 0,
  from: 25,
  to: 75,
  step: 0.00001,
  scaleStep: 0,
  isRange: true,
  horizontal: true,
  tips: true,
  handleSplit: true,
  invert: false,
  customId: '',
  customClass: '',
  onChangeFunction: (state) => undefined,
  tipsValueFunction: (value) => `${value}`,
};
let componentInstance: Presenter;
const rootNode: HTMLElement = document.createElement('div');

describe('Initialization', () => {
  beforeEach(() => {
    componentInstance = new Presenter({
      rootNode,
      initialState: defaultState,
    });
  });
  test('Must be initialized', () => {
    expect(componentInstance).toBeDefined();
    expect(componentInstance).toBeInstanceOf(Presenter);
  });
  test('Creates View and Model on initialization', () => {
    expect(componentInstance.View).toBeDefined();
    expect(componentInstance.Model).toBeDefined();
    expect(componentInstance.View).toBeInstanceOf(View);
    expect(componentInstance.Model).toBeInstanceOf(Model);
  });
});
describe('subViewEvent validators', () => {
  let testEvent: SubViewEvent;
  beforeEach(() => {
    componentInstance = new Presenter({
      rootNode,
      initialState: defaultState,
    });
    componentInstance.View.sliderNode.getBoundingClientRect = () => new DOMRect(100, 100, 100, 100);
    testEvent = {
      target: 'handle',
      type: 'from',
      action: 'click',
      value: {
        x: 115,
      },
    };
  });
  test('lineEvent validator', () => {
    const testLineEvent: LineEvent = {
      target: 'line',
      type: '',
      action: 'click',
      value: {
        x: 0,
        y: 0,
        total: 80,
      },
    };
    expect(componentInstance.lineValidate({ ...testLineEvent, value: { total: 80 } }))
      .toEqual({ to: 80 });
  });
  test('Creates View and Model on initialization', () => {
    expect(componentInstance.View).toBeDefined();
    expect(componentInstance.Model).toBeDefined();
    expect(componentInstance.View).toBeInstanceOf(View);
    expect(componentInstance.Model).toBeInstanceOf(Model);
  });
  test('Should translate X coordinate into total', () => {
    componentInstance.Model.setState({ horizontal: true });
    expect(componentInstance.getCorrectPositionFromEventValue({ ...testEvent, value: { x: 115 } }))
      .toBe(15);
  });
  test('Should translate Y coordinate into total', () => {
    componentInstance.Model.setState({ horizontal: false });
    expect(componentInstance.getCorrectPositionFromEventValue({ ...testEvent, value: { y: 115 } }))
      .toBe(15);
  });
  test('Should give priority to total', () => {
    expect(componentInstance.getCorrectPositionFromEventValue({
      ...testEvent,
      value: { x: 115, y: 115, total: 200 },
    }))
      .toBe(200);
  });
  test('Should return the inverted value', () => {
    componentInstance.Model.setState({ horizontal: true, invert: true });
    expect(componentInstance.getCorrectPositionFromEventValue({
      ...testEvent,
      value: { x: 115, y: 115 },
    }))
      .toBe(85);

    componentInstance.Model.setState({ horizontal: false, invert: true });
    expect(componentInstance.getCorrectPositionFromEventValue({
      ...testEvent,
      value: { x: 115, y: 115 },
    }))
      .toBe(85);
  });
  test('Should return false if nothing is passed', () => {
    expect(componentInstance.getCorrectPositionFromEventValue({
      ...testEvent,
      value: {},
    }))
      .toBe(false);
  });
});
describe('lineEvent validate', () => {
  let testLineEvent: LineEvent;
  let validateFunctionWithMock: Mock;
  let result: SliderStateModified;
  beforeEach(() => {
    componentInstance = new Presenter({
      rootNode,
      initialState: defaultState,
    });
    componentInstance.View.sliderNode.getBoundingClientRect = () => new DOMRect(100, 100, 100, 100);
    validateFunctionWithMock = jest.fn(componentInstance.lineValidate);
    componentInstance.lineValidate = validateFunctionWithMock;

    testLineEvent = {
      target: 'line',
      type: '',
      action: 'click',
      value: {
        x: 0,
        y: 0,
        total: 80,
      },
    };
  });
  test('Should return an empty object if nothing is passed', () => {
    componentInstance.Model.setState({ from: 20, to: 40 });
    componentInstance.viewEventHandler({ ...testLineEvent, value: {} });
    result = validateFunctionWithMock.mock.results[0].value;
    expect(result).toEqual({});
  });
  test('Should move TO when clicked closer to it between handles', () => {
    componentInstance.Model.setState({ from: 20, to: 40 });
    componentInstance.viewEventHandler({ ...testLineEvent, value: { total: 35 } });
    result = validateFunctionWithMock.mock.results[0].value;
    expect(result).toEqual({ to: 35 });
  });
  test('Should move TO when clicked closer to it outside handles', () => {
    componentInstance.Model.setState({ from: 20, to: 40 });
    componentInstance.viewEventHandler({ ...testLineEvent, value: { total: 45 } });
    result = validateFunctionWithMock.mock.results[0].value;
    expect(result).toEqual({ to: 45 });
  });
  test('Should move FROM when clicked closer to it between handles', () => {
    componentInstance.Model.setState({ from: 20, to: 40 });
    componentInstance.viewEventHandler({ ...testLineEvent, value: { total: 25 } });
    result = validateFunctionWithMock.mock.results[0].value;
    expect(result).toEqual({ from: 25 });
  });
  test('Should move FROM when clicked closer to it outside handles', () => {
    componentInstance.Model.setState({ from: 20, to: 40 });
    componentInstance.viewEventHandler({ ...testLineEvent, value: { total: 15 } });
    result = validateFunctionWithMock.mock.results[0].value;
    expect(result).toEqual({ from: 15 });
  });
  test('Should move FROM when clicking between handles (FROM priority)', () => {
    componentInstance.Model.setState({ from: 0, to: 100 });
    componentInstance.viewEventHandler({ ...testLineEvent, value: { total: 50 } });
    result = validateFunctionWithMock.mock.results[0].value;
    expect(result).toEqual({ from: 50 });
  });
  test('Should change the value of FROM without affecting TO when { isRange: false }', () => {
    componentInstance.Model.setState({ from: 0, to: 50, isRange: false });
    componentInstance.viewEventHandler({ ...testLineEvent, value: { total: 100 } });
    result = validateFunctionWithMock.mock.results[0].value;
    expect(result).toEqual({ from: 100 });
  });
});
describe('rangeEvent validate', () => {
  let testRangeEvent: RangeEvent;
  let validateFunctionWithMock: Mock;
  let result: SliderStateModified;
  beforeEach(() => {
    componentInstance = new Presenter({
      rootNode,
      initialState: defaultState,
    });
    componentInstance.View.sliderNode.getBoundingClientRect = () => new DOMRect(100, 100, 100, 100);
    validateFunctionWithMock = jest.fn(componentInstance.lineValidate);
    componentInstance.lineValidate = validateFunctionWithMock;
    testRangeEvent = {
      target: 'range',
      type: '',
      action: 'click',
      value: {
        x: 0,
        y: 0,
        total: 80,
      },
    };
  });
  test('Should return an empty object if nothing is passed', () => {
    componentInstance.Model.setState({ from: 20, to: 40 });
    componentInstance.viewEventHandler({ ...testRangeEvent, value: {} });
    result = validateFunctionWithMock.mock.results[0].value;
    expect(result).toEqual({});
  });
  test('Should move TO when clicked closer to it between handles', () => {
    componentInstance.Model.setState({ from: 20, to: 40 });
    componentInstance.viewEventHandler({ ...testRangeEvent, value: { total: 35 } });
    result = validateFunctionWithMock.mock.results[0].value;
    expect(result).toEqual({ to: 35 });
  });
  test('Should move TO when clicked closer to it outside handles', () => {
    componentInstance.Model.setState({ from: 20, to: 40 });
    componentInstance.viewEventHandler({ ...testRangeEvent, value: { total: 45 } });
    result = validateFunctionWithMock.mock.results[0].value;
    expect(result).toEqual({ to: 45 });
  });
  test('Should move FROM when clicked closer to it between handles', () => {
    componentInstance.Model.setState({ from: 20, to: 40 });
    componentInstance.viewEventHandler({ ...testRangeEvent, value: { total: 25 } });
    result = validateFunctionWithMock.mock.results[0].value;
    expect(result).toEqual({ from: 25 });
  });
  test('Should move FROM when clicked closer to it outside handles', () => {
    componentInstance.Model.setState({ from: 20, to: 40 });
    componentInstance.viewEventHandler({ ...testRangeEvent, value: { total: 15 } });
    result = validateFunctionWithMock.mock.results[0].value;
    expect(result).toEqual({ from: 15 });
  });
  test('Should move FROM when clicking between handles (FROM priority)', () => {
    componentInstance.Model.setState({ from: 0, to: 100 });
    componentInstance.viewEventHandler({ ...testRangeEvent, value: { total: 50 } });
    result = validateFunctionWithMock.mock.results[0].value;
    expect(result).toEqual({ from: 50 });
  });
  test('Should change the value of FROM without affecting TO when { isRange: false }', () => {
    componentInstance.Model.setState({ from: 0, to: 50, isRange: false });
    componentInstance.viewEventHandler({ ...testRangeEvent, value: { total: 100 } });
    result = validateFunctionWithMock.mock.results[0].value;
    expect(result).toEqual({ from: 100 });
  });
});
describe('scaleEvent validate', () => {
  let testScaleEvent: ScaleEvent;
  let validateFunctionWithMock: Mock;
  let result: SliderStateModified;
  beforeEach(() => {
    componentInstance = new Presenter({
      rootNode,
      initialState: defaultState,
    });
    componentInstance.View.sliderNode.getBoundingClientRect = () => new DOMRect(100, 100, 100, 100);
    validateFunctionWithMock = jest.fn(componentInstance.lineValidate);
    componentInstance.lineValidate = validateFunctionWithMock;
    testScaleEvent = {
      target: 'scale',
      type: '',
      action: 'click',
      value: {
        x: 0,
        y: 0,
        total: 80,
      },
    };
  });
  test('Should return an empty object if nothing is passed', () => {
    componentInstance.Model.setState({ from: 20, to: 40 });
    componentInstance.viewEventHandler({ ...testScaleEvent, value: {} });
    result = validateFunctionWithMock.mock.results[0].value;
    expect(result).toEqual({});
  });
  test('Should move TO when clicked closer to it between handles', () => {
    componentInstance.Model.setState({ from: 20, to: 40 });
    componentInstance.viewEventHandler({ ...testScaleEvent, value: { total: 35 } });
    result = validateFunctionWithMock.mock.results[0].value;
    expect(result).toEqual({ to: 35 });
  });
  test('Should move TO when clicked closer to it outside handles', () => {
    componentInstance.Model.setState({ from: 20, to: 40 });
    componentInstance.viewEventHandler({ ...testScaleEvent, value: { total: 45 } });
    result = validateFunctionWithMock.mock.results[0].value;
    expect(result).toEqual({ to: 45 });
  });
  test('Should move FROM when clicked closer to it between handles', () => {
    componentInstance.Model.setState({ from: 20, to: 40 });
    componentInstance.viewEventHandler({ ...testScaleEvent, value: { total: 25 } });
    result = validateFunctionWithMock.mock.results[0].value;
    expect(result).toEqual({ from: 25 });
  });
  test('Should move FROM when clicked closer to it outside handles', () => {
    componentInstance.Model.setState({ from: 20, to: 40 });
    componentInstance.viewEventHandler({ ...testScaleEvent, value: { total: 15 } });
    result = validateFunctionWithMock.mock.results[0].value;
    expect(result).toEqual({ from: 15 });
  });
  test('Should move FROM when clicking between handles (FROM priority)', () => {
    componentInstance.Model.setState({ from: 0, to: 100 });
    componentInstance.viewEventHandler({ ...testScaleEvent, value: { total: 50 } });
    result = validateFunctionWithMock.mock.results[0].value;
    expect(result).toEqual({ from: 50 });
  });
  test('Should change the value of FROM without affecting TO when { isRange: false }', () => {
    componentInstance.Model.setState({ from: 0, to: 50, isRange: false });
    componentInstance.viewEventHandler({ ...testScaleEvent, value: { total: 100 } });
    result = validateFunctionWithMock.mock.results[0].value;
    expect(result).toEqual({ from: 100 });
  });
});
describe('handleEvent validate', () => {
  let baseHandleEvent: HandleEvent;
  let testHandleClickEvent: HandleEvent;
  let testHandleMoveEvent: HandleEvent;
  let testHandleDropEvent: HandleEvent;
  let validateFunctionWithMock: Mock;
  beforeEach(() => {
    componentInstance = new Presenter({
      rootNode,
      initialState: defaultState,
    });
    componentInstance.View.sliderNode.getBoundingClientRect = () => new DOMRect(100, 100, 100, 100);
    validateFunctionWithMock = jest.fn(componentInstance.handleValidate);
    componentInstance.handleValidate = validateFunctionWithMock;
    baseHandleEvent = {
      target: 'handle',
      type: 'from',
      action: 'click',
      value: {
        x: 0,
        y: 0,
        total: false,
      },
    };
    testHandleClickEvent = {
      ...baseHandleEvent,
      action: 'click',
      value: {
        x: 125,
        total: false,
      },
    };
    testHandleMoveEvent = {
      ...baseHandleEvent,
      action: 'move',
      value: {
        x: 150,
        total: false,
      },
    };
    testHandleDropEvent = {
      ...baseHandleEvent,
      action: 'drop',
      value: {
        x: 150,
        total: false,
      },
    };
  });
  describe('Handle type from', () => {
    beforeEach(() => {
      testHandleClickEvent = {
        ...testHandleClickEvent,
        type: 'from',
      };
      testHandleMoveEvent = {
        ...testHandleMoveEvent,
        type: 'from',
      };
      testHandleDropEvent = {
        ...testHandleDropEvent,
        type: 'from',
      };
    });
    test('Should return an empty object if nothing is passed', () => {
      componentInstance.Model.setState({ from: 20, to: 40 });
      expect(componentInstance.handleValidate({ ...testHandleClickEvent, value: {} }))
        .toEqual({});
    });

    test('Should move FROM when approaching TO {invert: false}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: false });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 170 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 70, to: 75 });
    });
    test('Should move FROM when approaching TO {invert: true}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: true });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 170 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 30, to: 75 });
    });
    test('Should move FROM when moving away from TO {invert: false}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: false });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 120 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 20, to: 75 });
    });
    test('Should move FROM when moving away from TO {invert: true}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: true });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 190 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 10, to: 75 });
    });

    test('Should move TO when approaching FROM + switched {invert: false}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: false });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 190 } });
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 180 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[2].value;
      expect(result).toEqual({ from: 75, to: 80 });
    });
    test('Should move TO when approaching FROM + switched {invert: true}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: true });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 130 } });
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 120 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[2].value;
      expect(result).toEqual({ from: 75, to: 80 });
    });
    test('Should move TO when moving away from FROM + switched {invert: false}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: false });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 190 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 75, to: 90 });
    });
    test('Should move TO when moving away from FROM + switched {invert: true}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: true });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 120 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 75, to: 80 });
    });

    test('Must not go beyond TO when {handleSplit: false}', () => {
      componentInstance.Model.setState({ from: 75, to: 75, handleSplit: false });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 190 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 75, to: 75 });
    });
    test('Must move when {handleSplit: false}', () => {
      componentInstance.Model.setState({ from: 75, to: 75, handleSplit: false });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 150 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 50, to: 75 });
    });

    test('Should move without affecting TO {isRange: false}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, isRange: false });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 180 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 80, to: 75 });
    });
  });
  describe('Handle type to', () => {
    beforeEach(() => {
      testHandleClickEvent = {
        ...testHandleClickEvent,
        type: 'to',
      };
      testHandleMoveEvent = {
        ...testHandleMoveEvent,
        type: 'to',
      };
      testHandleDropEvent = {
        ...testHandleDropEvent,
        type: 'to',
      };
    });
    test('Should return an empty object if nothing is passed', () => {
      componentInstance.Model.setState({ from: 20, to: 40 });
      expect(componentInstance.handleValidate({ ...testHandleClickEvent, value: {} }))
        .toEqual({});
    });

    test('Should move TO when approaching FROM {invert: false}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: false });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 140 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 25, to: 40 });
    });
    test('Should move TO when approaching FROM {invert: true}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: true });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 160 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 25, to: 40 });
    });
    test('Should move TO when moving away from FROM {invert: false}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: false });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 180 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 25, to: 80 });
    });
    test('Should move TO when moving away from FROM {invert: true}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: true });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 120 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 25, to: 80 });
    });

    test('Should move FROM when approaching TO + switched {invert: false}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: false });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 110 } });
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 115 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[2].value;
      expect(result).toEqual({ from: 15, to: 25 });
    });
    test('Should move FROM when approaching TO + switched {invert: true}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: true });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 190 } });
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 185 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[2].value;
      expect(result).toEqual({ from: 15, to: 25 });
    });
    test('Should move FROM when moving away from TO + switched {invert: false}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: false });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 110 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 10, to: 25 });
    });
    test('Should move FROM when moving away from TO + switched {invert: true}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: true });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 190 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 10, to: 25 });
    });

    test('Must not go beyond FROM when {handleSplit: false}', () => {
      componentInstance.Model.setState({ from: 75, to: 75, handleSplit: false });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 150 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 75, to: 75 });
    });
    test('Must move when {handleSplit: false}', () => {
      componentInstance.Model.setState({ from: 75, to: 75, handleSplit: false });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 190 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 75, to: 90 });
    });

    test('Should move without affecting FROM {isRange: false}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, isRange: false });
      componentInstance.viewEventHandler(testHandleClickEvent);
      componentInstance.viewEventHandler({ ...testHandleMoveEvent, value: { x: 110 } });
      componentInstance.viewEventHandler(testHandleDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 25, to: 10 });
    });
  });
});
describe('tipsEvent validate', () => {
  let baseTipEvent: TipEvent;
  let testTipClickEvent: TipEvent;
  let testTipMoveEvent: TipEvent;
  let testTipDropEvent: TipEvent;
  let validateFunctionWithMock: Mock;
  beforeEach(() => {
    componentInstance = new Presenter({
      rootNode,
      initialState: defaultState,
    });
    componentInstance.View.sliderNode.getBoundingClientRect = () => new DOMRect(100, 100, 100, 100);
    validateFunctionWithMock = jest.fn(componentInstance.handleValidate);
    componentInstance.handleValidate = validateFunctionWithMock;
    baseTipEvent = {
      target: 'tip',
      type: 'from',
      action: 'click',
      value: {
        x: 0,
        y: 0,
        total: false,
      },
    };
    testTipClickEvent = {
      ...baseTipEvent,
      action: 'click',
      value: {
        x: 125,
        total: false,
      },
    };
    testTipMoveEvent = {
      ...baseTipEvent,
      action: 'move',
      value: {
        x: 150,
        total: false,
      },
    };
    testTipDropEvent = {
      ...baseTipEvent,
      action: 'drop',
      value: {
        x: 150,
        total: false,
      },
    };
  });
  describe('Handle type from', () => {
    beforeEach(() => {
      testTipClickEvent = {
        ...testTipClickEvent,
        type: 'from',
      };
      testTipMoveEvent = {
        ...testTipMoveEvent,
        type: 'from',
      };
      testTipDropEvent = {
        ...testTipDropEvent,
        type: 'from',
      };
    });
    test('Should return an empty object if nothing is passed', () => {
      componentInstance.Model.setState({ from: 20, to: 40 });
      expect(componentInstance.handleValidate({ ...testTipClickEvent, value: {} }))
        .toEqual({});
    });

    test('Should move FROM when approaching TO {invert: false}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: false });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 170 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 70, to: 75 });
    });
    test('Should move FROM when approaching TO {invert: true}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: true });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 170 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 30, to: 75 });
    });
    test('Should move FROM when moving away from TO {invert: false}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: false });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 120 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 20, to: 75 });
    });
    test('Should move FROM when moving away from TO {invert: true}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: true });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 190 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 10, to: 75 });
    });

    test('Should move TO when approaching FROM + switched {invert: false}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: false });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 190 } });
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 180 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[2].value;
      expect(result).toEqual({ from: 75, to: 80 });
    });
    test('Should move TO when approaching FROM + switched {invert: true}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: true });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 130 } });
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 120 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[2].value;
      expect(result).toEqual({ from: 75, to: 80 });
    });
    test('Should move TO when moving away from FROM + switched {invert: false}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: false });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 190 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 75, to: 90 });
    });
    test('Should move TO when moving away from FROM + switched {invert: true}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: true });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 120 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 75, to: 80 });
    });

    test('Must not go beyond TO when {handleSplit: false}', () => {
      componentInstance.Model.setState({ from: 75, to: 75, handleSplit: false });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 190 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 75, to: 75 });
    });
    test('Must move when {handleSplit: false}', () => {
      componentInstance.Model.setState({ from: 75, to: 75, handleSplit: false });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 150 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 50, to: 75 });
    });

    test('Should move without affecting TO {isRange: false}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, isRange: false });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 180 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 80, to: 75 });
    });
  });
  describe('Handle type to', () => {
    beforeEach(() => {
      testTipClickEvent = {
        ...testTipClickEvent,
        type: 'to',
      };
      testTipMoveEvent = {
        ...testTipMoveEvent,
        type: 'to',
      };
      testTipDropEvent = {
        ...testTipDropEvent,
        type: 'to',
      };
    });
    test('Should return an empty object if nothing is passed', () => {
      componentInstance.Model.setState({ from: 20, to: 40 });
      expect(componentInstance.handleValidate({ ...testTipClickEvent, value: {} }))
        .toEqual({});
    });

    test('Should move TO when approaching FROM {invert: false}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: false });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 140 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 25, to: 40 });
    });
    test('Should move TO when approaching FROM {invert: true}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: true });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 160 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 25, to: 40 });
    });
    test('Should move TO when moving away from FROM {invert: false}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: false });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 180 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 25, to: 80 });
    });
    test('Should move TO when moving away from FROM {invert: true}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: true });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 120 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 25, to: 80 });
    });

    test('Should move FROM when approaching TO + switched {invert: false}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: false });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 110 } });
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 115 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[2].value;
      expect(result).toEqual({ from: 15, to: 25 });
    });
    test('Should move FROM when approaching TO + switched {invert: true}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: true });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 190 } });
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 185 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[2].value;
      expect(result).toEqual({ from: 15, to: 25 });
    });
    test('Should move FROM when moving away from TO + switched {invert: false}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: false });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 110 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 10, to: 25 });
    });
    test('Should move FROM when moving away from TO + switched {invert: true}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, invert: true });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 190 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 10, to: 25 });
    });

    test('Must not go beyond FROM when {handleSplit: false}', () => {
      componentInstance.Model.setState({ from: 75, to: 75, handleSplit: false });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 150 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 75, to: 75 });
    });
    test('Must move when {handleSplit: false}', () => {
      componentInstance.Model.setState({ from: 75, to: 75, handleSplit: false });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 190 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 75, to: 90 });
    });

    test('Should move without affecting FROM {isRange: false}', () => {
      componentInstance.Model.setState({ from: 25, to: 75, isRange: false });
      componentInstance.viewEventHandler(testTipClickEvent);
      componentInstance.viewEventHandler({ ...testTipMoveEvent, value: { x: 110 } });
      componentInstance.viewEventHandler(testTipDropEvent);
      const result = validateFunctionWithMock.mock.results[1].value;
      expect(result).toEqual({ from: 25, to: 10 });
    });
  });
});
