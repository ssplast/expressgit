$(document).ready(function(){
    // scroll top start
    var btnScrollUp = $('.btn-scrollup');
    if (btnScrollUp.length) {
        btnScrollUp.css({
            "position": "fixed",
            "bottom": "40px",
            "right": "40px",
            "z-index": "9999"
        });
        var scrollTrigger = 100, // px
            backToTop = function () {
                var scrollTop = $(window).scrollTop();
                if (scrollTop > scrollTrigger) {
                    btnScrollUp.css({"display": "inline-block"});
                } else {
                    btnScrollUp.css({"display": "none"});
                }
            };
        backToTop();
        $(window).on('scroll', function () {
            backToTop();
        });
        btnScrollUp.on('click', function (e) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: 0
            }, 500);
        });
    }
    // scroll top end
});


