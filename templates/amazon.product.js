(function (driver) {

  driver
      .goto('%(url)s')
      .extract(function () {
        return {
          name: $('#btAsinTitle,h1#title').nmtext(),
          price: $('#priceblock_ourprice').nmtext(),
          url: $('link[rel=canonical]').nmattr('href')
        }
      });

});
