(function( $ ) {
  $.fn.disableEnable = function (alternative_selector) {
    var trigger_selector = alternative_selector || 'trigger_disable_enable';

    var enable_field = function(selector) {
      var obj_to_enable = $(selector);
      if (obj_to_enable.hasClass('multiselect')) {
        obj_to_enable.tokenInput('toggleDisabled', false);
        $(obj_to_enable.parent()).find('a.create_new_inline')
          .removeClass('create_new_disabled');

      } else if (obj_to_enable.hasClass('spinner')) {
        obj_to_enable.spinner('enable');

      } else if (obj_to_enable.hasClass('btn')) {
        obj_to_enable.removeAttr('disabled');
        if (obj_to_enable.data('href') && obj_to_enable.attr("href") == "#") {
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
      if (obj_to_disable.hasClass('multiselect')) {
        obj_to_disable.tokenInput('toggleDisabled', true);
        $(obj_to_disable.parent()).find('a.create_new_inline')
          .addClass('create_new_disabled');

      } else if (obj_to_disable.hasClass('spinner')) {
        obj_to_disable.spinner('disable');

      } else if (obj_to_disable.hasClass('btn')) {
        obj_to_disable.attr('disabled','disabled');
        if (obj_to_disable.attr('href') &&
            obj_to_disable.attr('href') != "#") {
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
      $.each(selector.data('enable'), function(i, el) {
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
      if(selector.data('enable')) {
        $.each(selector.data('enable'),function(i, el) {
          check_for_trigger(selector, false, el);
          if(selector.attr('disabled') === 'disabled') {
            disable_field(el + "");
          } else {
            enable_field(el + "");
          }
        });
      }

      if(selector.data('disable')) {
        $.each(selector.data('disable'),function(i, el) {
          check_for_trigger(selector, true, el);
          disable_field(el + "");
        });
      }
    };

    var state_check = function() {
      $.each($("." + trigger_selector), function(i, el) {
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

    if($("." + trigger_selector).is('select')) {
      $("." + trigger_selector).change(function() {
        state_check();
      });
    } else {
      $("." + trigger_selector).click(function() {
        state_check();
      });
    }
    state_check();
  };
}( jQuery ));
