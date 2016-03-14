(function($, window, document, undefined) {
  var nodes = {
    body: $(document.body),
    platform: $('.js-platform'),
    robot: $('.js-robot'),
    award: $('.js-award')
  };

  var properties = window.properties;
  var helper = window.helpers.methods;

  var methods = {
    init: function() {
      methods.setCubes();
      methods.setRobot();
      methods.setAward();
      helper.setZindexes('horizontal');
      helper.animations.awardTop();
    },

    setRobot: function() {
      nodes.robot.data('direction', properties.robot.direction);
      nodes.robot.css({
        'left': 20 + (properties.robot.x * 100) +'px',
        'top': ((properties.robot.y * (-100)) - 133) +'px'
      });
      nodes.robot.find('.js-robot-model').html('<span class="sprite icon-robot-' + properties.robot.direction + '"></span>')
    },

    setCubes: function() {
      var cubes = properties.cubes;
      for (var i = 0; i < cubes.x.length; i++) {
        var left = (cubes.x[i] * 100) + 'px';
        var top = ((cubes.y[i] * (-100)) - 100) +'px';
        nodes.platform
          .prepend('<div class="window-platform__cube js-platform-cube"'
            +'style="left: '+ left +'; top: ' + top + '">'
            +'<span class="sprite icon-cube"></span></div>');
      }
    },

    setAward: function() {
      for (var i = 0; i < properties.award.x.length; i++) {
        var left = 40 + (properties.award.x[i] * 100) +'px';
        var top = ((properties.award.y[i] * (-100)) - 100) +'px'
        nodes.platform
          .append('<div class="window-award js-award"' +
            'style="left: ' + left + '; top: ' + top +
            '; background-image: url(' + properties.award.url[i] + ');"></div>');
      }
    }

  };

  methods.init();
})(jQuery, window, document);