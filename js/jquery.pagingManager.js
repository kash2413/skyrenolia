
/**
 * Dynamic paging
 */

var PagingManager = {};
PagingManager.url;
PagingManager.parameters;
PagingManager.limit;
PagingManager.last_element;
PagingManager.actual_position;
PagingManager.tolerance;
PagingManager.pause_scrolling = 0;
PagingManager.stop_scrolling = 0;
PagingManager.scrollsDetected = 0;
PagingManager.maxScrollDetects = 4;
PagingManager.cachedText ;

PagingManager.ajax = function(){
    PagingManager.parameters = PagingManager.parameters.replace("result="+PagingManager.limit,"result="+(PagingManager.limit+100));
    PagingManager.limit += 100;
    _gaq.push(['_trackEvent', 'Stránkovanie','ajax request na následujúcu stránku']);
    jQuery.ajax({
        url: PagingManager.url+"?"+PagingManager.parameters,
        beforeSend: function(){
            PagingManager.cachedText = jQuery(".dalsie_vysledky a").html();
            jQuery(".dalsie_vysledky a").html('<img src="/bundles/smerestauracieweb/images/ajax-loader.gif" width="16" height="16">');
        },
        success: function(data){
            var parent = jQuery(".dalsie_vysledky").parent();
            jQuery(".dalsie_vysledky").remove();
            parent.append(data);
            PagingManager.bind();
            PagingManager.bindScroll();
            if ( window.location.href.indexOf("result") >= 0){
                var newUrl = window.location.href.replace("result="+(PagingManager.limit - 100),"result="+(PagingManager.limit));
            } else {
                var newUrl = window.location.href+"?result=100";
            }
            window.history.pushState({"html":data,"pageTitle":document.title},"",newUrl );
        },
        error: function(){
            if(PagingManager.stop_scrolling == 1) {
                PagingManager.unbind();
            } else {
                PagingManager.stop_scrolling = 1;
                jQuery(".dalsie_vysledky").unbind("click");
                jQuery(".dalsie_vysledky a").html(PagingManager.cachedText);
            }
        }
    });
}
PagingManager.unbind = function() {
    jQuery(".dalsie_vysledky").unbind("click");
    jQuery(".dalsie_vysledky").click();

};
PagingManager.bind = function() {
    PagingManager.pause_scrolling = 0;
    jQuery(".dalsie_vysledky").click(function(e){
        PagingManager.stop_scrolling = 0;
        e.preventDefault();
        PagingManager.ajax();
    });
};

PagingManager.bindScroll = function() {
    PagingManager.last_element = (jQuery(".zoznam_restauracii .vsetky div:last").offset().top-PagingManager.tolerance);
    jQuery( window ).scroll(function() {
        PagingManager.actual_position = (window.scrollY+$(window).height());
        if (PagingManager.actual_position >= PagingManager.last_element && PagingManager.pause_scrolling == 0 && PagingManager.stop_scrolling == 0){
            PagingManager.pause_scrolling = 1;
            PagingManager.scrollsDetected ++;
            if(jQuery(".dalsie_vysledky").length > 0){
                PagingManager.ajax();
            }
        }
        if(PagingManager.scrollsDetected >= PagingManager.maxScrollDetects) {
            jQuery(window).unbind('scroll');
            PagingManager.stop_scrolling = 1;
            PagingManager.scrollsDetected = 0;
        }
    });
}

PagingManager.init = function(){
    if(jQuery(".dalsie_vysledky").length > 0){
        PagingManager.tolerance = (jQuery(".luxus:first").height()*10);
        PagingManager.last_element = (jQuery(".luxus:last").offset().top-PagingManager.tolerance);
        PagingManager.bind();
        PagingManager.bindScroll();
    }
};

