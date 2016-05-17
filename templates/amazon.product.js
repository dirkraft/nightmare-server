(function (driver) {

  driver
      .goto('%s')
      .extract(function () {
        return {
          name: $('#btAsinTitle,h1#title').first().text().trim(),
          price: $('#priceblock_ourprice').first().text().trim(),
          url: $('link[rel=canonical]').attr('href').trim()
        }
      });

});