// Change N to change the number of drawn circles.

var N = 42;
var resultList = new Meteor.Collection(null)

window.reset = function() {
  r = resultList.find({}).fetch();
  r.forEach(function(r) { 
      resultList.remove({ _id: r._id });
  });
  clearTimeout(timeout);
  blazeInit();
  Session.set('stop', true);
};

Template.main.created = function() {
  Session.set('stop', true);
  Session.set('max', 1);
  resultList.insert({ max: 0, result: 'init'});
};

Template.main.resultList = function(){
    return resultList.find({}, { sort: {max: -1}});
};

Template.main.circles = function(){
    list = _.range(1, N);
    return _.map(list, function(i) {
        return { numb: i }
    })
};

Template.main.content2 = function (numb) {
  var counter = (numb < Session.get('max')) ? Session.get("counter") : 1;
  return counter;
};

Template.main.background = function (numb) {
  var counter = (numb < Session.get('max')) ? Session.get("counter") : 1;
  return "rgb(0, 0, " + (counter % 255) + ")";
};

Template.main.top = function (numb) {
  var counter = (numb < Session.get('max')) ? Session.get("counter") : 1;
  return Math.sin(counter / 10) * 10;
};

Template.main.left = function (numb) {
  var counter = (numb < Session.get('max')) ? Session.get("counter") : 1;
  return Math.cos(counter / 10) * 10;
};

var blazeInit = function() {
  Session.set("counter", 0);
  totalTime = 0;
};

var blazeAnimate = function() {
  Session.set("counter", Session.get("counter") + 1);
  Deps.flush();
};
window.runBlaze = function() {
      reset();
      console.log('runBlaze');
      Session.set('stop', false);
      blazeInit();
      _.defer(benchmarkLoop.bind(this, blazeAnimate, 1, 1));
};


window.timeout = null;
window.totalTime = null;
window.lastTime = 0;
window.benchmarkLoop = function(fn, max, loopCount) {
  if (Session.get('stop'))
      return;
  if(max > N)
      return;
  var startDate = new Date();
  fn();
  var endDate = new Date();
  totalTime += endDate - startDate;
  if (loopCount === 88) {
    thisTime = (totalTime / loopCount);
    delta = thisTime - lastTime
    message = ' Performed ' + loopCount + ' iterations in ' + totalTime + ' ms , average ' + thisTime.toFixed(2) + ' ms per loop, delta: '+delta.toFixed(4)
    result = { max: max, result: message };
    resultList.insert(result);
    Session.set('max', max);
    blazeInit();
    lastTime = thisTime;
    return _.defer(benchmarkLoop, fn, max+1, 1);
  }
  return _.defer(benchmarkLoop, fn, max, ++loopCount);
};

