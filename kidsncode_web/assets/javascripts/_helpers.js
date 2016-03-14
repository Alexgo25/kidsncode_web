window.helpers = {
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
          window.helpers.methods.animations.awardBottom();
        });
      },
      awardBottom: function() {
        $('.js-award').animate({
          top: '+=50'
        }, 1500).promise().done(function() {
          window.helpers.methods.animations.awardTop();
        });
      },

      // robotWalk: function() {      
      //   for (var i = 1; i <= 9; i++) {
      //     (function(index) {
      //       setTimeout(function(){
      //         window.helpers.nodes.robot.find('.js-robot-model').html('').append('<span class="sprite icon-robot-walk-right-'+ index +'"></span>');
      //       }, index * 110);
      //     })(i);
      //   }
      // }
    },

    getCubesCordinates: function() {
      var items = window.helpers.nodes.win.find('.js-platform-cube');
      var cordinates = { x: [], y: [] };
      for (var i = 0; i < items.length; i++) {      
        cordinates.x.push(Math.abs(parseInt(items.eq(i).css('left'))/100));
        cordinates.y.push(Math.abs((parseInt(items.eq(i).css('top')) + 100)/(-100)));
      }
      return cordinates;
    },

    getRobotCordinates: function() {
      var cordinates = {};
      var left  = parseInt(window.helpers.nodes.robot.css('left'));
      var top = parseInt(window.helpers.nodes.robot.css('top'));
      cordinates.x = (left - 20)/100;
      cordinates.y = (top + 133)/-100;
      return cordinates;
    },

    getCubeNode: function(x, y) {
      var leftCss = (x * 100) + 'px';
      var topCss = ((y * -100) - 100) + 'px';
      var cubes = window.helpers.nodes.platform.find('.js-platform-cube');
      var i = 0;
      for (; i < cubes.length; i++) {
        if (cubes.eq(i).css('left') === leftCss && cubes.eq(i).css('top') === topCss) {
          return cubes.eq(i);
        }
      }
    },

    setZindexes: function(type) {
      var i = 0;
      var cube;
      var robotCordinates = window.helpers.methods.getRobotCordinates();
      var cubesCordinates = window.helpers.methods.getCubesCordinates();
      var robotZ = (type === 'horizontal') ? (100 * robotCordinates.y + robotCordinates.x) : (100 * robotCordinates.x + robotCordinates.y);
      var cubeZ;
      for (; i < cubesCordinates.y.length; i++) {
        cubeZ = (type === 'horizontal') ? (100 * cubesCordinates.y[i] + cubesCordinates.x[i]) : (100 * cubesCordinates.x[i] + cubesCordinates.y[i]);
        cube = window.helpers.methods.getCubeNode(cubesCordinates.x[i], cubesCordinates.y[i]);
        cube.css('zIndex', cubeZ);
      }
      window.helpers.nodes.robot.find('.js-robot-model')
        .css('zIndex', robotZ);
    },

    setFallingZindex: function(cube) {
      var zindex = parseInt(cube.node.css('zIndex')) + parseInt(cube.direction + '1') + (cube.fallRange * -100);     
      cube.node.css('zIndex', (zindex));
    }
  }
};