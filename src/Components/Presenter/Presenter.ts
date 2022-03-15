import { Model } from '../Model/Model';
import { View } from '../View/View';
import { sliderState } from '../../Types/state';

class Presenter {
  rootNode: HTMLElement;
  View: any;
  Model: any;

  constructor(element: HTMLElement, state: sliderState) {
    this.rootNode = element;
    this.Model = new Model({
      state: state,
      callback: this.modelEventChecker,
    });
    this.View = new View({
      rootNode: this.rootNode,
      state: this.Model.getState(),
      callback: this.viewEventChecker,
    });
  }
  viewEventChecker() {

  }
  modelEventChecker() {

  }
}

export { Presenter };

