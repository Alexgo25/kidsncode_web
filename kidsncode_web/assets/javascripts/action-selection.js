(function() {
  var robot = $('.js-window-robot');

  var body = $(document.body);

  body.on({
    click: function() {
      $(this).toggleClass('is-select');
    }
  }, '.js-window-robot');
})();