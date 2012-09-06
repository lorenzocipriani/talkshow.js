class CellFactory 
    constructor: (@delegate) ->
    
    makeLabel: (text) ->
        self = this
        
        return $("<div>").html(text).addClass('label').click ()->
            label = $ this
            parent = label.parent()
            KeyboardInput.get().pushModalKeyHandler null
            $("<input>").val(label.html()).addClass("label")
            .click( ()-> 
                return false
            ).keypress( (e)->
                if e.keyCode is 13
                    e.preventDefault()
                    e.stopPropagation()
                    $(this).blur()
                    return false
            ).blur( ()->
                newText = $(this).val()
                self.delegate?.labelTextChanged parent, newText, (err) =>
                    if not err?
                        $(this).remove()
                        label.html(newText)
                        label.show()
                        KeyboardInput.get().popModalKeyHandler()
                    else
                        window.alert "Unable to save: #{err}"
            )
            .insertAfter(label)
            
            parent.find('input').focus()
            label.hide()
            return false
    
    setContent: (cell, aspect, dataUri) ->
        aspect = 'background' if aspect is 'backgroundImage'
        
        icon = cell.children '.icon'
        audio = cell.find 'audio'
        
        cell.find(".iconbar>.#{aspect}")[if dataUri then 'show' else 'hide']()
        
        switch aspect
            when 'background'
                cell.css 'background-image', if dataUri then "url(#{dataUri})" else 'none'
    
            when 'icon'
                if dataUri
                    icon.attr 'src', dataUri
                    icon.show()
                else
                    icon.attr 'src', ''
                    icon.hide()

            when 'navigationSound'
                audio.attr 'src', dataUri or ''
                
    handleDrop: (cell, dataUri, mimeType) ->
        majorType = mimeType.split("/")[0]
        console.log "handleDrop", majorType
        
        switch majorType
            when 'audio'
                dialog = new ModalDialog ".soundDropped .dialog", (aspect) =>
                    if aspect
                        @setContent cell, aspect, dataUri
                        @delegate?.contentChanged cell, aspect, dataUri, (err) =>
                            if not err?
                                if aspect is 'navigationSound'
                                    cell.find('audio')[0].play()
                            else
                                window.alert "contentChanged failed: #{err}"
            
            when 'image'
                dialog = new ModalDialog '.imageDropped .dialog', (aspect) =>
                    if aspect
                        @setContent cell, aspect, dataUri
                        @delegate?.contentChanged cell, aspect, dataUri, (err) =>
                            if err?
                                window.alert "contentChanged failed: #{err}"
    
    makeIconBar: (data) ->
        iconBar = $('<div>').addClass 'iconbar'
        self = this
        
        makeIconBarItem = (aspect, imageURL) ->
            $('<img>')
                .hide()
                .addClass(aspect)
                .attr('src', imageURL)
                .click ->
                    cell = iconBar.closest "td"
                    dialog = new ModalDialog ".delete .#{aspect} .dialog", (name) =>
                        if name is 'delete'
                            self.delegate?.contentChanged cell, aspect, null, (err) =>
                                if not err?
                                    cell = iconBar.closest 'td'
                                    self.setContent cell, aspect, null
                                else
                                    alert "contentChanged failed: #{err}"
                            
                    return false

        iconBar.append makeIconBarItem 'icon', 'icons/icon.png'
        iconBar.append makeIconBarItem 'background', 'icons/background.png'
        iconBar.append makeIconBarItem 'photo', 'icons/86-camera@2x.png'
        iconBar.append makeIconBarItem 'navigationSound', 'icons/08-chat@2x.png'
        iconBar.append makeIconBarItem 'sound', 'icons/65-note@2x.png'
        
    makeCell: (data, color) ->
        label = data.label ? 'n/a'
        image = $('<img>').addClass "icon"
        audio = $ '<audio>'
        self = this
        
        cell = $('<td>')
            .append(@makeIconBar data)
            .append(audio)
            .append(image)
            .append(@makeLabel label)
            .css('background-color', color)
                
        cell.bind 'dragenter', (evt) ->
            $(this).addClass('dragTarget')
            evt.stopPropagation()
            evt.preventDefault()
            return true
        
        cell.bind 'dragleave', (evt) ->
            $(this).removeClass('dragTarget')
            evt.stopPropagation()
            evt.preventDefault()
            return true
        
        cell.bind 'dragover', (evt) ->
            evt.stopPropagation()
            evt.preventDefault()
        
        cell.bind 'drop', (evt)->
            $(this).removeClass('dragTarget')
        
            cell = $(this)
            evt.stopPropagation()
            evt.preventDefault()
            files = evt.originalEvent.dataTransfer.files
            _(files).each (file) ->
                console.log "type: #{file.type}"
                console.log "path: #{file.mozFullPath}"
                reader = new FileReader()
                reader.onloadend = () ->
                    dataUri = reader.result
                    self.handleDrop cell, dataUri, file.type
                reader.readAsDataURL file

        for aspect in [
            'background'
            'icon'
            'sound'
            'photo'
            'navigationSound'
        ]
            if aspect of data
                @setContent cell, aspect, data[aspect]
        
        return cell

window.CellFactory = CellFactory