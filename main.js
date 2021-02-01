define(function (require, exports, module) {
    "use strict";
    //MODULES
    var CommandManager = brackets.getModule("command/CommandManager"),
        Menus = brackets.getModule("command/Menus"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        Dialogs = brackets.getModule("widgets/Dialogs"),
        DefaultDialogs = brackets.getModule("widgets/DefaultDialogs"),
        AppInit = brackets.getModule("utils/AppInit"),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        FileSystem = brackets.getModule('filesystem/FileSystem'),
        FileUtils = brackets.getModule('file/FileUtils');

    //REQUIRED
    var modal = require('text!html/modal.html');
    var elements = [{
            name: "basic_html",
            element: require('text!html/basic_page.html')
        },
        {
            name: "basic_canvas",
            element: require('text!html/basic_canvas.html')
        },
        {
            name: "link_css",
            element: require('text!html/link_css.html')
        },
        {
            name: "link_js",
            element: require('text!html/link_js.html')
        },
                   ];

    var currentDoc = DocumentManager.getCurrentDocument();
    var editor = EditorManager.getCurrentFullEditor();
    var myDialog;

    ExtensionUtils.loadStyleSheet(module, 'styles/styles.css');
    var snippets = [];

    //CONST
    const COMMAND_ID = "cacique.caciquetemplate",
        COMMAND_NAME = "Cacique Templates";

    function init() {

        loadFileSameDir("cacique.txt", getSnippets);

        currentDoc = DocumentManager.getCurrentDocument();
        editor = EditorManager.getCurrentFullEditor();

        var cursorPos = editor.getCursorPos();

        var text = currentDoc.getLine(cursorPos.line).trim();

        if (text == null || text == "") {
            showCaciqueDialog();
        } if (text == "html"){
            insertByName("basic_html", true);
        } else {
            var ar = text.split("_");
            
            var temp = ar[0].split(" ");
            var head = "";
            if (ar.length == 2 && temp.length>0) {
                for(var i=0; i<temp.length-1; i++){
                    head += temp[i]+" ";
                }
                ar[0] = temp[temp.length - 1];
            }
            
            temp = ar[1].split(" ");
            var tail = "";
            if (ar.length == 2 && temp.length>0) {
                ar[1] = temp[0];
                for(var i=1; i<temp.length; i++){
                    tail += temp[i]+" ";
                }
            }
            if (!head.replace(/\s/g, '').length) { head = ""};
            if (!tail.replace(/\s/g, '').length) { tail = ""};
            
            if (ar.length == 1) {
                if (ar[0] == "html") {insertByName("basic_html", true);}
                else {showCaciqueDialog();}
            } else if (ar.length == 2) {
                if (ar[0] == "js" && ar[1] == "fori") insertText("for(var i=0; i<10; i++){\n\n}", text.length);
                else if (ar[0] == "html" && ar[1] == "css") {insertByName("link_css", true)}
                else if (ar[0] == "html" && ar[1] == "js") {insertByName("link_js", true)}
                else if (ar[0] == "html" && ar[1] == "canvas") {insertByName("basic_canvas", true);}
                else {
                    var found = false;
                    var txt = "";
                    if (ar[0] == "c") {
                        for (var i = 0; i < snippets.length; i++) {
                            if (snippets[i].name == ar[1]) {
                                txt = head + snippets[i].content + tail;
                                found = true;
                            }
                        }
                    }
                    if (!found) showCaciqueDialog();
                    else insertText(txt, text.length);
                }
            } else if (ar.length == 3) {
                if (ar[0] == "js" && ar[1] == "fori") insertText("for(var i=0; i<" + ar[2] + "; i++){\n\n}", text.length);
                else showCaciqueDialog();
            } else {
                showCaciqueDialog();
            }
        }
    }



    function showCaciqueDialog() {
        showDialog(modal);
        document.getElementById('html_select').onchange = function () {
            replace('html_select')
        };
        document.getElementById('teste').onclick = function () {
            teste();
        };
        document.getElementById('js_select').onchange = function () {
            switch (document.getElementById('js_select').value) {
                case "fori":
                    insertText("for(var i=0; i<10; i++){\n\n}");
                    break;
            }
            myDialog.close();
        };
    }

    function insertByName(name, offset) {
        var off = (offset == null) ? false : true;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].name == name) {
                if (offset == false) insertText(elements[i].element);
                else insertText(elements[i].element, name.length);
                break;
            }
        }
    }

    function replace(selectName) {
        var option = document.getElementById(selectName).value;
        insertByName(option);
        myDialog.close();
    }

    //INSERT TEXT ON PAGE
    function insertText(text, offset = 0) {
        var off = offset;
        currentDoc = DocumentManager.getCurrentDocument();
        editor = EditorManager.getCurrentFullEditor();
        var pos = editor.getCursorPos();
        var pos2 = {
            line: pos.line,
            ch: pos.ch - off
        };
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

    function teste() {
        loadFileSameDir("cacique.txt", getSnippets);
        myDialog.close();
        Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_INFO, "Success", "Snippets loaded!");
        
    }

    function getSnippets(text) {
        snippets = [];
        var lines = text.split('\n');
        if (lines.length > 0) {
            for (var i = 0; i < lines.length; i++) {
                var s = lines[i].split('::');
                if (s.length == 2) {
                    var snippet = {
                        name: s[0],
                        content: s[1]
                    };
                    snippets.push(snippet);
                } else {
                    if (snippets.length > 0) {
                        snippets[snippets.length - 1].content += "\n"+lines[i];
                    }
                }
            }
        }
    }

    function loadFileSameDir(fileName, sFunction = function (t) {}, eFunction = function (e) {}) {
        var d = DocumentManager.getCurrentDocument();
        var file = FileSystem.getFileForPath(d.file.parentPath + fileName);
        var promise = FileUtils.readAsText(file); // completes asynchronously
        promise.done(function (text) {
                sFunction(text);
            })
            .fail(function (errorCode) {
                eFunction(errorCode);
            });
    }

    // Add Toolbar Button
    $(document.createElement('a'))
        .attr('id', 'cacique-icon')
        .attr('href', '#')
        .attr('title', 'Cacique')
        .on('click', function () {
            showCaciqueDialog();
        })
        .appendTo($('#main-toolbar .buttons'));

    //ON LOAD APP
    AppInit.appReady(function () {
        CommandManager.register(COMMAND_NAME, COMMAND_ID, init);
        var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
        menu.addMenuItem(COMMAND_ID, "Alt-C");
    });
});