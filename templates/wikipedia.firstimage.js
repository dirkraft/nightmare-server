(function (driver) {

  driver.goto('%(url)s')
      .extract(function () {
        return {
          imageUrl: $('#mw-content-text img.thumbimage').nmattr('src')
        };
      });

});
