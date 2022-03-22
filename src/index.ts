import $ from 'jquery';
import './index.scss';
import { Presenter } from './Components/Presenter/Presenter';
import { startUserOptions } from './Types/state';


class jqSlider {
  rootNode: HTMLElement;
  options: startUserOptions;
  Presenter: Presenter;

  constructor(element: HTMLElement, settings: startUserOptions) {
    this.rootNode = element;
    this.options = settings;
    this.Presenter = new Presenter(this.rootNode, this.options);
  }
}





$(document).ready(() => {
  $('.page__slider').each((index, element) => {
    const test = new jqSlider(element, {
      max: 1000,
      min: 0,
      from: 200,
      to: 750,
      isRange: false,
      horizontal: true,
    });
  });
});

