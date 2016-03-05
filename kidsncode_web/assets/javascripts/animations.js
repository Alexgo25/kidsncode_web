window.animations = {
  nodes: {
    body: $(document.body),
    award: $('.js-award'),
    robot: $('.js-robot')
  },

  methods: {
    awardTop: function() {
      window.animations.nodes.award.animate({
        top: '-=50'
      }, 1500, function() {
        window.animations.methods.awardBottom()
      });
    },
    
    awardBottom: function() {
      window.animations.nodes.award.animate({
        top: '+=50'
      }, 1500, function() {
        window.animations.methods.awardTop()
      });
    },

    robotWalk: function() {      
      for (var i = 1; i <= 9; i++) {
        (function(index) {
          setTimeout(function(){
            window.animations.nodes.robot.find('.js-robot-model').html('').append('<span class="sprite icon-robot-walk-right-'+ index +'"></span>');
          }, index * 110);
        })(i);
      }
    }
    
  }
};