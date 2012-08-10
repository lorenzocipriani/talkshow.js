// Generated by CoffeeScript 1.3.3
(function() {
  var root, _BlindKeyboardInput,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.KeyboardInput = (function() {
    var _instance;

    function KeyboardInput() {}

    _instance = void 0;

    KeyboardInput.get = function(args) {
      return _instance != null ? _instance : _instance = new _BlindKeyboardInput(args);
    };

    return KeyboardInput;

  })();

  _BlindKeyboardInput = (function() {

    function _BlindKeyboardInput(delegate) {
      this.handleKey = __bind(this.handleKey, this);

      var _this = this;
      this.delegate = delegate;
      this.rowCount = $("#grid tr").length;
      this.colCount = $("#grid tr:eq(1) td").length;
      this.modalKeyHandlers = [];
      $(window).keyup(function(e) {
        var _ref;
        if (_this.modalKeyHandlers.length !== 0) {
          return (_ref = _(_this.modalKeyHandlers).last()) != null ? _ref.handleKey(e) : void 0;
        } else {
          return _this.handleKey(e);
        }
      });
      this.setFocusPosition(0, 0);
    }

    _BlindKeyboardInput.prototype.pushModalKeyHandler = function(kh) {
      return this.modalKeyHandlers.push(kh);
    };

    _BlindKeyboardInput.prototype.popModalKeyHandler = function() {
      return this.modalKeyHandlers.pop();
    };

    _BlindKeyboardInput.prototype.isInMenu = function(e) {
      return this.focusPosition().left === 0;
    };

    _BlindKeyboardInput.prototype.playNavigationSound = function() {
      return $(".keyboardFocus audio").each(function() {
        return this.play();
      });
    };

    _BlindKeyboardInput.prototype.handleKey = function(e) {
      switch (String.fromCharCode(e.keyCode)) {
        case 'J':
          if (this.isInMenu()) {
            this.setFocusPosition(0, 0);
            this.playNavigationSound();
          } else {
            this.enter();
          }
          break;
        case 'N':
          if (this.isInMenu()) {
            this.setFocusPosition(0, 1);
            this.playNavigationSound();
          } else {
            this.pop();
          }
          break;
        case 'M':
          if (this.isInMenu()) {
            this.setFocusPosition(1, 0);
            this.playNavigationSound();
            this.startTimer();
          } else {
            this.setFocusPosition(0, 0);
            this.stopTimer();
          }
          break;
        default:
          switch (e.keyCode) {
            case 37:
              this.splitStep(-1);
              break;
            case 39:
              this.splitStep(1);
              break;
            case 38:
              this.move(0, -1);
              break;
            case 40:
              this.move(0, 1);
              break;
            case 32:
              break;
            default:
              return true;
          }
      }
      return false;
    };

    _BlindKeyboardInput.prototype.startTimer = function() {
      var timerCallback,
        _this = this;
      timerCallback = function() {
        _this.timeoutID = window.setTimeout(timerCallback, 1000);
        _this.splitStep(1);
        return _this.playNavigationSound();
      };
      return this.timeoutID = window.setTimeout(timerCallback, 1000);
    };

    _BlindKeyboardInput.prototype.stopTimer = function() {
      return window.clearTimeout(this.timeoutID);
    };

    _BlindKeyboardInput.prototype.enter = function() {
      var focusPos, _ref;
      this.stopTimer();
      focusPos = this.focusPosition();
      if (focusPos != null) {
        if ((_ref = this.delegate) != null) {
          _ref.enterCell(focusPos.left, focusPos.top);
        }
        this.setFocusPosition(1, 0);
        this.playNavigationSound();
        return this.startTimer();
      }
    };

    _BlindKeyboardInput.prototype.pop = function() {
      var _ref;
      this.stopTimer();
      if ((_ref = this.delegate) != null) {
        _ref.pop();
      }
      this.setFocusPosition(1, 0);
      this.playNavigationSound();
      return this.startTimer();
    };

    _BlindKeyboardInput.prototype.focusPosition = function() {
      var cell, row, x, y;
      if ($(".keyboardFocus").length === 1) {
        cell = $(".keyboardFocus");
        row = cell.closest("tr");
        x = cell.index();
        y = row.index();
        return {
          left: x,
          top: y
        };
      } else {
        return {
          left: 0,
          top: 0
        };
      }
    };

    _BlindKeyboardInput.prototype.setFocusPosition = function(x, y) {
      $("td").removeClass("keyboardFocus");
      return $("#grid tr").eq(y).find("td").eq(x).addClass("keyboardFocus");
    };

    _BlindKeyboardInput.prototype.move = function(dx, dy) {
      var cell, cells, focusPos, row, rows, x, y;
      if ($(".keyboardFocus").length === 0) {
        rows = $("#grid tr");
        row = rows.eq(Math.floor(rows.length / 2));
        cells = row.find("td");
        cell = cells.eq(Math.floor(cells.length / 2));
        return cell.addClass("keyboardFocus");
      } else {
        focusPos = this.focusPosition();
        x = focusPos.left;
        y = focusPos.top;
        x += dx;
        y += dy;
        if (x >= this.colCount) {
          x = 0;
        }
        if (x < 0) {
          x = this.colCount - 1;
        }
        if (y >= this.rowCount) {
          y = 0;
        }
        if (y < 0) {
          y = this.rowCount - 1;
        }
        return this.setFocusPosition(x, y);
      }
    };

    _BlindKeyboardInput.prototype.step = function(d, sx, sy, ex, ey) {
      var cell, cells, focusPos, row, rows, x, y;
      if (sx == null) {
        sx = 0;
      }
      if (sy == null) {
        sy = 0;
      }
      if (ex == null) {
        ex = this.colCount - 1;
      }
      if (ey == null) {
        ey = this.rowCount - 1;
      }
      if ($(".keyboardFocus").length === 0) {
        rows = $("#grid tr");
        row = rows.eq(sy);
        cells = row.find("td");
        cell = cells.eq(sx);
        return cell.addClass("keyboardFocus");
      } else {
        focusPos = this.focusPosition();
        x = focusPos.left;
        y = focusPos.top;
        x += d;
        if (x < sx) {
          x = ex;
          y--;
        }
        if (x > ex) {
          x = sx;
          y++;
        }
        if (y < sy) {
          y = ey;
          x = ex;
        }
        if (y > ey) {
          x = sx;
          y = sy;
        }
        return this.setFocusPosition(x, y);
      }
    };

    _BlindKeyboardInput.prototype.splitStep = function(d) {
      if (!this.isInMenu()) {
        return this.step(d, 1, 0, this.colCount - 1, this.rowCount - 1);
      } else {
        return this.step(d, 0, 0, 0, this.rowCount - 1);
      }
    };

    return _BlindKeyboardInput;

  })();

}).call(this);
