var program = (function(h, n, a) {
  var methods = {
    setEvents: function() {

      n.robot.on({
        click: function() {
          $(this).toggleClass('is-select');
          if ($(this).hasClass('is-select')) {
            a.robotTurnFacing(n.robot.data('direction'));
          } else {
            a.robotTurnFacingBack(n.robot.data('direction'));
          }
        }
      });

      n.robot.on({
        click: function(event) {
          event.preventDefault();
          event.stopPropagation();
          var type = $(this).data('action');
          var name = methods.getActionName(type);
          var newAction = '<div class="panel-program__action js-program-action" data-action="' + type + '">'+ name +'</div>';
          n.program.find('.js-program-actions').append(newAction);
        }
      }, '.js-robot-action');

      n.program.on({
        click: function() {
          if ($(this).parents('.js-program-loop').length) {
            return;
          }
          $(this).toggleClass('is-loopy');
          methods.openLoopControl();
        }
      }, '.js-program-action');

      n.loop.on({
        click: function() {
          var newLoop;
          var loopyEl    = n.program.find('.js-program-action.is-loopy');
          var loopyFirst = loopyEl.first();
          var loopSteps  = n.controls.find('.js-loop-slider-element.is-active').data('index');

          loopyFirst
            .before('<div class="panel-program__loop js-program-loop is-new" data-index="'+ loopSteps +'">'
              +'<div class="panel-program__loop-angle js-program-loop-angle">'
              +'<div class="panel-program__loop-horizontal"></div>'
              +'<div class="panel-program__loop-vertical js-program-loop-angle-vertical"></div>'
              +'<div class="panel-program__loop-title js-program-loop-angle-title"></div>'
              +'</div></div>');

          newLoop = n.program.find('.js-program-loop.is-new');
          newLoop.append(loopyEl.removeClass('is-loopy'));

          n.controls.removeClass('is-loop');

          setTimeout(function() {         
            newLoop.find('.js-program-loop-angle-title').append('ПОВТОРИТЬ x' + loopSteps);
            newLoop.find('.js-program-loop-angle').addClass('is-open');
            newLoop.find('.js-program-loop-angle-vertical')
              .css('min-height', (48 + 40 * loopyEl.length) + 'px');
            newLoop.removeClass('is-new');
          }, 500);

        }
      }, '.js-loop-submit');

      n.loop.on({
        click: function() {
          variables.newLoop = [];
          n.controls.removeClass('is-loop');
        }
      }, '.js-loop-cancel');

    },

    openLoopControl: function() {
      var actions = n.program.find('.js-program-action.is-loopy');
      if (actions.length > 0) {
        n.controls.addClass('is-loop');
      } else {
        n.controls.removeClass('is-loop');
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
          return 'прыгнуть';
      }
    } 
  };
  methods.setEvents();
})(helpers, nodes, animations);