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