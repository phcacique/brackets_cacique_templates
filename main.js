define(function (require, exports, module) {
    "use strict";
    //MODULES
    var CommandManager = brackets.getModule("command/CommandManager"),
        Menus = brackets.getModule("command/Menus"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        Dialogs = brackets.getModule("widgets/Dialogs"),
        DefaultDialogs = brackets.getModule("widgets/DefaultDialogs"),
        AppInit = brackets.getModule("utils/AppInit");
    
    //REQUIRED
    var modal = require('text!html/modal.html');
    var elements = [{name:"basic_html", element: require('text!html/basic_page.html')},
                    {name:"basic_canvas", element: require('text!html/basic_canvas.html')},
                    {name:"link_css", element: require('text!html/link_css.html')},
                   ];
    
    var currentDoc = DocumentManager.getCurrentDocument();
    var editor = EditorManager.getCurrentFullEditor();
    var myDialog;
    
    
    //CONST
    const COMMAND_ID = "cacique.caciquetemplate",
          COMMAND_NAME = "Cacique Templates";

    function init() {
        showDialog(modal);
        document.getElementById('model').onchange = function () {
            var option = document.getElementById('model').value;
            for(var i=0; i<elements.length; i++){
                if(elements[i].name == option) {
                    insertText(elements[i].element);
                    break;   
                }
            } 
            myDialog.close();
        }
    }
    
    //INSERT TEXT ON PAGE
    function insertText(text) {
        var currentDoc = DocumentManager.getCurrentDocument();
        var editor = EditorManager.getCurrentFullEditor();
        var pos = editor.getCursorPos();
        currentDoc.replaceRange(text, pos);
    }

    //CUSTOM DEVELOPMENT LOG
    function log(text) {
        console.log("[" + COMMAND_NAME + "]: " + text);
    }

    //SHOW CUSTOM HTML DIALOG
    function showDialog(dialog) {
        myDialog = Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_INFO, COMMAND_NAME, dialog, [
            {
                className: Dialogs.DIALOG_BTN_CLASS_NORMAL, 
                id: "cancel",
                text: "Cancel"
                }
            ]);
    }
    
    //ON LOAD APP
    AppInit.appReady(function () {
        CommandManager.register(COMMAND_NAME, COMMAND_ID, init);
        var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
        menu.addMenuItem(COMMAND_ID, "Ctrl-Alt-C");
    });
});