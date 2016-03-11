window.globals = {
  nodes: {
    body: $(document.body),
    award: $('.js-award'),
    robot: $('.js-robot'),
    win: $('.js-window'),
    platform: $('.js-platform')
  },

  methods: {
    animations: {
      awardTop: function() {
        $('.js-award').animate({
          top: '-=50'
        }, 1500).promise().done(function() {
          window.globals.methods.animations.awardBottom();
        });
      },
      awardBottom: function() {
        $('.js-award').animate({
          top: '+=50'
        }, 1500).promise().done(function() {
          window.globals.methods.animations.awardTop();
        });
      },

      robotWalk: function() {      
        for (var i = 1; i <= 9; i++) {
          (function(index) {
            setTimeout(function(){
              window.globals.nodes.robot.find('.js-robot-model').html('').append('<span class="sprite icon-robot-walk-right-'+ index +'"></span>');
            }, index * 110);
          })(i);
        }
      }
    },

    getCubesCordinates: function() {
      var items = window.globals.nodes.win.find('.js-platform-cube');
      var positions = { x: [], y: [] };
      for (var i = 0; i < items.length; i++) {      
        positions.x.push(Math.abs(parseInt(items.eq(i).css('left'))/100));
        positions.y.push(Math.abs((parseInt(items.eq(i).css('top')) + 100)/(-100)));
      }
      return positions;
    },

    getRobotCordinates: function() {
      var position = {};
      var left  = parseInt(window.globals.nodes.robot.css('left'));
      var top = parseInt(window.globals.nodes.robot.css('top'));
      position.x = (left - 20)/100;
      position.y = (top + 133)/-100;
      return position;
    },

    getCubeNode: function(x, y) {
      var leftCss = (x * 100) + 'px';
      var topCss = ((y * -100) - 100) + 'px';
      var cubes = window.globals.nodes.platform.find('.js-platform-cube');
      var i = 0;
      for (; i < cubes.length; i++) {
        if (cubes.eq(i).css('left') === leftCss && cubes.eq(i).css('top') === topCss) {
          return cubes.eq(i);
        }
      }
    },

    setZindexes: function() {
      var i = 0;
      var zindex;
      var cube;
      var robot = window.globals.nodes.robot;
      var robotPosition = window.globals.methods.getRobotCordinates();
      var positions = window.globals.methods.getCubesCordinates();
      for (; i < positions.y.length; i++) {
        zindex = (100 * positions.y[i] + positions.x[i]);
        cube = window.globals.methods.getCubeNode(positions.x[i], positions.y[i]);
        cube.css('zIndex', zindex);
      }
      robot.find('.js-robot-model').css('zIndex', 100 * robotPosition.y + robotPosition.x);
    },

    setFallingZindex: function(cube) {
      var zindex = parseInt(cube.node.css('zIndex')) + parseInt(cube.direction + '1') + (cube.fallRange * -100);     
      cube.node.css('zIndex', (zindex));
    }
  }
};