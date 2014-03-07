// Change N to change the number of drawn circles.

var N = 100;

Template.main.circles = _.range(1, N);
Template.main.content2 = function () {
  return (this.valueOf() === 1) ? Session.get("counter") % 100 : 1;
};

Template.main.style = function () {
  var counter = (this.valueOf() === 1) ? Session.get("counter") : 1;
  var top = Math.sin(counter / 10) * 10;
  var left = Math.cos(counter / 10) * 10;
  var background = "rgb(0, 0, " + (counter % 255) + ")";
  return "top: " + top + "px; left: " + left + "px; background: " + background;
};
    
    // rawdog
(function(){

var BoxView = function(number){
    this.el = document.createElement('div');
    this.el.className = 'box-view';
    this.el.innerHTML = '<div class="box" id="box-' + number + '"></div>';
    this.count = 0;
    this.render()
}

BoxView.prototype.render = function(){
     var count = this.count
     var el = this.el.firstChild
     el.style.top = Math.sin(count / 10) * 10 + 'px';
     el.style.left = Math.cos(count / 10) * 10 + 'px';
     el.style.background = 'rgb(0,0,' + count % 255 + ')';
     el.textContent = String(count % 100);
}

BoxView.prototype.tick = function(){
    this.count++;
    this.render();
}

var boxes;

var init = function() {
    boxes = _.map(_.range(N), function(i) {
        var view = new BoxView(i);
        $('#grid').append(view.el);
        return view;
    });
};

var animate = function() {
    for (var i = 0, l = boxes.length; i < l; i++) {
      boxes[i].tick();
    }
};

window.runRawdog = function() {
    reset();
    init();
    benchmarkLoop(animate);
};

})();


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

