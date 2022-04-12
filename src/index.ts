/* eslint-disable no-shadow */
/* eslint-disable func-names */
/* eslint-disable no-new */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */

import $ from 'jquery';
import './index.scss';
import { Presenter } from './Components/Presenter/Presenter';
import { sliderState } from './Types/state';

const initState: sliderState = {
  max: 1000,
  min: 0,
  step: 10,
  size: { height: 0, width: 0, offSetX: 0, offSetY: 0 },
  from: { px: 0, percent: 0, total: 200, isHold: false, isAbstractHold: false },
  to: { px: 0, percent: 0, total: 800, isHold: false, isAbstractHold: false },
  isRange: true,
  horizontal: true,
  scaleStep: 100,
  scaleStepsArr: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
};


declare global {
  interface JQuery {
    jqSlider(...arg: any[]): JQuery;
  }
}

(function($) {
  const methods = {
    init: function (element: HTMLElement, options: sliderState) {
      if (!$(this).data().jqSlider) {
        $(this).data().jqSlider = new Presenter(element, options);
      }
    },
    update: function (updates: object) {
      const jqSliderData = $(this).data().jqSlider;
    },
    getState: function (keyArr?: Array<string>) {},
  };
  $.fn.jqSlider = function (...arg: any[]): JQuery {
    return this.each(function () {
      const hasParameters = arg.length > 1 || typeof arg[1] === 'object';
      const dataParameterIsObject = typeof arg[1] === 'object';
      const dataParameterIsArray = Array.isArray(arg[1]);

      if (arg.length === 0) {
        methods.init.call(this, this, initState);
      } else
      if (typeof arg[0] === 'object') {
        methods.init.call(this, this, arg[0]);
      } else
      if (arg[0] === 'init' && hasParameters && dataParameterIsObject) {
        methods.init.call(this, this, arg[1]);
      } else
      if (arg[0] === 'update' && hasParameters && dataParameterIsObject) {
        methods.update.call(this, arg[1]);
      } else
      if (arg[0] === 'getState' && hasParameters && dataParameterIsArray) {
        methods.getState.call(this, arg[1]);
      }
    });
  };
}(jQuery));

$(document).ready(() => {
  $('.page__slider').jqSlider({
    max: 1000,
    min: 0,
    step: 10,
    size: { height: 0, width: 0, offSetX: 0, offSetY: 0 },
    from: { px: 0, percent: 0, total: 200, isHold: false, isAbstractHold: false },
    to: { px: 0, percent: 0, total: 800, isHold: false, isAbstractHold: false },
    isRange: true,
    horizontal: true,
    scaleStep: 100,
    scaleStepsArr: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
  });
});

