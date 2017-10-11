(function() {
  $(function() {
    return $('.section-link').on('click', function(e) {
      var link;
      link = $(this).find("a").first().attr('href');
      return window.location = link;
    });
  });

}).call(this);
