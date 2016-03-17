window.levels = {
  0: {    
    cubes: {    
      x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 5, 6, 7, 9, 0, 2, 6, 7, 9, 7],
      y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 , 0 , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 , 1 , 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4]
    },
    
    robot: {
      x: 1,
      y: 3,
      direction: 'left'
    },

    award: {
      x: [9, 11],
      y: [4, 2],
      url: ['http://cs631829.vk.me/v631829533/2cb3/V3icNf7q5fs.jpg', 'http://cs624818.vk.me/v624818533/31842/RUu8UoenACM.jpg']
    }
  }
};

window.properties = window.levels[0];

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

      robotWalk: function(direction) {      
        for (var i = 1; i <= 9; i++) {
          (function(index, direction) {
            setTimeout(function(){
              window.helpers.nodes.robot.find('.js-robot-model').html('').append('<span class="sprite icon-robot-walk-' + direction + '-'+ index +'"></span>');
            }, index * 110);
          })(i, direction);
        }
      },

      robotReverse: function(direction) {  
        if (direction === 'left') {
          (function increaseReverse(index) {          
             setTimeout(function () {   
                window.helpers.nodes.robot.find('.js-robot-model').html('').append('<span class="sprite icon-robot-turn-'+ index +'"></span>');
                if (index < 7) {
                  index++;
                  increaseReverse(index);
                } 
             }, 101)
          })(1);
        } else if (direction === 'right') {
          (function decreaseReverse(index) {          
             setTimeout(function () {   
                window.helpers.nodes.robot.find('.js-robot-model').html('').append('<span class="sprite icon-robot-turn-'+ index +'"></span>');
                if (index > 1) {
                  index--;
                  decreaseReverse(index);
                } 
             }, 101)
          })(7);
        }
      },

      robotPush: function(direction) {
        var decreasePush = function(index, direction) {
          setTimeout(function () {   
            window.helpers.nodes.robot.find('.js-robot-model').html('').append('<span class="sprite icon-robot-push-'+ direction +'-'+ index +'"></span>');
            if (index > 1) {
              index--;
              decreasePush(index, direction);
            }
          }, 50);
        };
        
        (function increasePush(index, direction) {          
          setTimeout(function () {   
            window.helpers.nodes.robot.find('.js-robot-model').html('').append('<span class="sprite icon-robot-push-'+ direction +'-'+ index +'"></span>');
            if (index < 5) {
              index++;
              increasePush(index, direction);
            } else {
              decreasePush(5, direction);
            }
          }, 50);
        })(1, direction);
      },

      robotMistake: function() {
        (function mistake(index) {          
          setTimeout(function () {   
            window.helpers.nodes.robot.find('.js-robot-model').html('').append('<span class="sprite icon-robot-mistake-'+ index +'"></span>');
            if (index < 9) {
              index++;
              mistake(index);
            }
          }, 100);
        })(1);
      }
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
        helper.animations.robotWalk(nodes.robot.data('direction'));
        nodes.robot.animate({ left: direction + '=100px' }, 1000, function() {
          helper.setZindexes('horizontal');
          methods.setAction();
        });
      } else {
        helper.animations.robotMistake();
        setTimeout(function() {
          methods.setAction();
        }, 1000);
      }
    },

    robotReverse: function() {
      var direction = nodes.robot.data('direction');
      if (direction === 'right') {
        helper.animations.robotReverse('left');
        nodes.robot.data('direction', 'left');
      } else {
        helper.animations.robotReverse('right');
        nodes.robot.data('direction', 'right');
      }
      setTimeout(function() {
        methods.setAction();
      }, 1000);
    },

    robotPush: function() {
      var direction = nodes.robot.data('direction') === 'right' ? '+' : '-';
      var moveable = methods.checkPush(direction + 1);
      var moveableCube;
      if (moveable.exist && moveable.pushable) {
        helper.animations.robotPush(nodes.robot.data('direction'));
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
        helper.animations.robotMistake();
        setTimeout(function() {
          methods.setAction();
        }, 1000);
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
        helper.animations.robotMistake();
        setTimeout(function() {
          methods.setAction();
        }, 1000);
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
(function() {
  var node           = $('.js-loop-slider');
  var sliderLeft     = node.find('.js-loop-slider-left');
  var sliderRight    = node.find('.js-loop-slider-right');
  var sliderElements = node.find('.js-loop-slider-elements');
  var sliderElement;

  var body = $(document.body);

  var currentElement;
  var currentIndex;
  var newElement;

  var checkIfEnd;
  var actionFinished = true;

  body.on({
    click: function() {
      if (checkIfEnd() !== 'right-false' && actionFinished) {
        actionFinished = false;
        sliderElement = node.find('.js-loop-slider-element');
        for (var i = 0; i < sliderElement.length; i++) {
          if (sliderElement.eq(i).hasClass('is-active')) {
            currentElement = sliderElement.eq(i);
            currentIndex = currentElement.data('index');
            newElement = '<div class="panel-controls__loop-element js-loop-slider-element is-active" data-index="'+ (currentIndex + 1) +'">'+ (currentIndex + 1) +'</div>';
            currentElement.css('marginLeft', '-100%').removeClass('is-active').addClass('is-left');
            sliderElements.append(newElement);
          }
          else if (sliderElement.eq(i).hasClass('is-left') || sliderElement.eq(i).hasClass('is-right')) {
            sliderElement.eq(i).remove();
          }
        }
        checkIfEnd();
      }
    }
  }, '.js-loop-slider-right');

  body.on({
    click: function() {
      if (checkIfEnd() !== 'left-false' && actionFinished) {
        actionFinished = false;
        sliderElement = node.find('.js-loop-slider-element');
        for (var i = 0; i < sliderElement.length; i++) {
          if (sliderElement.eq(i).hasClass('is-active')) {
            currentElement = sliderElement.eq(i);
            currentIndex = currentElement.data('index');
            newElement = '<div class="panel-controls__loop-element js-loop-slider-element is-active is-margin-left" data-index="'+ (currentIndex - 1) +'">'+ (currentIndex - 1) +'</div>';
            sliderElements.prepend(newElement);
            currentElement.removeClass('is-active').addClass('is-right');
            setTimeout(function(){            
              node.find('.is-margin-left').removeClass('is-margin-left');              
            }, 2);
          }
          else if (sliderElement.eq(i).hasClass('is-left') || sliderElement.eq(i).hasClass('is-right')) {
            sliderElement.eq(i).remove();
          }
        }
        checkIfEnd();
      }
    }
  }, '.js-loop-slider-left');

  body.on({
    transitionend: function() {
      actionFinished = true;
    }
  }, '.js-loop-slider-element');

  checkIfEnd = function() {
    sliderElement = node.find('.js-loop-slider-element');
    for (var i = 0; i < sliderElement.length; i++) {
      if (sliderElement.eq(i).hasClass('is-active')) {
        if (sliderElement.eq(i).data('index') === 1) {
          sliderLeft.addClass('is-disabled');
          return 'left-false'
        } else if (sliderElement.eq(i).data('index') === 20) {
          sliderRight.addClass('is-disabled');
          return 'right-false'
        }
      } else {
        sliderLeft.removeClass('is-disabled');
        sliderRight.removeClass('is-disabled');
      }
    }
  };

  checkIfEnd();
})();
(function($, window, document, undefined) {

  var nodes = {
    body: $(document.body),
    robot: $('.js-robot'),
    program: $('.js-program'),
    controls: $('.js-controls'),
    loop: $('.js-loop')
  };

  var methods = {
    setEvents: function() {

      nodes.robot.on({
        click: function() {
          $(this).toggleClass('is-select');
        }
      });

      nodes.robot.on({
        click: function(event) {
          event.preventDefault();
          event.stopPropagation();
          var type = $(this).data('action');
          var name = methods.getActionName(type);
          var newAction = '<div class="panel-program__action js-program-action" data-action="' + type + '">'+ name +'</div>';
          nodes.program.find('.js-program-actions').append(newAction);
        }
      }, '.js-robot-action');

      nodes.program.on({
        click: function() {
          if ($(this).parents('.js-program-loop').length) {
            return;
          }
          $(this).toggleClass('is-loopy');
          methods.openLoopControl();
        }
      }, '.js-program-action');

      nodes.loop.on({
        click: function() {
          var newLoop;
          var loopyEl    = nodes.program.find('.js-program-action.is-loopy');
          var loopyFirst = loopyEl.first();
          var loopSteps  = nodes.controls.find('.js-loop-slider-element.is-active').data('index');

          loopyFirst
            .before('<div class="panel-program__loop js-program-loop is-new" data-index="'+ loopSteps +'">'
              +'<div class="panel-program__loop-angle js-program-loop-angle">'
              +'<div class="panel-program__loop-horizontal"></div>'
              +'<div class="panel-program__loop-vertical js-program-loop-angle-vertical"></div>'
              +'<div class="panel-program__loop-title js-program-loop-angle-title"></div>'
              +'</div></div>');

          newLoop = nodes.program.find('.js-program-loop.is-new');
          newLoop.append(loopyEl.removeClass('is-loopy'));

          nodes.controls.removeClass('is-loop');

          setTimeout(function() {         
            newLoop.find('.js-program-loop-angle-title').append('ПОВТОРИТЬ x' + loopSteps);
            newLoop.find('.js-program-loop-angle').addClass('is-open');
            newLoop.find('.js-program-loop-angle-vertical')
              .css('min-height', (48 + 40 * loopyEl.length) + 'px');
            newLoop.removeClass('is-new');
          }, 500);

        }
      }, '.js-loop-submit');

      nodes.loop.on({
        click: function() {
          variables.newLoop = [];
          nodes.controls.removeClass('is-loop');
        }
      }, '.js-loop-cancel');

    },

    openLoopControl: function() {
      var actions = nodes.program.find('.js-program-action.is-loopy');
      if (actions.length > 0) {
        nodes.controls.addClass('is-loop');
      } else {
        nodes.controls.removeClass('is-loop');
      }
    },

    getActionName: function(type) {
      switch (type) {
        case 'walk':
          return 'шагнуть';
        case 'reverse':
          return 'повернуть';
        case 'push':
          return 'толкнуть';
        case 'jump':
          return 'запрыгнуть';
      }
    }
    
  };

  methods.setEvents();

})(jQuery, window, document);