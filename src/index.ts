import $ from 'jquery';
import './index.scss';
import { Presenter } from './Components/Presenter/Presenter';
import { sliderState } from './Types/state';


class jqSlider {
  rootNode: HTMLElement;
  state: sliderState;
  Presenter: Presenter;

  constructor(element: HTMLElement, settings: sliderState) {
    this.rootNode = element;
    this.state = settings;
    this.Presenter = new Presenter(this.rootNode, this.state);
  }
}





$(document).ready(() => {
  $('.page__slider').each((index, element) => {
    const test = new jqSlider(element, {
      max: 1000,
      min: 0,
      from: 500,
    });
  });
});

