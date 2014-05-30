(function () {
  var Lookbook;

  Lookbook = function (element) {
    var self = this,
      $element = $(element);

    self.attachEvents = function () {
      $element.find('.lookbook__hotspot').on('mousedown', self.showOverlay);
      $element.find('.lookbook__hotspot').on('click', stopEvent);
      $element.find('.lookbook__hotspot').on('touchstart', self.showOverlay);
      $element.on('click', self.clearOverlay);
      $element.on('touchstart', self.clearOverlay);
    };

    self.showOverlay = function (e) {

      var hotspot;
      e.preventDefault();
      e.stopPropagation();
      hotspot = e.target;
      self.clearOverlay();

      //Get Product
      self.getProduct($(hotspot).prop('href').split('/')[6])
        .done(function (r) {
          console.log('done');
          console.log(r);
          var overlay = $(
            '<div class="lookbook-popover">' +
            '<div class="lookbook-popover__content">' +
            '<img src="' + r.default_image_url + '">' +
            '<h3>' +
            '<a href="' + $(hotspot).prop('href') + '" target="_blank">' + r.name + '</a>' +
            '</h3>' +
            '<p>From <a href="http://www.westfield.com.au/products?retailer=' + r.retailer_code + '" target="_blank">' + r.retail_chain_name + '</a></p>' +
            '</div>' +
            '</div>'
          )
            .on('touchstart', stopEvent)
            .on('click', stopEvent)
            .on('mousedown', stopEvent);

          var styleX = 'left';
          var styleY = 'top';
          var xpos = hotspot.style.left;
          var ypos = hotspot.style.top;

          if (parseInt(hotspot.style.left, 10) > 50) {
            styleX = 'right';
            xpos = (100 - parseInt(hotspot.style.left, 10)) + "%";
          }
          if (parseInt(hotspot.style.top, 10) > 50) {
            styleY = 'bottom';
            ypos = (100 - parseInt(hotspot.style.top, 10)) + "%";
          }
          console.log(styleX, xpos, styleY, ypos);
          overlay[0].style[styleX] = xpos;
          overlay[0].style[styleY] = ypos;

          overlay.css('-webkit-transform-origin', styleX + ' ' + styleY);
          $element.append(overlay);

          self.overlay = overlay;
          console.log(overlay);
        });
    };

    self.clearOverlay = function () {
      if (self.overlay) {
        self.overlay.remove();
        self.overlay = false;
      }
    };

    self.getProduct = function (productID) {
      console.log(productID);
      return $.ajax({
        url: '/' + productID + '.json'
      });
    };

    self.attachEvents();
    return self;
  };

  function stopEvent(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  $.fn.lookbook = function (curation) {
    return this.each(function (i, el) {
      el.lookbookController = new Lookbook($(el));
    });
  };

  $(document).ready(function () {
    $('.lookbook').lookbook();

    $('a.westfield-lookbook').each(function (i, el) {
      var $el = el;
      var collectionSlug = el.href.split('?')[0].split('/')[6];

      $.ajax({
        url: 'http://10.80.32.67:9292/api/canned-search/master/curations/' + collectionSlug + '.json'
      }).done(function (r) {
        console.log(r.data);
      });


      console.log('http://10.80.32.67:9292/api/canned-search/master/curations/' + collectionSlug + '/hotspots');
      $.ajax({
        url: 'http://10.80.32.67:9292/api/canned-search/master/curations/' + collectionSlug + '/hotspots'
      }).done(function (r) {
        r.data.forEach(function (hotspot) {
          console.log(hotspot);
          //Get Product Data
          $.ajax({
            url: '/api/product/master/products/' + hotspot.product_id + '.json?api_key=mkypad9rymqm8fs5a6n3c8m8'
          }).done(function (r) {
            console.log(r, 'http://www.westfield.com.au/products/' + r.retailer_code + '/' + r.name_slug + '/' + hotspot.product_id);
          });
        });
      });
    });
  });
}());