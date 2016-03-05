(function($, window, document, undefined) {
  var nodes = {
    body: $(document.body),
    robot: $('.js-robot'),
    program: $('.js-program'),
    controls: $('.js-controls'),
    loop: $('.js-loop'),
    platform: $('.js-platform')
  };

  var variables = {
    actionIndex: 0
  };

  var methods = {
    setEvents: function() {
      nodes.controls.on({
        click: function() {
          methods.setAction();
        }
      }, '.js-controls-start');
    },

    setAction: function() {
      var actions = nodes.program.find('.js-program-actions').children();
      var i = variables.actionIndex;
      if (actions.eq(i).hasClass('js-program-action')) {
        switch (actions.eq(i).data('action')) {
          case 'walk':
            methods.robotWalk();
          case 'reverse':
            methods.robotReverse();
          case 'push':
            methods.robotPush();
          case 'jump':
            methods.robotJump();
        }
      }
      variables.actionIndex++;
    },

    robotWalk: function() {
      var direction = nodes.robot.data('direction') === 'right' ? '+' : '-';
      if (methods.checkWalk(direction + 1)) {
        window.animations.methods.robotWalk();
        nodes.robot.animate({ left: direction + '=100px' }, 1000, function() { methods.setAction() });
      }
    },

    robotReverse: function() {
      return;
    },

    robotPush: function() {
      var direction = nodes.robot.data('direction') === 'right' ? '+' : '-';
      var moveable = methods.checkPush(direction + 1);
      if (moveable.exist) {
        var moveableCube = methods.getCubeNode(moveable.left, moveable.top);                
        moveableCube.animate({ left: direction + '=100px' }, 1000, function() { methods.setAction() });
      }
    },

    robotJump: function() {
      return;
    },

    getRobotPosition: function() {
      var position = {};
      var left  = parseInt(nodes.robot.css('left'));
      var top = parseInt(nodes.robot.css('top'));
      position.left = (left - 20)/100;
      position.top = (top + 133)/100;
      return position;
    },

    getCubesPosition: function() {
      var cubes = nodes.platform.find('.js-platform-cube-moveable');
      var positions = [];
      var left;
      var top;
      for (var i = 0; i < cubes.length; i++) {
        left  = parseInt(cubes.eq(i).css('left'))/100;
        top = (parseInt(cubes.eq(i).css('top')) + 100)/100;
        positions[i] = {'left': left, 'top': top};
      }
      return positions;
    },

    getCubeNode: function(left, top) {
      var leftCss = (left * 100) + 'px';
      var topCss = ((top * 100) - 100) + 'px';
      var cubes = nodes.platform.find('.js-platform-cube-moveable');
      var i = 0;
      for (; i < cubes.length; i++) {
        if (cubes.eq(i).css('left') === leftCss && cubes.eq(i).css('top') === topCss) {
          return cubes.eq(i);
        }
      }
    },

    checkWalk: function(direction) {
      var robotPosition = methods.getRobotPosition();
      var cubesPosition = methods.getCubesPosition();
      var errors = 0;
      for (var i = 0; i < cubesPosition.length; i++) {
        if ( ((robotPosition.left + parseInt(direction)) === cubesPosition[i].left) && (robotPosition.top === cubesPosition[i].top) ) {  
          errors++;
        }
      }
      return (errors > 0) ? false : true;
    },

    checkPush: function(direction) {
      var robotPosition = methods.getRobotPosition();
      var cubesPosition = methods.getCubesPosition();
      var moveable = { exist: false , left: undefined, top: undefined, pushable: false, fallable: false };
      for (var i = 0; i < cubesPosition.length; i++) {
        if ( ((robotPosition.left + parseInt(direction)) === cubesPosition[i].left) && (robotPosition.top === cubesPosition[i].top) ) {  
          moveable = {
            exist: true,
            left: cubesPosition[i].left,
            top: cubesPosition[i].top
          };
        }
      }       
      return moveable;
    }

  };

  methods.setEvents();
})(jQuery, window, document);