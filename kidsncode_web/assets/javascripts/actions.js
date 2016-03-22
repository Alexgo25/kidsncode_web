var actions = (function(h, n, s, p, a) {
  var variables = { actionIndex: 0, programStarted: false, awardsFinded: 0 };

  var methods = {
    setEvents: function() {
      n.controls.on({
        click: function() {
          var actions = n.program.find('.js-program-actions').children();
          if (actions.length > 0) {
            variables.programStarted = true;
            methods.setAction();
            n.robot.removeClass('is-select');
          }
        }
      }, '.js-controls-start');

      n.controls.on({
        click: function() {
          s.init();
          variables.actionIndex = 0;
          variables.programStarted = false;
        }
      }, '.js-controls-cancel');

      n.controls.on({
        click: function() {
          var actions = n.program.find('.js-program-actions');
          s.init();
          actions.html('');
          variables.actionIndex = 0;
          variables.programStarted = false;
        }
      }, '.js-controls-restart');

      n.controls.on({
        click: function() {
          var actions = n.program.find('.js-program-actions').children();
          if (actions.length > 0) {
            methods.setAction();
            n.robot.removeClass('is-select');
          }
        }
      }, '.js-controls-debug');
    },

    setAction: function() {
      var actions = n.program.find('.js-program-actions').children();
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
      var direction = n.robot.data('direction') === 'right' ? '+' : '-';
      var walk = methods.checkWalk(direction + 1);

      if (walk.special === 'jump') {
        methods.robotJump();
        return;
      } 
      if (walk.errors === 0) {
        a.robotWalk(n.robot.data('direction'));
        n.robot.animate({ left: direction + '=100px' }, 1000, function() {
          h.setZindexes('horizontal');
          methods.checkAward();
          if (variables.programStarted) methods.setAction();
        });
      } else {
        a.robotMistake(n.robot.data('direction'));
        setTimeout(function() {
          methods.checkAward();
          if (variables.programStarted) methods.setAction();
        }, 2000);
      }
    },

    robotReverse: function() {
      var direction = n.robot.data('direction');
      if (direction === 'right') {
        a.robotReverse('left');
        n.robot.data('direction', 'left');
      } else {
        a.robotReverse('right');
        n.robot.data('direction', 'right');
      }
      setTimeout(function() {
        if (variables.programStarted) methods.setAction();
      }, 1000);
    },

    robotPush: function() {
      var direction = n.robot.data('direction') === 'right' ? '+' : '-';
      var moveable = methods.checkPush(direction + 1);
      var moveableCube;
      if (moveable.exist && moveable.pushable) {
        a.robotPush(n.robot.data('direction'));
        moveable.direction = direction;
        moveableCube = h.getCubeNode(moveable.x, moveable.y);
        if (moveable.fallable) {
          moveableCube.animate({ left: direction + '=100px' }, 1000, function() {
            h.setZindexes('vertical');
            moveableCube.animate({ top: '+='+ (moveable.fallRange * 100) + 'px'}, 250, function() { 
              h.setZindexes('horizontal');
              methods.checkAward();
              if (variables.programStarted) methods.setAction();
            });
          });
        } else {          
          moveableCube.animate({ left: direction + '=100px' }, 1000, function() { 
            h.setZindexes('horizontal');
            methods.checkAward();
            if (variables.programStarted) methods.setAction(); 
          });
        }                
      } else {
        a.robotMistake(n.robot.data('direction'));
        setTimeout(function() {
          methods.checkAward();
          if (variables.programStarted) methods.setAction();
        }, 2000);
      }
    },

    robotJump: function() {
      var parameters;
      var direction = n.robot.data('direction') === 'right' ? '+' : '-';
      var jump = methods.checkJump(direction + 1);
      if (jump.possibility) {
        parameters = {
          start: { x: jump.start.left, y: jump.start.top, angle: jump.start.angle },  
          end: { x: jump.end.left, y: jump.end.top - 1, angle: jump.end.angle, length: jump.end.length }
        }
        a.robotJump(n.robot.data('direction'));
        setTimeout(function() {
          setTimeout(function() { h.setFutureZ(jump.end) }, 600);
          n.robot.animate({path : new $.path.bezier(parameters)}, 1000, function() {
            h.setZindexes('horizontal');
            setTimeout(function() {
              methods.checkAward();
              if (variables.programStarted) methods.setAction();
            }, 400);
          });
        }, 400);
      } else {
        a.robotMistake(n.robot.data('direction'));
        setTimeout(function() {
          methods.checkAward();
          if (variables.programStarted) methods.setAction();
        }, 2000);
      }
    },

    checkWalk: function(direction) {
      var robotCordinates = h.getRobotCordinates();
      var cubesCordinates = h.getCubesCordinates();
      var result = { errors: 0, special: null };
      for (var i = 0; i < cubesCordinates.x.length; i++) {
        if ( ((robotCordinates.x + parseInt(direction)) === cubesCordinates.x[i]) && (robotCordinates.y === cubesCordinates.y[i]) ) {  
          result.errors++;
        }
      }   
      if (h.getCubeNode(robotCordinates.x + parseInt(direction), robotCordinates.y - 1) === undefined) {
        result.special = 'jump';
      }      
      return result;
    },

    checkPush: function(direction) {
      var robotCordinates = h.getRobotCordinates();
      var cubesCordinates = h.getCubesCordinates();
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

      moveable.node = h.getCubeNode(moveable.x, moveable.y);

      return moveable;
    },

    checkJump: function(direction) {
      var robotCordinates = h.getRobotCordinates();
      var cubesCordinates = h.getCubesCordinates();
      var jump = { possibility: true, trajectory: 'straight' , start: {}, end: {} };

      for (var i = 0; i < cubesCordinates.x.length; i++) {
        if ( ((robotCordinates.x + parseInt(direction)) === cubesCordinates.x[i]) && (robotCordinates.y === cubesCordinates.y[i] - 1) ) {  
          jump.possibility = false;
        } else if ( ((robotCordinates.x + parseInt(direction)) === cubesCordinates.x[i]) && (robotCordinates.y === cubesCordinates.y[i]) ) {
          jump.trajectory = 'to-top';
        }
      }

      if (h.getCubeNode(robotCordinates.x + parseInt(direction), robotCordinates.y - 2) === undefined && robotCordinates.y > 2) {
        jump.possibility = false;
      }

      if (h.getCubeNode(robotCordinates.x + parseInt(direction), robotCordinates.y - 1) === undefined) {
        jump.trajectory = 'to-bottom'
        if (robotCordinates.y === 1) { jump.possibility = false };
      }

      jump.start.left = parseInt(n.robot.css('left'));
      jump.start.top = parseInt(n.robot.css('top'));
      jump.end.left = parseInt(n.robot.css('left')) + parseInt(direction) * 100;
      jump.start.angle = -50 * parseInt(direction);
      jump.end.angle = 100 * parseInt(direction);
      jump.end.length = 1;
      
      if (jump.trajectory === 'to-top') {
        jump.end.top = parseInt(n.robot.css('top')) - 100;
      } else if (jump.trajectory === 'to-bottom') {
        jump.end.top = parseInt(n.robot.css('top')) + 100;
        jump.start.angle = 120 * parseInt(direction);
        jump.end.angle = 50 * parseInt(direction);
        jump.end.length = 2.2;
      } else {
        jump.end.top = parseInt(n.robot.css('top'));
      }

      return jump;
    },

    checkAward: function() {
      var robotCordinates = h.getRobotCordinates();
      var award;
      for (var i = 0; i < p.award.x.length; i++) {
        if (p.award.x[i] === robotCordinates.x && p.award.y[i] === robotCordinates.y) {
          award = h.getAwardNode(p.award.x[i], p.award.y[i]);
          award.remove();
          variables.awardsFinded++;
        }
      }
    }

  };

  methods.setEvents();
})(helpers, nodes, setup, properties, animations);