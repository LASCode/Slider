import { Model } from '../Model/Model';
import { View } from '../View/View';
import { sliderState } from '../../Types/state';
import {layoutEvent, viewEvent} from '../../Types/event';


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
      state: this.Model.getState(),
      callback: this.viewEventHandler.bind(this),
    });
  }
  viewEventHandler(event: viewEvent) {
    this.Model.testData(this.pixelToValidNumber(event));
  }
  modelEventHandler(state: sliderState) {
    this.updateView(state);
  }
  pixelToValidNumber(action: viewEvent): viewEvent {
    const copyAction = { ...action };
    copyAction.value.x = (action.value.x - this.View.getOfSet()) / (this.View.getSize() / 100);
    copyAction.value.y = (action.value.y - this.View.getOfSet()) / (this.View.getSize() / 100);
    return copyAction;
  }
  updateView(state: sliderState) {
    this.View.updateComponents(state);
  }
}

export { Presenter };

