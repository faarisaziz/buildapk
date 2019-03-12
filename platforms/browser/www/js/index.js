var app = {
  initialize: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },

  onDeviceReady: function() {
    app.receivedEvent('deviceready');
  },

  receivedEvent: function(id) {
    $(".banner-item").slick({ 
      slidesToShow: 1, slidesToScroll: 1, 
      autoplay: true, autoplaySpeed: 5000,
      centerMode: true
    });
  }
};
