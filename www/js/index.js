var app = {
  initialize: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },

  onDeviceReady: function() {
   var notificationOpenedCallback = function(jsonData) {
      // alert('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      $.mobile.changePage("#notification");
    };

    window.plugins.OneSignal
      .startInit("1d15307d-d743-4ac8-bdf0-87cbf13c0461")
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
        $.mobile.changePage("#dashboard");
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
