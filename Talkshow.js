// Generated by CoffeeScript 1.3.3
(function() {
  var Talkshow;

  Talkshow = (function() {

    function Talkshow() {
      var grid, keyboardInput, myDataSource, rootNodeId;
      grid = new Grid(4, 2);
      this.navigationController = new NavigationController(grid);
      rootNodeId = localStorage.getItem("root");
      console.log("rootNodeId", rootNodeId);
      myDataSource = new NavigationDataSource(grid, this.navigationController, 1, rootNodeId);
      myDataSource.delegate = this;
      this.navigationController.push(myDataSource);
      keyboardInput = new KeyboardInput(this);
    }

    Talkshow.prototype.enterCell = function(x, y) {
      return this.navigationController.currentController().enterCell(x, y);
    };

    Talkshow.prototype.enteredCell = function(dataSource, position, level, nodeId) {
      var myDataSource;
      console.log("enteredCell " + position.x + "/" + position.y + " level: " + level + " nodeId: " + nodeId);
      myDataSource = new NavigationDataSource(this.grid, this.navigationController, level, nodeId, dataSource, position);
      myDataSource.delegate = this;
      return this.navigationController.push(myDataSource);
    };

    return Talkshow;

  })();

  window.Talkshow = Talkshow;

}).call(this);