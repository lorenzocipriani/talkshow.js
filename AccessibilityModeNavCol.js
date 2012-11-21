// Generated by CoffeeScript 1.3.3
(function() {
  var AccessibilityModeNavCol;

  AccessibilityModeNavCol = (function() {

    function AccessibilityModeNavCol() {}

    AccessibilityModeNavCol.prototype.gridSize = {
      columns: 4,
      rows: 3
    };

    AccessibilityModeNavCol.prototype.initializeDataSource = function(options, cb) {
      var _this = this;
      return new DataSource({
        delegate: this,
        grid: options.grid,
        level: 1,
        nodeId: "navigation_column",
        storage: options.storage
      }, function(err, navDataSource) {
        _this.navDataSource = navDataSource;
        if (err != null) {
          return cb(err);
        }
        options.level = 1;
        return _this.makeDataSource(options, cb);
      });
    };

    AccessibilityModeNavCol.prototype.enteredCell = function(dataSource, position, level, nodeId, cellData, cb) {
      var _ref;
      if (dataSource === this.navDataSource) {
        console.log("NavCol: " + position.y);
        if (position.y === 0) {
          this.delegate.popToRoot(cb);
        }
        if (position.y === 1) {
          return this.delegate.pop(cb);
        }
      } else {
        dataSource = dataSource.splitDataSource;
        return (_ref = this.delegate) != null ? _ref.enteredCell(dataSource, position, level, nodeId, cellData, cb) : void 0;
      }
    };

    AccessibilityModeNavCol.prototype.makeDataSource = function(options, cb) {
      var _this = this;
      this.delegate = options.delegate;
      options.delegate = this;
      if (options.parent != null) {
        options.parent = options.parent.ds2;
      }
      return new DataSource(options, function(err, myDataSource) {
        var splitDataSource;
        if (err != null) {
          return cb(err);
        }
        splitDataSource = new SplitDataSource(_this.navDataSource, myDataSource, 1);
        myDataSource.splitDataSource = splitDataSource;
        return cb(null, splitDataSource);
      });
    };

    return AccessibilityModeNavCol;

  })();

  window.AccessibilityModeNavCol = AccessibilityModeNavCol;

}).call(this);