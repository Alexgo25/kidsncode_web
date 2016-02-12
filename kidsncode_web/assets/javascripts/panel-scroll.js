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