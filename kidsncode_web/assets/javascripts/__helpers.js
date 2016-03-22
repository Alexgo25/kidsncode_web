var helpers = (function(n) {
  return {
    getCubesCordinates: function() {
      var items = n.win.find('.js-platform-cube');
      var cordinates = { x: [], y: [] };
      for (var i = 0; i < items.length; i++) {      
        cordinates.x.push(Math.abs(parseInt(items.eq(i).css('left'))/100));
        cordinates.y.push(Math.abs((parseInt(items.eq(i).css('top')) + 100)/(-100)));
      }
      return cordinates;
    },

    getRobotCordinates: function() {
      var cordinates = {};
      var left  = parseInt(n.robot.css('left'));
      var top = parseInt(n.robot.css('top'));
      cordinates.x = (left - 20)/100;
      cordinates.y = (top + 133)/-100;
      return cordinates;
    },

    getCubeNode: function(x, y) {
      var leftCss = (x * 100) + 'px';
      var topCss = ((y * -100) - 100) + 'px';
      var cubes = n.platform.find('.js-platform-cube');
      var i = 0;
      for (; i < cubes.length; i++) {
        if (cubes.eq(i).css('left') === leftCss && cubes.eq(i).css('top') === topCss) {
          return cubes.eq(i);
        }
      }
    },

    getAwardNode: function(x, y) {
      var leftCss = 40 + (x * 100) +'px';
      var topCss = ((y * (-100)) - 100) +'px';
      var awards = n.platform.find('.js-award');
      var i = 0;
      for (; i < awards.length; i++) {
        if (awards.eq(i).css('left') === leftCss && awards.eq(i).css('top') === topCss) {
          return awards.eq(i);
        }
      }
    },

    setZindexes: function(type) {
      var i = 0;
      var cube;
      var robotCordinates = helpers.getRobotCordinates();
      var cubesCordinates = helpers.getCubesCordinates();
      var robotZ = (type === 'horizontal') ? (100 * robotCordinates.y + robotCordinates.x) : (100 * robotCordinates.x + robotCordinates.y);
      var cubeZ;
      for (; i < cubesCordinates.y.length; i++) {
        cubeZ = (type === 'horizontal') ? (100 * cubesCordinates.y[i] + cubesCordinates.x[i]) : (100 * cubesCordinates.x[i] + cubesCordinates.y[i]);
        cube = helpers.getCubeNode(cubesCordinates.x[i], cubesCordinates.y[i]);
        cube.css('zIndex', cubeZ);
      }
      n.robot.find('.js-robot-model')
        .css('zIndex', robotZ);
    },

    setFutureZ: function(end) {
      var z = 100 * ((end.top + 133)/-100) + ((end.left - 20)/100);
      n.robot.find('.js-robot-model')
        .css('zIndex', z);
    }
  }
}(nodes));