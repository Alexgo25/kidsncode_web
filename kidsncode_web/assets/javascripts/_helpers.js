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
        (function walk(index, times) {          
          setTimeout(function () {   
            window.helpers.nodes.robot.find('.js-robot-model').html('<span class="sprite icon-robot-walk-' + direction + '-'+ index +'"></span>');
            if (index < 9 && (times === 2 || times === 1)) {
              index++;
              walk(index, times);
            } else if (times === 2){
              walk(1, 1);
            } 
          }, 50)
        })(1, 2);
      },

      robotReverse: function(direction) {  
        if (direction === 'left') {
          (function increaseReverse(index) {          
             setTimeout(function () {   
                window.helpers.nodes.robot.find('.js-robot-model').html('<span class="sprite icon-robot-turn-'+ index +'"></span>');
                if (index < 7) {
                  index++;
                  increaseReverse(index);
                } 
             }, 101)
          })(1);
        } else if (direction === 'right') {
          (function decreaseReverse(index) {          
             setTimeout(function () {   
                window.helpers.nodes.robot.find('.js-robot-model').html('<span class="sprite icon-robot-turn-'+ index +'"></span>');
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
            window.helpers.nodes.robot.find('.js-robot-model').html('<span class="sprite icon-robot-push-'+ direction +'-'+ index +'"></span>');
            if (index > 1) {
              index--;
              decreasePush(index, direction);
            }
          }, 50);
        };
        
        (function increasePush(index, direction) {          
          setTimeout(function () {   
            window.helpers.nodes.robot.find('.js-robot-model').html('<span class="sprite icon-robot-push-'+ direction +'-'+ index +'"></span>');
            if (index < 5) {
              index++;
              increasePush(index, direction);
            } else {
              decreasePush(5, direction);
            }
          }, 50);
        })(1, direction);
      },

      robotMistake: function(direction) {
        var mistake = function(index) {
          setTimeout(function () {   
            window.helpers.nodes.robot.find('.js-robot-model').html('<span class="sprite icon-robot-mistake-'+ index +'"></span>');
            if (index < 9) {
              index++;
              mistake(index);
            } else {
              turnBack(5, direction);
            }
          }, 100);
        };
        var turn = function(index, direction) {
          setTimeout(function () {   
            window.helpers.nodes.robot.find('.js-robot-model').html('<span class="sprite icon-robot-turn-facing-' + direction +'-'+ index +'"></span>');
            if (index < 5) {
              index++;
              turn(index, direction);
            } else {
              mistake(1);
            }
          }, 100);
        };

        var turnBack = function(index, direction) {
          setTimeout(function () {   
            window.helpers.nodes.robot.find('.js-robot-model').html('<span class="sprite icon-robot-turn-facing-' + direction +'-'+ index +'"></span>');
            if (index > 1) {
              index--;
              turnBack(index, direction);
            }
          }, 100);
        }

        turn(1, direction);
      },

      robotJump: function(direction) {
        var decreaseJump = function(index, direction) {
          setTimeout(function () {   
            window.helpers.nodes.robot.find('.js-robot-model').html('<span class="sprite icon-robot-jump-'+ direction +'-'+ index +'"></span>');
            if (index > 1) {
              index--;
              decreaseJump(index, direction);
            }
          }, 100);
        };
        
        (function increaseJump(index, direction) {         
          setTimeout(function () {   
            window.helpers.nodes.robot.find('.js-robot-model').html('<span class="sprite icon-robot-jump-'+ direction +'-'+ index +'"></span>');
            if (index < 8) {
              index++;
              increaseJump(index, direction);
            } else {
              setTimeout(function() { decreaseJump(8, direction); }, 300);
            }
          }, 100);
        })(1, direction);
      },

      robotTurnFacing: function(direction) {
        (function turnFacing(index, direction) {
          setTimeout(function () {   
            window.helpers.nodes.robot.find('.js-robot-model').html('<span class="sprite icon-robot-turn-facing-' + direction +'-'+ index +'"></span>');
            if (index < 5) {
              index++;
              turnFacing(index, direction);
            }
          }, 100);
        })(1, direction);
      },

      robotTurnFacingBack: function(direction) {
        (function turnFacingBack(index, direction) {
          setTimeout(function () {
            window.helpers.nodes.robot.find('.js-robot-model').html('<span class="sprite icon-robot-turn-facing-' + direction +'-'+ index +'"></span>');
            if (index > 1) {
              index--;
              turnFacingBack(index, direction);
            }
          }, 100);
        })(5, direction);
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

    setFutureZ: function(end) {
      var z = 100 * ((end.top + 133)/-100) + ((end.left - 20)/100);
      window.helpers.nodes.robot.find('.js-robot-model')
        .css('zIndex', z);
    }

  }
};