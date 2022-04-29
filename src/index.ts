/* eslint-disable no-shadow */
/* eslint-disable func-names */
/* eslint-disable no-new */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */

import './index.scss';
import './utils/utils';
import { Presenter } from './Components/Presenter/Presenter';
import { SliderState, SliderStateModified, StateProperties } from './Types/state';


interface init {
  type: 'init',
  data: SliderStateModified,
}
interface update {
  type: 'update',
  data: SliderStateModified,
}
interface getState {
  type: 'getState',
  data: StateProperties[],
}
declare global {
  interface JQuery {
    jqSlider(action: init | update | getState): JQuery | SliderState;
  }
}

(function ($) {
  const methods = {
    init(this: JQuery<HTMLElement>, options: SliderStateModified) {
      this.each((index, element) => {
        if (!$(element).data().jqSlider) {
          $(element).data().jqSlider = new Presenter(element, options);
        }
      });
    },
    update(this: JQuery<HTMLElement>, updates: SliderStateModified) {
      this.each((index, element) => {
        if ($(element).data().jqSlider) {
          $(element).data().jqSlider.updateModel(updates);
        }
      });
    },
    getState(this: JQuery<HTMLElement>): SliderState {
      // const result: SliderStateModified[] = [];
      // this.each((index, element) => {
      //   if ($(element).data().jqSlider) {
      //     // return result.push($(element).data().jqSlider.Model.getState());
      //   }
      // });
      // return result;
      return $(this).data().jqSlider.Model.getState();
    },
  };
  $.fn.jqSlider = function ({ type, data }): JQuery | SliderState {
    if (type === 'init') { methods.init.call(this, data); }
    if (type === 'update') { methods.update.call(this, data); }
    if (type === 'getState') { return methods.getState.call(this); }
    return this;
  };
}(jQuery));


