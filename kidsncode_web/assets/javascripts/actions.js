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

  var helper = window.helpers.methods;
  var animation = window.helpers.methods.animations;
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
      actions.removeClass('is-selected');
      if (actions.eq(i).hasClass('js-program-action')) {
        switch (actions.eq(i).data('action')) {
          case 'walk':
            methods.robotWalk();
            break;
          case 'reverse':
            methods.robotReverse();
            break;
          case 'push':
            methods.robotPush();
            break;
          case 'jump':
            methods.robotJump();
            break;
        }
        actions.eq(i).addClass('is-selected');
      }
      variables.actionIndex++;
    },

    robotWalk: function() {
      var direction = nodes.robot.data('direction') === 'right' ? '+' : '-';
      var walk = methods.checkWalk(direction + 1);

      if (walk.special === 'jump') {
        methods.robotJump();
        return;
      } 
      if (walk.errors === 0) {
        nodes.robot.animate({ left: direction + '=100px' }, 1000, function() {
          helper.setZindexes('horizontal');
          methods.setAction();
        });
      } else {
        alert('Walk mistake');
        setTimeout(function() {
          methods.setAction();
        }, 100);
      }
    },

    robotReverse: function() {
      var direction = nodes.robot.data('direction');
      if (direction === 'right') {
        nodes.robot.data('direction', 'left');
        nodes.robot.find('.js-robot-model').html('<span class="sprite icon-robot-left"></span>')
      } else {
        nodes.robot.data('direction', 'right');
        nodes.robot.find('.js-robot-model').html('<span class="sprite icon-robot-right"></span>')
      }
      setTimeout(function() {
        methods.setAction();
      }, 10);
    },

    robotPush: function() {
      var direction = nodes.robot.data('direction') === 'right' ? '+' : '-';
      var moveable = methods.checkPush(direction + 1);
      var moveableCube;
      if (moveable.exist && moveable.pushable) {
        moveable.direction = direction;
        moveableCube = helper.getCubeNode(moveable.x, moveable.y);
        if (moveable.fallable) {
          moveableCube.animate({ left: direction + '=100px' }, 1000, function() {
            helper.setFallingZindex(moveable);
            moveableCube.animate({ top: '+='+ (moveable.fallRange * 100) + 'px'}, 250, function() { methods.setAction() });
          });
        } else {          
          moveableCube.animate({ left: direction + '=100px' }, 1000, function() { 
            helper.setZindexes('horizontal');
            methods.setAction(); 
          });
        }                
      } else {
        alert('Push mistake');
        setTimeout(function() {
          methods.setAction();
        }, 100);
      }
    },

    robotJump: function() {
      var parameters;
      var direction = nodes.robot.data('direction') === 'right' ? '+' : '-';
      var jump = methods.checkJump(direction + 1);
      if (jump.possibility) {
        parameters = {
          start: { x: jump.start.left, y: jump.start.top, angle: jump.start.angle },  
          end: { x: jump.end.left, y: jump.end.top - 1, angle: jump.end.angle, length: jump.end.length }
        }
        nodes.robot.animate({path : new $.path.bezier(parameters)}, 1000, function() {
          helper.setZindexes('horizontal');
          methods.setAction(); 
        });
      } else {
        alert('Jump mistake');
        setTimeout(function() {
          methods.setAction();
        }, 100);
      }
    },

    checkWalk: function(direction) {
      var robotCordinates = helper.getRobotCordinates();
      var cubesCordinates = helper.getCubesCordinates();
      var result = { errors: 0, special: null };
      for (var i = 0; i < cubesCordinates.x.length; i++) {
        if ( ((robotCordinates.x + parseInt(direction)) === cubesCordinates.x[i]) && (robotCordinates.y === cubesCordinates.y[i]) ) {  
          result.errors++;
        }
      }   
      if (helper.getCubeNode(robotCordinates.x + parseInt(direction), robotCordinates.y - 1) === undefined) {
        result.special = 'jump';
      }      
      return result;
    },

    checkPush: function(direction) {
      var robotCordinates = helper.getRobotCordinates();
      var cubesCordinates = helper.getCubesCordinates();
      var moveable = { exist: false, pushable: true, fallable: true, x: null, y: null };
      for (var i = 0; i < cubesCordinates.x.length; i++) {
        if ( ((robotCordinates.x + parseInt(direction)) === cubesCordinates.x[i]) && (robotCordinates.y === cubesCordinates.y[i]) ) {  
          moveable.exist = true;
          moveable.x = cubesCordinates.x[i];
          moveable.y = cubesCordinates.y[i];
        }
      }

      for (var j = 0; j < cubesCordinates.x.length; j++) {
        if (cubesCordinates.x[j] === moveable.x + 1 && cubesCordinates.y[j] === moveable.y) {
          moveable.pushable = false;
        } else if (cubesCordinates.x[j] === moveable.x && cubesCordinates.y[j] === moveable.y + 1) {
          moveable.pushable = false;
        } else if (cubesCordinates.x[j] === moveable.x + 1 && cubesCordinates.y[j] === moveable.y - 1) {
          moveable.fallable = false;
        }
      }

      if (moveable.fallable) {
        var existCubes = 0;
        for (var q = 0; q < cubesCordinates.x.length; q++) {
          if (cubesCordinates.x[q] === moveable.x + 1 && cubesCordinates.y[q] < moveable.y) {
            existCubes++;
          }
        }
        moveable.fallRange = moveable.y - existCubes;
      }

      moveable.node = helper.getCubeNode(moveable.x, moveable.y);

      return moveable;
    },

    checkJump: function(direction) {
      var robotCordinates = helper.getRobotCordinates();
      var cubesCordinates = helper.getCubesCordinates();
      var jump = { possibility: true, trajectory: 'straight' , start: {}, end: {} };

      for (var i = 0; i < cubesCordinates.x.length; i++) {
        if ( ((robotCordinates.x + parseInt(direction)) === cubesCordinates.x[i]) && (robotCordinates.y === cubesCordinates.y[i] - 1) ) {  
          jump.possibility = false;
        } else if ( ((robotCordinates.x + parseInt(direction)) === cubesCordinates.x[i]) && (robotCordinates.y === cubesCordinates.y[i]) ) {
          jump.trajectory = 'to-top';
        }
      }

      if (helper.getCubeNode(robotCordinates.x + parseInt(direction), robotCordinates.y - 2) === undefined && robotCordinates.y > 2) {
        jump.possibility = false;
      }

      if (helper.getCubeNode(robotCordinates.x + parseInt(direction), robotCordinates.y - 1) === undefined) {
        jump.trajectory = 'to-bottom'
        if (robotCordinates.y === 1) { jump.possibility = false };
      }

      jump.start.left = parseInt(nodes.robot.css('left'));
      jump.start.top = parseInt(nodes.robot.css('top'));
      jump.end.left = parseInt(nodes.robot.css('left')) + parseInt(direction) * 100;
      jump.start.angle = -50 * parseInt(direction);
      jump.end.angle = 100 * parseInt(direction);
      jump.end.length = 1;
      
      if (jump.trajectory === 'to-top') {
        jump.end.top = parseInt(nodes.robot.css('top')) - 100;
      } else if (jump.trajectory === 'to-bottom') {
        jump.end.top = parseInt(nodes.robot.css('top')) + 100;
        jump.start.angle = 120 * parseInt(direction);
        jump.end.angle = 50 * parseInt(direction);
        jump.end.length = 2.2;
      } else {
        jump.end.top = parseInt(nodes.robot.css('top'));
      }

      return jump;
    }

  };

  methods.setEvents();
})(jQuery, window, document);