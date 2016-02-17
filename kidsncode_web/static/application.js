window.levels = {
  0: {
    platform: {
      quantity: 12,
      spaceIndexes: [3, 6]
    },
    
    moveable: {
      quantity: 2,
      positions: [2, 5]
    },
    
    robot: {
      position: 1
    },

    award: {
      position: 7,
      url: 'http://cs631829.vk.me/v631829533/2cb3/V3icNf7q5fs.jpg'
    }
  }
};
// (function($, window, document, undefined) {
//   var nodes = {
//     body: $(document.body),
//     robot: $('.js-robot'),
//     program: $('.js-program'),
//     controls: $('.js-controls'),
//     loop: $('.js-loop')
//   };
//   var methods = {
//     setEvents: function() {
//       nodes.controls.on({click: function() {}}, '.js-')
//     },
    
//   };

//   methods.setEvents();
// })(jQuery, window, document);
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
      methods.setPlatform();
      methods.setZindex();
      methods.setSpaces();
      methods.setRobot();
      methods.setAward();
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
      nodes.robot.css('left', 20 + (properties.robot.position * 100) );
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
          variables.newLoop.push($(this).removeClass('is-loop'));
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
      if (type === 'walk') {
        return 'шагнуть';
      } else if (type === 'reverse') {
        return 'повернуть';
      } else if (type === 'push') {
        return 'толкнуть';
      } else if (type === 'jump') {
        return 'запрыгнуть';
      }
    }
    
  };

  methods.setEvents();

})(jQuery, window, document);