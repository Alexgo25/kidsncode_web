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

      nodes.controls.on({
        click: function() {
          var actions = nodes.program.find('.js-program-actions').children();
          for (var i = 0; i < actions.length; i++) {
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
          }
        }
      }, '.js-controls-start');

    },

    robotWalk: function() {
      if (nodes.robot.data('direction') === 'right'){
        nodes.robot.animate({left: '+=100px' }, 1000);
      } else if (nodes.robot.data('direction') === 'left') {
        nodes.robot.animate({left: '-=100px' }, 1000);
      }
    }
    
  };

  methods.setEvents();
})(jQuery, window, document);