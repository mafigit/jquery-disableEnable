jquery-disableEnable
====================

 jQuery disable/enable-Plugin

 This plugin disables or enables inputfields, textareas and buttons
 according to the state of radiobuttons, checkboxes or dropdownvalues.


##How to
 Each checkbox/radiobutton should have the folowing attributes:
 - data-disable (contains all inputfields that should be disabled.
   Only relevant with radiobuttons.)
 - data-enable (contains all inputfields that should be enabled)
 - 'trigger_disable_enable' class(can be changed)

 NOTE: You can passover objects with the relevant selectors instead of data-fields

    options.enable_definitions = {
       '#checkbox5': ['#input8','#input9','#checkbox6'],
       '#checkbox6': ['#input10','#input11']
    }

##Initialisation
    $(function() {
      $(".trigger_disable_enable").disableEnable();
    });

##Simple checkbox example
    <input id="checkbox1" class="trigger_disable_enable" data-enable='["#input1"]' type="checkbox" name="option1" value="test"><br>
    <input id="input1" type="test" name="field1">

##More complex checkbox example
 Lets asume that you have one checkbox that disables another checkbox and so on so on
    <input id="checkbox2" class="trigger_disable_enable" data-enable='["#input2","#input3","#checkbox3"]' type="checkbox" name="option1" value="test"><br>
    <input id="input2" type="test" name="field2"><br>
    <input id="input3" type="test" name="field3"><br>

    <input id="checkbox3" class="trigger_disable_enable" data-enable='["#input4","#input5","#checkbox4"]' type="checkbox" name="option1" value="test"><br>
    <input id="input4" type="test" name="field4"><br>
    <input id="input5" type="test" name="field5"><br>

    <input id="checkbox4" class="trigger_disable_enable" data-enable='["#input6","#input7"]' type="checkbox" name="option1" value="test"><br>
    <input id="input6" type="test" name="field6"><br>
    <input id="input7" type="test" name="field7"><br>

##Dropdown example
 You can disable and enable fields arccording to the current value of a dropdown.

    <select id='dropdown1' class='trigger_disable_enable' data-dropdown='{"value1":{"e":["#input8","#input9"],"d":["#input10"]},"value2":{"e":["#input10"],"d":["#input8","#input9"]}}'>
      <option value="value1">A</option>
      <option value="value2">B</option>
    </select><br>

    <input id='input8'><br>
    <input id='input9'><br>
    <input id='input10'><br>

##Callback example
 You need to passover an options hash in the following manner:

    $(function() {
      var options = {};
      options.disable_callbacks = {
        '#input1' : function(selector) {
           $('#callback_test').remove();
        }
      }
      options.enable_callbacks = {
        '#input1' : function(selector) {
          if($('#callback_test').length === 0) {
            $('body').append('<div id="callback_test">TEST</div>');
          }
        }
      }
      $(".trigger_disable_enable").disableEnable(options);

##Minify it
    npm install
    npm run-script uglify

##Run tests
    npm run-script test
