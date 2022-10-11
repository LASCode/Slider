/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */

import './index.scss';
import { Presenter } from './components/Presenter/Presenter';
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
          $(element).data().jqSlider = new Presenter({
            rootNode: element,
            initialState: options,
          });
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
