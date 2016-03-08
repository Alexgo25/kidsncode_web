window.levels = {
  0: {    
    cubes: {    
      x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 4, 5, 6, 7, 9, 0, 5, 6, 7, 9, 0, 6, 7, 9, 0, 7, 1, 2],
      y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 , 0 , 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4]
    },
    
    robot: {
      x: 6,
      y: 4,
      direction: 'right'
    },

    award: {
      x: [1, 11],
      y: [1, 1],
      url: ['http://cs631829.vk.me/v631829533/2cb3/V3icNf7q5fs.jpg', 'http://cs622119.vk.me/v622119363/362dd/3kAhx-v-dQ8.jpg']
    }
  }
};

window.properties = window.levels[0];

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
        window.globals.nodes.award.animate({
          top: '-=50'
        }, 1500, function() {
          $('.js-award').animate({
            top: '+=50'
          }, 1500, function() {
            window.globals.methods.animations.awardTop();
          });
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

    getCubesPositions: function() {
      var items = window.globals.nodes.win.find('.js-platform-cube');
      var positions = { x: [], y: [] };
      for (var i = 0; i < items.length; i++) {      
        positions.x.push(Math.abs(parseInt(items.eq(i).css('left'))/100));
        positions.y.push(Math.abs((parseInt(items.eq(i).css('top')) + 100)/(-100)));
      }
      return positions;
    },

    getRobotPosition: function() {
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
      var robotPosition = window.globals.methods.getRobotPosition();
      var positions = window.globals.methods.getCubesPositions();
      for (; i < positions.y.length; i++) {
        zindex = (100 * positions.y[i] + positions.x[i]);
        cube = window.globals.methods.getCubeNode(positions.x[i], positions.y[i]);
        cube.css('zIndex', zindex);
      }
      robot.find('.js-robot-model').css('zIndex', 100 * robotPosition.y + robotPosition.x);
    },

    setFallingZindex: function(cube) {
      var zindex = parseInt(cube.node.css('zIndex')) + parseInt(cube.direction + '1') + (cube.fallRange * -100);     
      console.log(zindex);
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
(function($, window, document, undefined) {
  var nodes = {
    body: $(document.body),
    platform: $('.js-platform'),
    robot: $('.js-robot'),
    award: $('.js-award')
  };

  var properties = window.properties;

  var methods = {
    init: function() {
      methods.setCubes();
      methods.setRobot();
      methods.setAward();
      window.globals.methods.setZindexes();
      window.globals.methods.animations.awardTop();
    },

    setRobot: function() {
      nodes.robot.css({
        'left': 20 + (properties.robot.x * 100) +'px',
        'top': ((properties.robot.y * (-100)) - 133) +'px'
      });
      nodes.robot.data('direction', properties.robot.direction);
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
        var left = 20 + (properties.award.x[i] * 100) +'px';
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