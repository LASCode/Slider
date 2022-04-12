import { Model } from '../Model/Model';
import { View } from '../View/View';
import { sliderState } from '../../Types/state';
import { viewEvent, viewEventType } from '../../Types/event';


class Presenter {
  rootNode: HTMLElement;
  View: View;
  Model: Model;

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
    this.View.sendSliderSize();
    this.updateView(this.Model.getState());
  }

  viewEventHandler(event: viewEventType) {
    // console.log(event.data)
    this.updateModel(event);
    // this.updateModel(this.normalizeViewEvent(event));
  }
  modelEventHandler(state: sliderState) {
    this.updateView(state);
  }
  updateView(state: sliderState) {
    this.View.updateComponents(state);
  }
  updateModel(event: viewEventType) {
    this.Model.testData(event);
  }


  normalizeViewEvent(event: viewEvent): viewEvent {
    const { min, max, horizontal } = this.Model.getState();
    const { sliderOffSetX, sliderOffSetY } = this.View.getOffSet();
    const { width, height } = this.View.getSize();

    return ({
      ...event,
      value: {
        ...event.value,
        x: (event.value.x - sliderOffSetX) / ((horizontal ? width : height) / (max - min)) + min,
        y: (event.value.y - sliderOffSetY) / ((horizontal ? width : height) / (max - min)) + min,
      },
    });
  }
  // normalizeModelEvent(state: sliderState): sliderState {
  //   return ({
  //     ...state,
  //     from: state.from / ((state.max - state.min) / 100),
  //     to: state.to / ((state.max - state.min) / 100),
  //   });
  // }
}

export { Presenter };

