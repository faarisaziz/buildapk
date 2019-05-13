var panel = '<div data-role="panel" data-position="right" data-position-fixed="true" data-display="push" data-theme="a" id="add-form"><div class="ui-panel-inner"><a href="#aboutus" data-transition="slide" class="ui-btn ui-corner-all">About Us</a><a href="#faq" data-transition="slide" class="ui-btn ui-corner-all">FAQ</a><a href="#" onclick="logout()" class="ui-btn ui-corner-all btn-red">Log Out</a></div></div>'

$(document).one('pagebeforecreate', function () {
    $.mobile.pageContainer.prepend(panel);
    $("#add-form").panel().enhanceWithin();
});