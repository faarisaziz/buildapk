var notification = false;
var app = {
  initialize: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
    var notification = false;
  },

  onDeviceReady: function() {
   var notificationOpenedCallback = function(jsonData) {
      notification = true;
    };

    window.plugins.OneSignal
      .startInit("c7418b6a-ac8b-4a9f-bc42-457b2bec0c52")
      .handleNotificationOpened(notificationOpenedCallback)
      .endInit();

    document.addEventListener("backbutton", function(e){
       if($.mobile.activePage.is('#dashboard') || $.mobile.activePage.is('#login')){
           e.preventDefault();
           navigator.app.exitApp();
       }
       else {
           navigator.app.backHistory();
       }
    }, false);

    app.receivedEvent('deviceready');
  },

  receivedEvent: function(id) {
    checkSession();

    $(function() {
      if(window.localStorage.getItem("loggedIn") == 1) {
        $('#profil-user').text(window.localStorage.getItem('name'));
        if (notification) {
           $.mobile.changePage("#notification");
        } else {
          $.mobile.changePage("#dashboard");
        }
      }
      else
      {
        setTimeout(hideSplash, 2000);
      }
      
    });
    
    function hideSplash() {
      $.mobile.changePage("#login", "fade");
    }

    moveOnMax =function (field, nextFieldID) {
      if (field.value.length == 1) {
          document.getElementById(nextFieldID).focus();
      }
    }

    setTimeout(function() {
    var mySwiper = new Swiper ('.swiper-container', {
      centeredSlides: true,
      loop: true,
      autoplay: {
          delay: 2000,
          disableOnInteraction: false
      }
    });
    }, 1000);
  }
};
