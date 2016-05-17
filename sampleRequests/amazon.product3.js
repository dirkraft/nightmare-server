(function (driver) {

  driver
      .goto('http://www.amazon.com/gp/product/B00S57MP4O')
      .extract(function () {
        return {
          name: $('#btAsinTitle,h1#title').first().text().trim(),
          price: $('#priceblock_ourprice').first().text().trim(),
          url: $('link[rel=canonical]').attr('href').trim()
        }
      });

});