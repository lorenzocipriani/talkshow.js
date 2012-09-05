// Generated by CoffeeScript 1.3.3
(function() {
  var ModalDialog,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ModalDialog = (function() {

    function ModalDialog(selector, callback) {
      var self;
      this.callback = callback;
      this.handleKey = __bind(this.handleKey, this);

      KeyboardInput.get().pushModalKeyHandler(this);
      this.dialogElement = $(selector);
      this.dialogElement.show();
      self = this;
      this.dialogElement.find('.choice').unbind('click').click(function() {
        return self.handleButton($(this).attr("type"));
      });
    }

    ModalDialog.prototype.handleButton = function(name) {
      if (this.callback) {
        this.callback(name);
      }
      return this.close();
    };

    ModalDialog.prototype.close = function() {
      this.dialogElement.hide();
      KeyboardInput.get().popModalKeyHandler();
      if (this.callback) {
        return this.callback(null);
      }
    };

    ModalDialog.prototype.handleKey = function(e) {
      switch (String.fromCharCode(e.keyCode)) {
        case 'J':
          return this.leftKeyPressed();
        case 'N':
          return this.rightKeyPressed();
        case 'M':
          return this.middleKeyPressed();
      }
    };

    ModalDialog.prototype.leftKeyPressed = function() {};

    ModalDialog.prototype.rightKeyPressed = function() {
      return this.close();
    };

    ModalDialog.prototype.middleKeyPressed = function() {};

    return ModalDialog;

  })();

  window.ModalDialog = ModalDialog;

}).call(this);
