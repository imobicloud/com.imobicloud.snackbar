# Titanium UI - Snackbar

https://material.io/guidelines/components/snackbars-toasts.html

====

View
	
	<Widget id="snackbar" class="snackbar" src="com.imobicloud.snackbar"/>
    
Styles

	".snackbar": { DEBUG: false }
	".snackbar[if=Alloy.Globals.UI.IsIPhoneX]": { paddingBottom: 22 }
    
Controller

	$.snackbar.show({
		action: 'Undo',
		length: $.snackbar.SNACKBAR_LENGTH_SHORT,
		lines: $.snackbar.SNACKBAR_LINES_1,
		message: 'Step removed!',
		onActionClicked: function() {
			Ti.API.error("TODO: onActionClicked");
		}
	});
	
Changes log:
- 11/11/2017:
	First commit
	
