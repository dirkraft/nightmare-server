(function () {
  $.fn.nmtext = function () {
    return clean(this.text());
  };

  $.fn.nmattr = function (attrName) {
    return clean(this.attr(attrName));
  };

  function clean(s) {
    return s ? s.trim() : '';
  }
}());
