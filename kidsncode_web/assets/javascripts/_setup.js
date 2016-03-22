var setup = (function(h, n, p, a) {
  return {
    init: function() {
      n.platform.find('.js-platform-cube').remove();
      n.platform.find('.js-award').remove();
      setup.setCubes();
      setup.setRobot();
      setup.setAward();
      h.setZindexes('horizontal');
      a.awardTop();
    },

    setRobot: function() {
      n.robot.data('direction', p.robot.direction);
      n.robot.css({
        'left': 20 + (p.robot.x * 100) +'px',
        'top': ((p.robot.y * (-100)) - 133) +'px'
      });
      n.robot.find('.js-robot-model').html('<span class="sprite icon-robot-' + p.robot.direction + '"></span>')
    },

    setCubes: function() {
      var cubes = p.cubes;
      for (var i = 0; i < cubes.x.length; i++) {
        var left = (cubes.x[i] * 100) + 'px';
        var top = ((cubes.y[i] * (-100)) - 100) +'px';
        n.platform
          .prepend('<div class="window-platform__cube js-platform-cube"'
            +'style="left: '+ left +'; top: ' + top + '">'
            +'<span class="sprite icon-cube"></span></div>');
      }
    },

    setAward: function() {
      for (var i = 0; i < p.award.x.length; i++) {
        var left = 40 + (p.award.x[i] * 100) +'px';
        var top = ((p.award.y[i] * (-100)) - 100) +'px'
        n.platform
          .append('<div class="window-award js-award"' +
            'style="left: ' + left + '; top: ' + top +
            '; background-image: url(' + p.award.url[i] + ');"></div>');
      }
    }
  }  
})(helpers, nodes, properties, animations);
setup.init();