(function() {
  var node     = $('.js-platform');
  var cubes    = node.find('.js-platform-cube');
  var moveable = node.find('.js-platform-cube-moveable');

  var init;

  init = function() {
    var i = 0;
    for (; i < cubes.length; i++) {
      cubes.eq(i).css('zIndex', i + 1);
    }
  };

  init();
})();