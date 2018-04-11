$(function() {
  $('.owl-carousel').owlCarousel({
    items: 1,
    dots: true
  });

  $('.button_order').click(function(){
    $('html, body').animate({
      scrollTop: $('#form').offset().top+'px'
    });
    return false;
  });

});
