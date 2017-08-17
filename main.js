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
        
        currentDoc = DocumentManager.getCurrentDocument();
        editor = EditorManager.getCurrentFullEditor();
        
        
        var cursorPos = editor.getCursorPos();

        var text = currentDoc.getLine(cursorPos.line).trim();

        if(text==null || text==""){
            showCaciqueDialog();
        } else {
            var ar = text.split("_");
            if(ar.length == 1){
                if(ar[0]=="html") insertByName("basic_html", true);
                else showCaciqueDialog();
            }else if(ar.length == 2){
                if(ar[0]=="js" && ar[1]=="fori") insertText("for(var i=0; i<10; i++){\n\n}", text.length);
                else if(ar[0]=="html" && ar[1]=="css") insertByName("link_css", true);
                else if(ar[0]=="html" && ar[1]=="canvas") insertByName("basic_canvas", true);
                else showCaciqueDialog();
            } else if(ar.length == 3){
                if(ar[0]=="js" && ar[1]=="fori") insertText("for(var i=0; i<"+ar[2]+"; i++){\n\n}", text.length);
                else showCaciqueDialog();
            } else {
                showCaciqueDialog();
            }
        } 
    }
    
    function showCaciqueDialog(){
        showDialog(modal);
        document.getElementById('html_select').onchange = function(){replace('html_select')};
        document.getElementById('js_select').onchange = function(){
            switch(document.getElementById('js_select').value){
                case "fori":
                    insertText("for(var i=0; i<10; i++){\n\n}");
                    break;
            }
            myDialog.close();
        };
    }
    
    function insertByName(name, offset){
        var off = (offset==null)?false:true;
        for(var i=0; i<elements.length; i++){
            if(elements[i].name == name) {
                if(offset==false) insertText(elements[i].element);
                else insertText(elements[i].element, name.length);
                break;   
            }
        } 
    }
    
    function replace(selectName){
        var option = document.getElementById(selectName).value;
        insertByName(option);
        myDialog.close();
    }
    
    //INSERT TEXT ON PAGE
    function insertText(text, offset) {
        var off = (offset==null)?0:offset;
        currentDoc = DocumentManager.getCurrentDocument();
        editor = EditorManager.getCurrentFullEditor();
        var pos = editor.getCursorPos();
        var pos2 = {line: pos.line, ch: pos.ch - off};
        currentDoc.replaceRange(text, pos, pos2);
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
        menu.addMenuItem(COMMAND_ID, "Alt-C");
    });
});