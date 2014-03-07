// Change N to change the number of drawn circles.

var N = 100;

Template.main.circles = _.range(1, N);
Template.main.content2 = function () {
  return (this.valueOf() === 1) ? Session.get("counter") % 100 : 1;
};

Template.main.background = function () {
  var counter = (this.valueOf() === 1) ? Session.get("counter") : 1;
  return "rgb(0, 0, " + (counter % 255) + ")";
};

Template.main.top = function () {
  var counter = (this.valueOf() === 1) ? Session.get("counter") : 1;
  return Math.sin(counter / 10) * 10;
};

Template.main.left = function () {
  var counter = (this.valueOf() === 1) ? Session.get("counter") : 1;
  return Math.cos(counter / 10) * 10;
};

var blazeInit = function() {
  Session.set("counter", 0);
};

var blazeAnimate = function() {
  Session.set("counter", Session.get("counter") + 1);
  Deps.flush();
};

window.runBlaze = function() {
  reset();
  blazeInit();
  benchmarkLoop(blazeAnimate);
};


window.timeout = null;
window.totalTime = null;
window.loopCount = null;
window.reset = function() {
  $('#timing').html('&nbsp;');
  clearTimeout(timeout);
  loopCount = 0;
  totalTime = 0;
};

window.benchmarkLoop = function(fn) {
  var startDate = new Date();
  fn();
  var endDate = new Date();
  totalTime += endDate - startDate;
  loopCount++;
  if (loopCount % 20 === 0) {
    $('#timing').text('Performed ' + loopCount + ' iterations in ' + totalTime + ' ms (average ' + (totalTime / loopCount).toFixed(2) + ' ms per loop).');
  }
  timeout = _.defer(benchmarkLoop, fn);
};

