casper.start();

casper.open('./test/index.html');
casper.then(function(){
  this.test.begin('All elements exists', 5, function elements_exists(test) {
    test.assertExists('#checkbox1');
    test.assertExists('#checkbox2');
    test.assertExists('#checkbox3');
    test.assertExists('#checkbox4');
    test.assertExists('#dropdown1');
    test.done();
  });

  this.test.begin('Checkbox1 click test', 3, function checkbox1_click(test) {

    test.assert(casper.evaluate(function () {
      return $('#input1').attr('disabled') === 'disabled';
    }), "#input1 is disabled");

    casper.click('#checkbox1');
    casper.wait(100, function() {
      test.assert(casper.evaluate(function () {
        return $('#checkbox1').is(':checked');
      }), "#checkbox1 is checked after click");
      test.assert(casper.evaluate(function () {
        return $('#input1').attr('disabled') === undefined;
      }), "#input1 is enabled");
      test.done();
    });
  });
});


casper.run(function(){
});
