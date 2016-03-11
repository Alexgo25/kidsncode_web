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
      actions.removeClass('is-selected');
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
        actions.eq(i).addClass('is-selected');
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
      var parameters;
      var direction = nodes.robot.data('direction') === 'right' ? '+' : '-';
      var jump = methods.checkJump(direction + 1);
      console.log(jump);
      if (jump.possibility) {
        parameters = {
          start: { x: jump.start.left, y: jump.start.top, angle: jump.start.angle },  
          end: { x: jump.end.left, y: jump.end.top - 1, angle: jump.end.angle, length: jump.end.length }
        }          
        nodes.robot.animate({path : new $.path.bezier(parameters)}, 1000, function() {
          helper.setZindexes();
          methods.setAction(); 
        });
      }
    },

    getRobotCordinates: function() {
      var cordinates = {};
      var left = parseInt(nodes.robot.css('left'));
      var top = parseInt(nodes.robot.css('top'));
      cordinates.x = (left - 20)/100;
      cordinates.y = (top + 133)/-100;
      return cordinates;
    },

    getCubesCordinates: function() {
      var cubes = nodes.platform.find('.js-platform-cube');
      var cordinates = [];
      var left;
      var top;
      for (var i = 0; i < cubes.length; i++) {
        left = Math.abs(parseInt(cubes.eq(i).css('left'))/100);
        top = Math.abs((parseInt(cubes.eq(i).css('top')) + 100)/-100);
        cordinates[i] = {'x': left, 'y': top};
      }
      return cordinates;
    },

    checkWalk: function(direction) {
      var robotPosition = methods.getRobotCordinates();
      var cubesPosition = methods.getCubesCordinates();
      var errors = 0;
      for (var i = 0; i < cubesPosition.length; i++) {
        if ( ((robotPosition.x + parseInt(direction)) === cubesPosition[i].x) && (robotPosition.y === cubesPosition[i].y) ) {  
          errors++;
        }
      }
      return (errors > 0) ? false : true;
    },

    checkPush: function(direction) {
      var robotPosition = methods.getRobotCordinates();
      var cubesPosition = methods.getCubesCordinates();
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
    },

    checkJump: function(direction) {
      var robotPosition = methods.getRobotCordinates();
      var cubesPosition = methods.getCubesCordinates();
      console.log(robotPosition);
      var jump = { possibility: true, trajectory: 'straight' , start: {}, end: {} };

      for (var i = 0; i < cubesPosition.length; i++) {
        if ( ((robotPosition.x + parseInt(direction)) === cubesPosition[i].x) && (robotPosition.y === cubesPosition[i].y - 1) ) {  
          jump.possibility = false;
        } else if ( ((robotPosition.x + parseInt(direction)) === cubesPosition[i].x) && (robotPosition.y === cubesPosition[i].y) ) {
          jump.trajectory = 'to-top';
        }
      }

      if (helper.getCubeNode(robotPosition.x + parseInt(direction), robotPosition.y - 1) === undefined) {
        jump.trajectory = 'to-bottom'
      }

      jump.start.left = parseInt(nodes.robot.css('left'));
      jump.start.top = parseInt(nodes.robot.css('top'));
      jump.end.left = parseInt(nodes.robot.css('left')) + parseInt(direction) * 100;
      jump.start.angle = -50;
      jump.end.angle = 100;
      jump.end.length = 1;
      
      if (jump.trajectory === 'to-top') {
        jump.end.top = parseInt(nodes.robot.css('top')) - 100;
      } else if (jump.trajectory === 'to-bottom') {
        jump.end.top = parseInt(nodes.robot.css('top')) + 100;
        jump.start.angle = 120;
        jump.end.angle = 50;
        jump.end.length = 2.2;
      } else {
        jump.end.top = parseInt(nodes.robot.css('top'));
      }

      return jump;
    }

  };

  methods.setEvents();
})(jQuery, window, document);