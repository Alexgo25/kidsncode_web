(function($, window, document, undefined) {
  var nodes = {
    body: $(document.body),
    platform: $('.js-platform'),
    robot: $('.js-robot'),
    award: $('.js-award')
  };

  var properties;

  var methods = {
    init: function() {
      properties = window.levels[0];
      methods.setPlatform();
      methods.setZindex();
      methods.setSpaces();
      methods.setRobot();
      methods.setAward();
    },

    setPlatform: function() {
      var i = 0;
      var cube = '<div class="window-platform__cube js-platform-cube"><span class="sprite icon-cube"></span></div>';
      var platformQuantity = properties.platform.quantity;
      for (; i <= platformQuantity; i++) {
        nodes.platform.prepend(cube);
      }
    },

    setZindex: function() {
      var i = 0;
      var cube = nodes.platform.find('.js-platform-cube');
      for (; i < cube.length; i++) {
        cube.eq(i).css('zIndex', i + 1);
      }
    },

    setSpaces: function() {
      var cubes = nodes.platform.find('.js-platform-cube');
      var spaceIndexes = properties.platform.spaceIndexes;
      for (var i = 0; i < cubes.length; i++) { 
        for (var j = 0; j < spaceIndexes.length; j++) { 
          if (i === spaceIndexes[j]) {
            cubes.eq(i).html('');
          }
        }
      }
    },

    setRobot: function() {
      nodes.robot.css('left', 20 + (properties.robot.position * 100) );
    },

    setAward: function() {
      nodes.award.css('left', 20 + (properties.award.position * 100) );
      nodes.award.css('background-image', 'url(' + properties.award.url + ')');
    }

  };

  methods.init();
})(jQuery, window, document);