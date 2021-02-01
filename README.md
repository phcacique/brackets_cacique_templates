# Cacique Templates
Brackets extension that auto complete HTML, CSS and JS templates or insert them by a dialog. The templates were made based on my personal use. Feel free to fork and edit it!

## Usage
Select `Edit > Cacique Templates`. A dialog will appears with a select componet that contains a list of available templates. Choose one and it will be placed on the current document at the current cursor position. You can also access the dialog with the shortcut `alt + C`

### Inline shortcuts
You can also use inline shortcuts. Type the shortcut and then type `alt + C`. The shortcuts are presented on the selects options at the dialog and on a list below:

**HTML**
* Basic HTML: `html`
* Link to CSS: `html_css`
* Basic html with centered canvas: `html_canvas`

**JS**
* FOR: `js_fori`
  * FOR with end value: `js_fori_[end value]`

### Custom Snippets
Create your own snippets by adding a file named *cacique.txt* to the target file directory. In this document, create your snippets using the following format:
> *name*::*content*

Load the snippets using the icon on the right menu or the shortcut `Alt+C` and then click on Load File.
To use it, type c_*name* and use the shortcut `Alt+C`
