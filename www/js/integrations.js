var panel = '<div data-role="panel" data-position="right" data-position-fixed="true" data-display="push" data-theme="a" id="add-form"><div class="ui-panel-inner"><a href="#profile-edit" data-transition="slide" class="ui-btn ui-corner-all" onclick="getProfile()">Profil</a><a href="#aboutus" data-transition="slide" class="ui-btn ui-corner-all" onclick="get_about(); get_banner_partner()">About Us</a><a href="#faq" onclick="get_faq()" data-transition="slide" class="ui-btn ui-corner-all">FAQ</a><a href="#" onclick="logout()" class="ui-btn ui-corner-all btn-red">Log Out</a></div></div>'

$(document).one('pagebeforecreate', function () {
    $.mobile.pageContainer.prepend(panel);
    $("#add-form").panel().enhanceWithin();
});