window.levels = {
  0: {
    platform: {
      quantity: 10,
      spaceIndexes: [5, 8]
    },
    
    moveable: {
      positions: [4, 7]
    },
    
    robot: {
      position: 2,
      top: false,
      direction: 'right'
    },

    award: {
      position: 9,
      url: 'http://cs631829.vk.me/v631829533/2cb3/V3icNf7q5fs.jpg'
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
        methods.getCubeNode(moveable.left, moveable.top)
          .animate({ left: direction + '=100px' }, 1000, function() { methods.setAction() });
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
      var node = nodes.platform.find('.js-platform-cube-moveable[style="left: ' + leftCss 
                                                                    + '; top: ' + topCss +';"]');
      node.addClass('akscma[sodcikn');
      return node;
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
      var moveable = { exist: false };
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
(function($, window, document, undefined) {
  var nodes = {
    body: $(document.body),
    award: $('.js-award')
  };
  var methods = {
    awardTop: function() {
      nodes.award.animate({
        top: '-=50'
      }, 1500, function() {
        methods.awardBottom()
      });
    },
    awardBottom: function() {
      nodes.award.animate({
        top: '+=50'
      }, 1500, function() {
        methods.awardTop()
      });
    }
    
  };

  methods.awardTop();
})(jQuery, window, document);
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
      methods.setRobot();
      methods.setAward();
      methods.setMoveables();
      methods.setPlatform();
      methods.setZindex();
      methods.setSpaces();
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
      nodes.robot.css('left', 20 + (properties.robot.position * 100) +'px' );
      nodes.robot.data('direction', properties.robot.direction);
      if (properties.robot.top) {
        nodes.robot.css({top: '-=100px', zIndex: 200});
      }
    },

    setMoveables: function() {
      var moveablePositions = properties.moveable.positions;
      for (var i = 0; i < moveablePositions.length; i++) {
        var left = moveablePositions[i] * 100 + 'px';
        nodes.platform
          .prepend('<div class="window-platform__cube-moveable js-platform-cube-moveable"'
            +'style="left: '+ left +'">'
            +'<span class="sprite icon-cube-moveable"></span></div>');
      }
    },

    setAward: function() {
      nodes.award.css('left', 20 + (properties.award.position * 100) );
      nodes.award.css('background-image', 'url(' + properties.award.url + ')');
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
// (function() {
//   var program        = $('.js-panel-program');
//   var programActions = program.find('.js-panel-program-content');

//   var win            = $(window);
//   var body           = $(document.body);
  
//   var getVisibleHeight;
//   var setSize;
//   var init;
//   var windowHeight;
//   var clientScrollTop;
//   var clientScrollBot;

//   getVisibleHeight = function(item) {
//     var itemTop           = item.offset().top;
//     var itemBottom        = itemTop + item.outerHeight();
//     var itemVisibleTop    = itemTop < clientScrollTop ? clientScrollTop : itemTop;
//     var itemVisibleBottom = itemBottom > clientScrollBot ? clientScrollBot : itemBottom;
    
//     return (itemVisibleBottom - itemVisibleTop);
//   };

//   setSize = function() {
//     windowHeight    = win.height();
//     clientScrollTop = win.scrollTop();
//     clientScrollBot = clientScrollTop + windowHeight;
//     programActionsHeight = programActions.height();
//   };

//   init = function() {
//     setSize();
//   };

//   body.on({
//     mousemove: function(event) {
//       var e = event || window.event;

//       var diff;
//       var currentCursorPosition;
//       var clientMovePersentage;
//       var programAreaHeight = getVisibleHeight(program);

//       if (programAreaHeight > programActionsHeight) {
//         diff = 0;
//       } else {
//         currentCursorPosition = e.clientY - 100;
//         clientMovePersentage = currentCursorPosition / (programAreaHeight - 100);

//         diff = - ((programActionsHeight - programAreaHeight) * clientMovePersentage);

//         if (diff > 0) {
//           diff = 0;
//         }
//         programActions.css({marginTop: diff});
//       }
//     }
//   }, '.js-panel-program');

//   win.on('scroll resize', setSize); 
   
//   init();
// })();
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