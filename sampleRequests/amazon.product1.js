(function (driver) {

  driver
      .goto('http://www.amazon.com/Foundations-B3596LF-SS-Widespread-Lavatory-Stainless/dp/B002UKT270')
      .extract(function () {
        return {
          name: $('#btAsinTitle,h1#title').first().text().trim(),
          price: $('#priceblock_ourprice').first().text().trim(),
          url: $('link[rel=canonical]').attr('href').trim()
        }
      });

});