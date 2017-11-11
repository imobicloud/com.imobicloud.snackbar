// TODO: use this for Android
// // https://github.com/hyperloop-modules/ti.snackbar

/*
USAGE:

// xml
<Widget id="snackbar" class="snackbar" src="com.imobicloud.snackbar"/>

// tss
".snackbar": { DEBUG: false }
".snackbar[if=Alloy.Globals.UI.IsIPhoneX]": { paddingBottom: 22 }

// js
$.snackbar.show({
	action: 'Undo',
	length: $.snackbar.SNACKBAR_LENGTH_SHORT,
	lines: $.snackbar.SNACKBAR_LINES_1,
	message: 'Step removed!',
	onActionClicked: function() {
		Ti.API.error("TODO: onActionClicked");
	}
});
*/

// https://developer.android.com/reference/android/support/design/widget/Snackbar.html#LENGTH_INDEFINITE
var LENGTH_INDEFINITE = -2;
var LENGTH_LONG = 0;
var LENGTH_SHORT = -1;
exports.SNACKBAR_LENGTH_INDEFINITE = LENGTH_INDEFINITE;
exports.SNACKBAR_LENGTH_LONG = LENGTH_LONG;
exports.SNACKBAR_LENGTH_SHORT = LENGTH_SHORT;

var LINES_1 = 1;
var LINES_2 = 2;
var LINES_3 = 3;
exports.SNACKBAR_LINES_1 = LINES_1;
exports.SNACKBAR_LINES_2 = LINES_2;
exports.SNACKBAR_LINES_3 = LINES_3;

var args = $.args;
var duration;
var durations = {};
var lines = LINES_1;
var linesHeight = {};
var onActionClicked;
var timeout;

init($.args);
function init(args) {
	var exclude = ['id', 'children', 'DEBUG', 'paddingBottom'];
	$.container.applyProperties(_.omit(args, exclude));
	
	durations[LENGTH_LONG] = 5000; // 3500;
	durations[LENGTH_SHORT] = 2000;
	
	linesHeight[LINES_1] = 48;
	linesHeight[LINES_2] = 80;
	linesHeight[LINES_3] = 112;
	
	if (args.paddingBottom) {
		$.message.bottom = args.paddingBottom;
		$.button.bottom = args.paddingBottom;
		
		linesHeight[LINES_1] = 48 + args.paddingBottom;
		linesHeight[LINES_2] = 80 + args.paddingBottom;
		linesHeight[LINES_3] = 112 + args.paddingBottom;
	}
}

function containerReady(e) {
	args.DEBUG && Ti.API.info("com.imobicloud.snackbar: containerReady");
	this.removeEventListener('postlayout', containerReady);
	$.container.bottom = -1;
	$.container.opacity = 1;
}

function getDuration() {
	return durations[duration];
}

function getHeight() {
	return linesHeight[lines];
}

/*
params = {
	action: 'Undo',
	length: $.snackbar.SNACKBAR_LENGTH_SHORT,
	lines: $.snackbar.SNACKBAR_LINES_1,
	message: 'Step removed!',
	onActionClicked: function() {}
}
*/
exports.show = function(params) {
	args.DEBUG && Ti.API.info("com.imobicloud.snackbar: show " + JSON.stringify( params ));
	
	if (timeout) {
		clearTimeout(timeout);
		toggleSnackbar(false);
	}
	
	duration = params.length || LENGTH_LONG;
	
	lines = params.lines || LINES_1;
	var containerStyle = $.createStyle({ classes: 'container-' + params.lines });
	if (args.paddingBottom) {
		containerStyle.height += args.paddingBottom;
		containerStyle.bottom -= args.paddingBottom;
	}
	$.container.applyProperties(containerStyle);
	
	$.message.text = params.message;
	
	if (params.action) {
		onActionClicked = params.onActionClicked;
		$.message.right = 72;
		$.button.addEventListener('postlayout', buttonReady);
		$.button.applyProperties({ title: params.action.toUpperCase(), visible: true });
	} else {
		onActionClicked = null;
		$.message.right = 24;
		$.button.removeEventListener('postlayout', buttonReady);
		$.button.visible = false;
	}
	
	toggleSnackbar(true);
};

function buttonReady(e) {
	args.DEBUG && Ti.API.info("com.imobicloud.snackbar: buttonReady " + JSON.stringify( this.rect.width ));
	$.message.right = 24 + this.rect.width + 24;
}

function buttonClick(e) {
	onActionClicked && onActionClicked();
}

function toggleSnackbar(visible) {
	args.DEBUG && Ti.API.info("com.imobicloud.snackbar: toggleSnackbar " + visible);
	if (visible) {
		$.container.animate({ bottom: 0, duration: 300 }, function() {
			if (duration !== LENGTH_INDEFINITE) {
				timeout = setTimeout(toggleSnackbar, getDuration());
			}
		});
	} else if ($.container) {
		$.container.animate({ bottom: - getHeight(), duration: 300 });
	}
}
