// Generated by CoffeeScript 1.3.3
(function() {
  var Settings;

  Settings = (function() {

    function Settings() {
      var _this = this;
      $(".showInEditMode").hide();
      $("#editSwitch").change(function() {
        if ($(this).attr("checked")) {
          return $(".showInEditMode").show();
        } else {
          return $(".showInEditMode").hide();
        }
      });
      this.loadColors();
      if ($("#colors li").length === 0) {
        this.addDefaultColors();
        this.saveColors();
      }
      $("#colors").append($("<li>").addClass("addButton").html("+").click(function() {
        $("<li>").css("background-color", "rgb(0,0,0)").insertBefore("#colors .addButton");
        return _this.saveColors();
      }));
    }

    Settings.prototype.CSSColorFromArray = function(c) {
      return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
    };

    Settings.prototype.addDefaultColors = function() {
      var c, colors, _i, _len, _results;
      console.log("adding default colors");
      colors = [[255, 255, 127], [127, 127, 255], [255, 40, 40]];
      _results = [];
      for (_i = 0, _len = colors.length; _i < _len; _i++) {
        c = colors[_i];
        _results.push($("#colors").append($("<li>").css("background-color", CSSColorFromArray(c))));
      }
      return _results;
    };

    Settings.prototype.saveColors = function() {
      var colorJSON, element, s;
      colorJSON = "[" + ((function() {
        var _i, _len, _ref, _results;
        _ref = $("#colors li").not(".addButton");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          s = $(element).css("background-color");
          s = s.replace("rgb(", "[");
          s = s.replace("rgba(", "[");
          _results.push(s = s.replace(")", "]"));
        }
        return _results;
      })()).join(",") + "]";
      return localStorage.setItem("colors", colorJSON);
    };

    Settings.prototype.loadColors = function() {
      var c, colorJSON, colors, _i, _len, _results;
      colorJSON = localStorage.getItem("colors");
      if (colorJSON != null) {
        colors = JSON.parse(colorJSON);
        _results = [];
        for (_i = 0, _len = colors.length; _i < _len; _i++) {
          c = colors[_i];
          _results.push($("#colors").append($("<li>").css("background-color", CSSColorFromArray(c))));
        }
        return _results;
      }
    };

    return Settings;

  })();

  window.Settings = Settings;

}).call(this);
