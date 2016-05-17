(function (driver) {

  driver
      .goto('http://www.amazon.com/Faucet-79646-OB-Windemere-Rubbed-Bronze/dp/B006J1TBZO')
      .extract(function () {
        return {
          name: $('#btAsinTitle,h1#title').first().text().trim(),
          price: $('#priceblock_ourprice').first().text().trim(),
          url: $('link[rel=canonical]').attr('href').trim()
        }
      });

});