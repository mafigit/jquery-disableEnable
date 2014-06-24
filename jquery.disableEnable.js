/*The MIT License (MIT)
Copyright © 2013 Maximilian Fischer

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.

Repoistory and documentation:
https://github.com/mafigit/jquery-disableEnable
*/

(function( $ ) {
  $.fn.disableEnable = function (options) {

    var that = this;

    options = options || {};

    var disable_callbacks = options.disable_callbacks || {};
    var enable_callbacks = options.enable_callbacks || {};

    var disable_definitions = options.disable_definitions || {};
    var enable_definitions = options.enable_definitions || {};

    var object_defined_selectors = (function() {
      var selectors = [];
      $.each(disable_definitions, function(key, value) {
        selectors.push(key);
      });
      $.each(enable_definitions, function(key, value) {
        selectors.push(key);
      });
      return selectors;
    })();

    var trigger_selector = options.selector || 'trigger_disable_enable';

    var use_disable_callbacks = function(selector) {
      $.each(disable_callbacks, function(name, callback) {
        if(selector === name) {
          callback(selector);
          return true;
        } else {
          return false;
        }
      });
    };

    var use_enable_callbacks = function(selector) {
      $.each(enable_callbacks, function(name, callback) {
        if(selector === name) {
          callback(selector);
          return true;
        } else {
          return false;
        }
      });
    };

    var enable_field = function(selector) {
      var obj_to_enable = $(selector);
      if(!$.isEmptyObject(enable_callbacks)) {
        if(use_enable_callbacks(selector)) {
          return;
        }
      }
      if (obj_to_enable.hasClass('multiselect')) {
        obj_to_enable.tokenInput('toggleDisabled', false);
        $(obj_to_enable.parent()).find('a.create_new_inline')
          .removeClass('create_new_disabled');

      } else if (obj_to_enable.hasClass('spinner')) {
        obj_to_enable.spinner('enable');

      } else if (obj_to_enable.hasClass('btn')) {
        obj_to_enable.removeAttr('disabled');
        if (obj_to_enable.data('href') && obj_to_enable.attr("href") === "#") {
          obj_to_enable.attr('href', obj_to_enable.data('href'));
          obj_to_enable.data('href', "");
        }

      } else if (obj_to_enable.hasClass('hour_min_spinner')) {
        $(selector + '_hour').spinner('enable');
        $(selector + '_min').spinner('enable');

      } else {
        obj_to_enable.prop('disabled',false);
      }
    };

    var disable_field = function(selector) {
      var obj_to_disable = $(selector);
      if(!$.isEmptyObject(disable_callbacks)) {
        if(use_disable_callbacks(selector)) {
          return;
        }
      }
      if (obj_to_disable.hasClass('multiselect')) {
        obj_to_disable.tokenInput('toggleDisabled', true);
        $(obj_to_disable.parent()).find('a.create_new_inline')
          .addClass('create_new_disabled');

      } else if (obj_to_disable.hasClass('spinner')) {
        obj_to_disable.spinner('disable');

      } else if (obj_to_disable.hasClass('btn')) {
        obj_to_disable.attr('disabled','disabled');
        if (obj_to_disable.attr('href') &&
            obj_to_disable.attr('href') !== "#") {
          obj_to_disable.data('href', obj_to_disable.attr('href'));
          obj_to_disable.attr('href', "#");
        }

      } else if (obj_to_disable.hasClass('hour_min_spinner')) {
        $(selector + "_hour").spinner('disable');
        $(selector + "_min").spinner('disable');

      } else {
        $(obj_to_disable).prop('disabled',true);
      }
    };

    var process_checkbox_data = function(selector, disableflag) {

      var selectors = [];
      var selector_id = "#" + selector.attr('id');
      if($.inArray(selector_id, object_defined_selectors) !== -1) {
        $.each(enable_definitions, function(key,value) {
          if(key === "#" + selector.attr('id')) {
            selectors = value;
          }
        });
      } else {
        selectors = selector.data('enable');
      }
      $.each(selectors, function(i, el) {
        if(disableflag) {
          disable_field(el + "");
        } else {
          enable_field(el + "");
        }
      });
    };

    var checkbox_enable_disable_fields = function(selector) {
      var invert = selector.data('trigger_invert') || false;
      if(selector.attr('disabled') === 'disabled') {
        process_checkbox_data(selector, true);
      } else {
        if(selector.is(':checked')) {
          process_checkbox_data(selector, invert);
        } else {
          process_checkbox_data(selector, !invert);
        }
      }
    };

    var check_for_trigger = function(selector, disableflag, el) {
      if($(el + "").hasClass(trigger_selector)) {
        if($(el + "").is(':checked')) {
          checkbox_enable_disable_fields($(el + ""));
        }
        else if($(el + "").is(':checked')) {
          radio_button_enable_disable_fields($(el + ""));
        }
        $(el + "").attr('data-disableflag',disableflag);
      }
    };

    var radio_button_enable_disable_fields = function(selector) {
      var selectors_enable = [];
      var selectors_disable = [];
      var selector_id = "#" + selector.attr('id');
      if($.inArray(selector_id, object_defined_selectors) !== -1) {
        $.each(enable_definitions, function(key,value) {
          if(key === "#" + selector.attr('id')) {
            selectors_enable = value;
          }
        });
      } else {
        selectors_enable = selector.data('enable');
      }

      if($.inArray(selector_id, object_defined_selectors) !== -1) {
        $.each(disable_definitions, function(key,value) {
          if(key === "#" + selector.attr('id')) {
            selectors_disable = value;
          }
        });
      } else {
        selectors_disable = selector.data('disable');
      }

      if(selectors_enable) {
        $.each(selectors_enable,function(i, el) {
          check_for_trigger(selector, false, el);
          if(selector.attr('disabled') === 'disabled') {
            disable_field(el + "");
          } else {
            enable_field(el + "");
          }
        });
      }

      if(selectors_disable) {
        $.each(selectors_disable,function(i, el) {
          check_for_trigger(selector, true, el);
          disable_field(el + "");
        });
      }
    };

    var state_check = function() {
      $.each(that, function(i, el) {
        if($(el).attr('type') === 'checkbox') {
          checkbox_enable_disable_fields($(el));
        } else if($(el).is(':checked')) {
          radio_button_enable_disable_fields($(el));
        } else if($(el).is('select')) {
          var dropdown = $(el);
          var dropdown_data = $.parseJSON(dropdown.attr('data-dropdown'));
          $.each(dropdown_data, function(k,v) {
            if(k === dropdown.val()) {
              $.each(v.e,function(i,el) {
                enable_field(el);
              });
              $.each(v.d,function(i,el) {
                disable_field(el);
              });
            }
          });
        }

        if($(el).data('disableflag') && $(el).hasClass(trigger_selector)) {
          if($(el).attr('type') === 'checkbox') {
            $.each($(el).data('enable'), function(i, element){
              disable_field(element + "");
            });
          } else {
            $.each($(el).data('disable') || [], function(i, element){
              disable_field(element + "");
            });
            $.each($(el).data('enable') || [], function(i, element){
              disable_field(element + "");
            });
          }
        }
      });
    };

    that.each(function(idx, elem) {
      elem = $(elem);
      if(elem.is('select')) {
        elem.change(function() {
          state_check();
        });
      } else {
        elem.click(function() {
          state_check();
        });
      }
    });
    state_check();
  };
}( jQuery ));
