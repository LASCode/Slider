import { Model } from '../Model/Model';
import { View } from '../View/View';
import { sliderState } from '../../Types/state';
import { viewEvent } from '../../Types/event';


class Presenter {
  rootNode: HTMLElement;
  View: any;
  Model: any;

  constructor(element: HTMLElement, state: sliderState) {
    this.rootNode = element;
    this.Model = new Model({
      state: state,
      callback: this.modelEventHandler.bind(this),
    });
    this.View = new View({
      rootNode: this.rootNode,
      callback: this.viewEventHandler.bind(this),
    });
    this.updateView(this.normalizeModelEvent(this.Model.getState()));
  }
  viewEventHandler(event: viewEvent) {
    this.updateModel(this.normalizeViewEvent(event));
  }
  modelEventHandler(state: sliderState) {
    this.updateView(this.normalizeModelEvent(state));
  }
  updateView(state: sliderState) {
    this.View.updateComponents(state);
  }
  updateModel(event: viewEvent) {
    this.Model.testData(event);
  }


  normalizeViewEvent(event: viewEvent): viewEvent {
    const { min, max, horizontal } = this.Model.getState();
    const { sliderOffSetX, sliderOffSetY } = this.View.getOffSet();
    const { sliderWidth, sliderHeight } = this.View.getSize();

    return ({
      ...event,
      value: {
        ...event.value,
        x: (event.value.x - sliderOffSetX) / ((horizontal ? sliderWidth : sliderHeight) / (max - min)) + min,
        y: (event.value.y - sliderOffSetY) / ((horizontal ? sliderWidth : sliderHeight) / (max - min)) + min,
      },
    });
  }
  normalizeModelEvent(state: sliderState): sliderState {
    return ({
      ...state,
      from: state.from / ((state.max - state.min) / 100),
      to: state.to / ((state.max - state.min) / 100),
    });
  }
}

export { Presenter };

