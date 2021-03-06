// Generated by CoffeeScript 1.3.3
(function() {
  var CellFactory;

  CellFactory = (function() {

    function CellFactory(delegate, options) {
      this.delegate = delegate;
      this.options = options;
    }

    CellFactory.prototype.makeLabel = function(text) {
      var self;
      self = this;
      return $("<div>").html(text).addClass('label').click(function() {
        var label, parent;
        if (!isEditMode()) {
          return true;
        }
        label = $(this);
        parent = label.parent();
        KeyboardInput.get().pushModalKeyHandler(null);
        $("<input>").val(label.html()).addClass("label").click(function() {
          return false;
        }).keypress(function(e) {
          if (e.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
            $(this).blur();
            return false;
          }
        }).blur(function() {
          var newText, _ref,
            _this = this;
          newText = $(this).val();
          return (_ref = self.delegate) != null ? _ref.labelTextChanged(parent, newText, function(err) {
            if (!(err != null)) {
              $(_this).remove();
              label.html(newText);
              label.show();
              return KeyboardInput.get().popModalKeyHandler();
            } else {
              return window.alert("Unable to save: " + err);
            }
          }) : void 0;
        }).insertAfter(label);
        parent.find('input').focus();
        label.hide();
        return false;
      });
    };

    CellFactory.prototype.setContent = function(cell, aspect, dataUri) {
      var audio, icon;
      if (aspect === 'backgroundImage') {
        aspect = 'background';
      }
      icon = cell.children('.icon');
      audio = cell.find('audio');
      cell.find(".iconbar ." + aspect + ".iconbarItem")[dataUri ? 'show' : 'hide']();
      if (aspect === "navigationSound" && dataUri) {
        cell.removeClass("showInEditMode");
      }
      switch (aspect) {
        case 'background':
          return cell.css('background-image', dataUri ? "url(" + dataUri + ")" : 'none');
        case 'icon':
          if (dataUri) {
            icon.attr('src', dataUri);
            return icon.show();
          } else {
            icon.attr('src', '');
            return icon.hide();
          }
          break;
        case 'navigationSound':
          return audio.attr('src', dataUri || '');
      }
    };

    CellFactory.prototype.handleDrop = function(cell, dataUri, mimeType) {
      var dialog, majorType,
        _this = this;
      majorType = mimeType.split("/")[0];
      console.log("handleDrop", majorType);
      switch (majorType) {
        case 'audio':
          return dialog = new ModalDialog(".soundDropped .dialog", function(aspect) {
            var _ref;
            if (aspect) {
              _this.setContent(cell, aspect, dataUri);
              return (_ref = _this.delegate) != null ? _ref.contentChanged(cell, aspect, dataUri, function(err) {
                if (!(err != null)) {
                  if (aspect === 'navigationSound') {
                    return cell.find('audio')[0].play();
                  }
                } else {
                  return window.alert("contentChanged failed: " + err);
                }
              }) : void 0;
            }
          });
        case 'image':
          return dialog = new ModalDialog('.imageDropped .dialog', function(aspect) {
            var _ref;
            if (aspect) {
              _this.setContent(cell, aspect, dataUri);
              return (_ref = _this.delegate) != null ? _ref.contentChanged(cell, aspect, dataUri, function(err) {
                if (err != null) {
                  return window.alert("contentChanged failed: " + err);
                }
              }) : void 0;
            }
          });
      }
    };

    CellFactory.prototype.makeIconBar = function(data) {
      var iconBar, inEditMode, makeIconBarItem, self;
      iconBar = $('<div>').addClass('iconbar');
      inEditMode = $("<div>").addClass("showInEditMode");
      iconBar.append(inEditMode);
      self = this;
      makeIconBarItem = function(aspect, imageURL) {
        return $('<img>').hide().addClass(aspect).addClass('iconbarItem').attr('src', imageURL).click(function() {
          var cell, dialog,
            _this = this;
          if (!isEditMode()) {
            return true;
          }
          cell = iconBar.closest("td");
          dialog = new ModalDialog(".delete ." + aspect + " .dialog", function(name) {
            var _ref;
            if (name === 'delete') {
              return (_ref = self.delegate) != null ? _ref.contentChanged(cell, aspect, null, function(err) {
                if (!(err != null)) {
                  cell = iconBar.closest('td');
                  return self.setContent(cell, aspect, null);
                } else {
                  return alert("contentChanged failed: " + err);
                }
              }) : void 0;
            }
          });
          return false;
        });
      };
      inEditMode.append(makeIconBarItem('icon', 'icons/icon.png'));
      inEditMode.append(makeIconBarItem('background', 'icons/background.png'));
      iconBar.append(makeIconBarItem('photo', 'icons/86-camera@2x.png'));
      iconBar.append(makeIconBarItem('navigationSound', 'icons/08-chat@2x.png'));
      return iconBar.append(makeIconBarItem('sound', 'icons/65-note@2x.png'));
    };

    CellFactory.prototype.makeCell = function(data, color) {
      var aspect, audio, cell, image, label, self, _i, _len, _ref, _ref1, _ref2;
      label = (_ref = data.label) != null ? _ref : 'n/a';
      image = $('<img>').addClass("icon");
      audio = $('<audio>');
      self = this;
      cell = $('<td>').append(this.makeIconBar(data)).append(audio).append(image).append(this.makeLabel(label)).css('background-color', color);
      if ((_ref1 = this.options) != null ? _ref1.userIsBlind : void 0) {
        cell.addClass("showInEditMode");
      }
      cell.bind('dragenter', function(evt) {
        $(this).addClass('dragTarget');
        evt.stopPropagation();
        evt.preventDefault();
        return true;
      });
      cell.bind('dragleave', function(evt) {
        $(this).removeClass('dragTarget');
        evt.stopPropagation();
        evt.preventDefault();
        return true;
      });
      cell.bind('dragover', function(evt) {
        evt.stopPropagation();
        return evt.preventDefault();
      });
      cell.bind('drop', function(evt) {
        var files;
        $(this).removeClass('dragTarget');
        cell = $(this);
        evt.stopPropagation();
        evt.preventDefault();
        files = evt.originalEvent.dataTransfer.files;
        return _(files).each(function(file) {
          var reader;
          console.log("type: " + file.type);
          console.log("path: " + file.mozFullPath);
          reader = new FileReader();
          reader.onloadend = function() {
            var dataUri;
            dataUri = reader.result;
            return self.handleDrop(cell, dataUri, file.type);
          };
          return reader.readAsDataURL(file);
        });
      });
      _ref2 = ['background', 'icon', 'sound', 'photo', 'navigationSound'];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        aspect = _ref2[_i];
        if (aspect in data) {
          this.setContent(cell, aspect, data[aspect]);
        }
      }
      return cell;
    };

    return CellFactory;

  })();

  window.CellFactory = CellFactory;

}).call(this);
