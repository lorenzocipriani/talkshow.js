// Generated by CoffeeScript 1.3.3
(function() {
  var AudioPlayer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AudioPlayer = (function(_super) {

    __extends(AudioPlayer, _super);

    function AudioPlayer(dataURI) {
      var self,
        _this = this;
      AudioPlayer.__super__.constructor.apply(this, arguments);
      this.audio = $(".audioPlayer audio")[0];
      $(".audioPlayer .dialog").show();
      $(this.audio).attr("src", dataURI);
      this.audio.play();
      $(this.audio).bind("ended", function() {
        return _this.close();
      });
      self = this;
      $(".audioPlayer .choice").click(function() {
        switch ($(this).attr("type")) {
          case "pause":
            return self.leftKeyPressed();
          case "back":
            return self.close();
        }
      });
    }

    AudioPlayer.prototype.leftKeyPressed = function() {
      return this.audio.pause();
    };

    AudioPlayer.prototype.close = function() {
      AudioPlayer.__super__.close.apply(this, arguments);
      this.audio.pause();
      return $(".audioPlayer .dialog").hide();
    };

    return AudioPlayer;

  })(ModalDialog);

  window.AudioPlayer = AudioPlayer;

}).call(this);
