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

  var helper = window.globals.methods;
  var animation = window.globals.methods.animations;
  var properties = window.properties;

  var methods = {
    setEvents: function() {
      nodes.controls.on({
        click: function() {
          methods.setAction();
          nodes.robot.removeClass('is-select');
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
            break
          case 'reverse':
            methods.robotReverse();
            break
          case 'push':
            methods.robotPush();
            break
          case 'jump':
            methods.robotJump();
            break
        }
      }
      variables.actionIndex++;
    },

    robotWalk: function() {
      var direction = nodes.robot.data('direction') === 'right' ? '+' : '-';
      if (methods.checkWalk(direction + 1)) {
        animation.robotWalk();
        nodes.robot.animate({ left: direction + '=100px' }, 1000, function() {
          helper.setZindexes();
          methods.setAction();
        });
      } else {
        throw new Error('Walk mistake');
      }
    },

    robotReverse: function() {
      return;
    },

    robotPush: function() {
      var direction = nodes.robot.data('direction') === 'right' ? '+' : '-';
      var moveable = methods.checkPush(direction + 1);
      var moveableCube;
      if (moveable.exist && moveable.pushable) {
        moveable.direction = direction;
        console.log(moveable);
        moveableCube = helper.getCubeNode(moveable.x, moveable.y);
        if (moveable.fallable) {
          moveableCube.animate({ left: direction + '=100px' }, 1000, function() {
            helper.setFallingZindex(moveable);
            moveableCube.animate({ top: '+='+ (moveable.fallRange * 100) + 'px'}, 250, function() { methods.setAction() });
          });
        } else {          
          moveableCube.animate({ left: direction + '=100px' }, 1000, function() { 
            helper.setZindexes();
            methods.setAction(); 
          });
        }                
      } else {
        throw new Error('Push mistake');
      }
    },

    robotJump: function() {
      return;
    },

    getRobotPosition: function() {
      var position = {};
      var left  = parseInt(nodes.robot.css('left'));
      var top = parseInt(nodes.robot.css('top'));
      position.x = (left - 20)/100;
      position.y = (top + 133)/-100;
      return position;
    },

    getCubesPosition: function() {
      var cubes = nodes.platform.find('.js-platform-cube');
      var positions = [];
      var left;
      var top;
      for (var i = 0; i < cubes.length; i++) {
        left = Math.abs(parseInt(cubes.eq(i).css('left'))/100);
        top = Math.abs((parseInt(cubes.eq(i).css('top')) + 100)/-100);
        positions[i] = {'x': left, 'y': top};
      }
      return positions;
    },

    checkWalk: function(direction) {
      var robotPosition = methods.getRobotPosition();
      var cubesPosition = methods.getCubesPosition();
      var errors = 0;
      for (var i = 0; i < cubesPosition.length; i++) {
        if ( ((robotPosition.x + parseInt(direction)) === cubesPosition[i].x) && (robotPosition.y === cubesPosition[i].y) ) {  
          errors++;
        }
      }
      return (errors > 0) ? false : true;
    },

    checkPush: function(direction) {
      var robotPosition = methods.getRobotPosition();
      var cubesPosition = methods.getCubesPosition();
      var moveable = { exist: false, pushable: true, fallable: true, x: null, y: null };
      for (var i = 0; i < cubesPosition.length; i++) {
        if ( ((robotPosition.x + parseInt(direction)) === cubesPosition[i].x) && (robotPosition.y === cubesPosition[i].y) ) {  
          moveable.exist = true;
          moveable.x = cubesPosition[i].x;
          moveable.y = cubesPosition[i].y;
        }
      }

      for (var j = 0; j < cubesPosition.length; j++) {
        if (cubesPosition[j].x === moveable.x + 1 && cubesPosition[j].y === moveable.y) {
          moveable.pushable = false;
        } else if (cubesPosition[j].x === moveable.x && cubesPosition[j].y === moveable.y + 1) {
          moveable.pushable = false;
        } else if (cubesPosition[j].x === moveable.x + 1 && cubesPosition[j].y === moveable.y - 1) {
          moveable.fallable = false;
        }
      }

      if (moveable.fallable) {
        var existCubes = 0;
        for (var q = 0; q < cubesPosition.length; q++) {
          if (cubesPosition[q].x === moveable.x + 1 && cubesPosition[q].y < moveable.y) {
            existCubes++;
          }
        }
        moveable.fallRange = moveable.y - existCubes;
      }

      moveable.node = helper.getCubeNode(moveable.x, moveable.y);

      return moveable;
    }

  };

  methods.setEvents();
})(jQuery, window, document);