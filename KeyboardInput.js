// Generated by CoffeeScript 1.3.3
(function() {
  var KeyboardInput,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  KeyboardInput = (function() {

    function KeyboardInput(delegate) {
      this.keyHandler = __bind(this.keyHandler, this);

      var _this = this;
      this.delegate = delegate;
      this.rowCount = $("#grid tr").length;
      this.colCount = $("#grid tr:eq(1) td").length;
      $(window).keyup(function(e) {
        return _this.keyHandler(e);
      });
      this.setFocusPosition(0, 0);
    }

    KeyboardInput.prototype.isInMenu = function(e) {
      return this.focusPosition().left === 0;
    };

    KeyboardInput.prototype.keyHandler = function(e) {
      var timerCallback,
        _this = this;
      switch (String.fromCharCode(e.keyCode)) {
        case 'M':
          if (this.isInMenu()) {
            this.setFocusPosition(1, 0);
            timerCallback = function() {
              _this.timeoutID = window.setTimeout(timerCallback, 1000);
              return _this.splitStep(1);
            };
            this.timeoutID = window.setTimeout(timerCallback, 1000);
          } else {
            this.setFocusPosition(0, 0);
            window.clearTimeout(this.timeoutID);
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
            case 13:
              this.enter();
              break;
            case 32:
              break;
            default:
              return true;
          }
      }
      return false;
    };

    KeyboardInput.prototype.enter = function() {
      var focusPos;
      focusPos = this.focusPosition();
      if (focusPos != null) {
        return this.delegate.enterCell(focusPos.left, focusPos.top);
      }
    };

    KeyboardInput.prototype.focusPosition = function() {
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
        return null;
      }
    };

    KeyboardInput.prototype.setFocusPosition = function(x, y) {
      $("td").removeClass("keyboardFocus");
      return $("#grid tr").eq(y).find("td").eq(x).addClass("keyboardFocus");
    };

    KeyboardInput.prototype.move = function(dx, dy) {
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

    KeyboardInput.prototype.step = function(d, sx, sy, ex, ey) {
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

    KeyboardInput.prototype.splitStep = function(d) {
      if (!this.isInMenu()) {
        return this.step(d, 1, 0, this.colCount - 1, this.rowCount - 1);
      } else {
        return this.step(d, 0, 0, 0, this.rowCount - 1);
      }
    };

    return KeyboardInput;

  })();

  window.KeyboardInput = KeyboardInput;

}).call(this);
