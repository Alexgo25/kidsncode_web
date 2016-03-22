var animations = (function(n) {
  return {
    awardTop: function() {
      $('.js-award').animate({
        marginTop: '-=50'
      }, 1500).promise().done(function() {
        animations.awardBottom();
      });
    },
    awardBottom: function() {
      $('.js-award').animate({
        marginTop: '+=50'
      }, 1500).promise().done(function() {
        animations.awardTop();
      });
    },

    robotWalk: function(direction) {      
      (function walk(index, times) {          
        setTimeout(function () {   
          n.robot.find('.js-robot-model').html('<span class="sprite icon-robot-walk-' + direction + '-'+ index +'"></span>');
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
              n.robot.find('.js-robot-model').html('<span class="sprite icon-robot-turn-'+ index +'"></span>');
              if (index < 7) {
                index++;
                increaseReverse(index);
              } 
           }, 101)
        })(1);
      } else if (direction === 'right') {
        (function decreaseReverse(index) {          
           setTimeout(function () {   
              n.robot.find('.js-robot-model').html('<span class="sprite icon-robot-turn-'+ index +'"></span>');
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
          n.robot.find('.js-robot-model').html('<span class="sprite icon-robot-push-'+ direction +'-'+ index +'"></span>');
          if (index > 1) {
            index--;
            decreasePush(index, direction);
          }
        }, 50);
      };
      
      (function increasePush(index, direction) {          
        setTimeout(function () {   
          n.robot.find('.js-robot-model').html('<span class="sprite icon-robot-push-'+ direction +'-'+ index +'"></span>');
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
          n.robot.find('.js-robot-model').html('<span class="sprite icon-robot-mistake-'+ index +'"></span>');
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
          n.robot.find('.js-robot-model').html('<span class="sprite icon-robot-turn-facing-' + direction +'-'+ index +'"></span>');
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
          n.robot.find('.js-robot-model').html('<span class="sprite icon-robot-turn-facing-' + direction +'-'+ index +'"></span>');
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
          n.robot.find('.js-robot-model').html('<span class="sprite icon-robot-jump-'+ direction +'-'+ index +'"></span>');
          if (index > 1) {
            index--;
            decreaseJump(index, direction);
          }
        }, 100);
      };
      
      (function increaseJump(index, direction) {         
        setTimeout(function () {   
          n.robot.find('.js-robot-model').html('<span class="sprite icon-robot-jump-'+ direction +'-'+ index +'"></span>');
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
          n.robot.find('.js-robot-model').html('<span class="sprite icon-robot-turn-facing-' + direction +'-'+ index +'"></span>');
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
          n.robot.find('.js-robot-model').html('<span class="sprite icon-robot-turn-facing-' + direction +'-'+ index +'"></span>');
          if (index > 1) {
            index--;
            turnFacingBack(index, direction);
          }
        }, 100);
      })(5, direction);
    }
  }
})(nodes);    