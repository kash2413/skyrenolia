/**
 * Detekcia iPhone a iPod
 */
/* jQuery(document).ready(function(){
 if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
 jQuery('body').prepend('<div class="iphone_tip">Pre pohodlnejší prístup z iPhonu použite našu iPhone aplikáciu, ktorú si <a href="http://itunes.apple.com/sk/app/restauracie.sk-kofola/id453580527?mt=8" title="Stiahnite si iPhone aplikáciu">môžete stiahnuť zadarmo!</a></div>');
 }
 });*/

// /**
//  * Android Splash screen
//  */
// jQuery(document).ready(function () {
//     var isAndroid = /android/i.test(navigator.userAgent.toLowerCase());
//     if (isAndroid) {
//         var date = new Date();
//         var year = date.getFullYear();
//         var month = (date.getMonth() + 1);
//         var day = date.getDate();
//         if ($.cookies.get("androidApp") != (day + "." + month + "." + year)) {
//             $.cookies.set("androidApp", (day + "." + month + "." + year), { expires: 1 });
//             if (navigator.userAgent.match(/Mobile/i) || navigator.userAgent.match(/Mobi/i)) {
//                 $.ajax({
//                     url: "/androidSplashScreen",
//                     success: function (data, textStatus, xhr) {
//                         if ($.cookies.get("androidAppVersion") != data) {
//                             $.cookies.set("androidAppVersion", data, { expires: 365 });
//                             document.write('<html><head><meta content="text/html; charset=UTF-8" http-equiv="content-type"><meta name = "viewport" content = "width = device-width"><title>Reštaurácie, denné menu, akcie, hodnotenia</title><link href="/bundles/smerestauracieweb/css/public/reset.css" rel="stylesheet" type="text/css"/><link href="/bundles/smerestauracieweb/css/public/android.css" rel="stylesheet" type="text/css"/></head><body><header><a href="http://restauracie.sme.sk" rel="nofollow" class="logo"><img alt="Reštaurácie.sme.sk" src="/bundles/smerestauracieweb/images/android/res-logo.png"></a></header><h1>TOP reštaurácie vo Vašom okolí </h1><a href="https://play.google.com/store/apps/details?id=sk.restauracie.android.app&hl=sk" class="button"><img alt="Reštaurácie aplikácia na stiahnutie" src="/bundles/smerestauracieweb/images/android/button.png"></a><br/><a href="' + location.href + '" rel="nofollow" class="next">Pokračujte na stránku</a><img alt="Smartphone obrázok" src="/bundles/smerestauracieweb/images/android/samsung2.png" class="s4"></body></html>');
//                         }
//                     }
//                 });
//             }
//         }
//     }
// });
/**
 * GET URL PARAMETER
 * @param name
 * @returns {string|null}
 */
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

jQuery(document).ready(function () {
    jQuery("#restauracie-search").click(function () {
        jQuery("#restauracie-search-panel").toggle();
        return false;
    });
});

/**
 * Klikatelny item v zozname
 */
jQuery(document).ready(function () {
    jQuery('.c_clicker').click(function(event){
        event.stopPropagation();
        var itemUrl = $(this).find('.c_clicker_url').attr('href');
        if(itemUrl !== undefined){
            window.location.href = itemUrl;
        }

    })
});


/**
 * Menu
 */
jQuery(document).ready(function () {
    jQuery("#navigation > div").hover(
        function () {
            jQuery(".second_level", this).fadeIn("fast");
        },
        function () {
            jQuery(".second_level", this).fadeOut("fast");
        }
    );
});

/**
 * Bookmark add
 */
jQuery(document).ready(function () {
    jQuery(".bookmark_action").click(function () {
        addBookmarkItem(jQuery(this).attr('id'), jQuery(this));
        return false;
    });
});
function addBookmarkItem(id, element) {
    jQuery.ajax({
        url: '/bookmark',
        cache: false,
        data: {
            id: id,
            type: '1'
        },
        success: function (data) {
            var oblubene = jQuery("#mojeOblubene");
            var container = jQuery("#mojeOblubeneContainer");
            if (data.length > 0) {
                if (container.length == 0) {
                    window.location.reload();
                }

                oblubene.find("a.delete").unbind('click');
                if (oblubene.children("p").size() === 0) {
                    oblubene.show();
                    container.show();
                }
                oblubene.prepend(data);
                oblubene.find(">p:first").effect('highlight', {
                    color: '#A7090C'
                }, 2000);
                if (oblubene.find(">p").length === 11) {
                    oblubene.find(">p:last").remove();
                }
                bindRemoveBookmark();
            }
            else {
                oblubene.effect('highlight', {
                    color: '#A7090C'
                }, 1000);
            }
            element.fadeOut("fast");
        },
        error: function () {
            alert('Nepodarilo sa pridať reštauráciu k obľúbeným!');
        }
    });
}
/**
 * Bookmark remove
 */
jQuery(document).ready(function () {
    bindRemoveBookmark();
});
function bindRemoveBookmark() {
    jQuery("#mojeOblubene a.delete").click(function () {
        removeBookmarkItem(jQuery(this).attr('id'), jQuery(this).parent("p"), function (element) {
            element.fadeOut('fast', function () {
                jQuery(this).remove();
                if (jQuery("#mojeOblubene").children("p").size() === 0) {
                    jQuery("#mojeOblubene").hide();
                    jQuery("#mojeOblubeneContainer").hide();
                    //jQuery("#mojeOblubeneInfo").show();
                }
            });
        });
        return false;
    });
}
function removeBookmarkItem(id, element, callback) {
    jQuery.ajax({
        url: '/bookmark',
        cache: false,
        data: {
            id: id,
            type: '2'
        },
        success: function (data) {
            callback(element);
        },
        error: function () {
            alert('Nepodarilo sa vymazať položku!');
        }
    });
}

/**
 * Vyber z minimapy
 */
var Mapka = function(topOffset, leftOffset, timeout, suppliedRegions) {
    this.topOffset = topOffset;
    this.leftOffset = leftOffset;
    this.timeout = timeout;
    this.regions = {
        'podunajsko': [103, 183],
        'bratislava': [28, 155],
        'zahorie': [24, 127],
        'trnavsko': [60, 134],
        'ponitrie': [105, 141],
        'stredne_povazie': [70, 109],
        'dolne_pohronie': [129, 180],
        'pohronie': [160, 114],
        'hont': [169, 152],
        'podpolanie': [192, 108],
        'gemer': [241, 130],
        'horehronie': [200, 96],
        'turiec': [150, 83],
        'horne_povazie': [124, 64],
        'kysuce': [145, 35],
        'orava': [200, 37],
        'liptov': [215, 69],
        'spis': [272, 88],
        'kosice': [320, 101],
        'saris': [313, 71],
        'horny_zemplin': [379, 66],
        'dolny_zemplin': [359, 116],
        'tekov': [137, 145]
    };
    this.regionsMappings = {
        'podunajsko': 'Podunajsko',
        'bratislava': 'Bratislavský región',
        'zahorie': 'Záhorie',
        'orava': 'Orava',
        'stredne_povazie': 'Stredné Považie',
        'trnavsko': 'Trnavsko',
        'ponitrie': 'Ponitrie',
        'dolne_pohronie': 'Dolné Pohronie a Poiplie',
        'pohronie': 'Pohronie',
        'hont': 'Hont',
        'podpolanie': 'Podpoľanie',
        'gemer': 'Gemer a Novohrad',
        'horehronie': 'Horehronie',
        'turiec': 'Turiec',
        'horne_povazie': 'Horné Považie',
        'kysuce': 'Kysuce',
        'orava': 'Orava',
        'liptov': 'Liptov',
        'spis': 'Spiš',
        'kosice': 'Košický región',
        'saris': 'Šariš',
        'horny_zemplin': 'Horný Zemplín',
        'dolny_zemplin': 'Dolný Zemplín',
        'tekov': 'Tekov'
    };
    this.suppliedRegions = suppliedRegions;
};

Mapka.prototype.init = function (url) {
    var that = this;
    var vyberMestaDiv = jQuery('.vyber_mesta');
    var regionId;
    var currentArea;

    vyberMestaDiv.mouseenter(function () {
        var timeoutIdIn = currentArea.data('timeoutIdIn');
        var timeoutIdOut = currentArea.data('timeoutIdOut');
        clearTimeout(timeoutIdIn);
        clearTimeout(timeoutIdOut);
    });
    vyberMestaDiv.mouseleave(function () {
        var timeoutIdOut = setTimeout(function () {
            currentArea.data('active', false);
            vyberMestaDiv.hide();
            var data = currentArea.data('maphilight') || {};
            data.alwaysOn = false;
            currentArea.data('maphilight', data).trigger('alwaysOn.maphilight');
            currentArea = null;
        }, that.timeout);
        currentArea.data('timeoutIdOut', timeoutIdOut);
        vyberMestaDiv.hide();
    });



    jQuery('area').mouseenter(function () {
        var area = jQuery(this);
        regionId = area.attr('id');
        var timeoutIdIn = area.data('timeoutIdIn');
        clearTimeout(timeoutIdIn);
        var areaActive = area.data('active');
        var regionName = that.regionsMappings[regionId];
        var regionData = that.suppliedRegions[regionName];
        if (regionData !== undefined) {
            area.attr('href', '/'+url+'/' + regionData.nameWeb + "_" + regionData.id);
        }
        if (areaActive === true) {
            var timeoutIdOut = area.data('timeoutIdOut');
            clearTimeout(timeoutIdOut);
        } else {
            timeoutIdIn = setTimeout(function () {
                area.data('active', true);
                currentArea = area;
                var mapkaMestaDiv = jQuery('#mapka_mesta');
                mapkaMestaDiv.empty();
                if (regionName !== undefined) {
                    if (regionData !== undefined) {
                        var mapkaMestaDivContent = '<a href="/'+url+'/' + regionData.nameWeb + '_' + regionData.id + '" class="nazov red">' + regionName + ' (' + regionData.c + ')</a><br/>';
                        jQuery.each(regionData.sub, function (name, data) {
                            mapkaMestaDivContent = mapkaMestaDivContent + '<a href="/'+url+'/' + data.nameWeb + '_' + data.id + '">' + name + ' (' + data.c + ')</a><br/>';
                        });
                        mapkaMestaDiv.append(mapkaMestaDivContent);
                    }
                }
                vyberMestaDiv.show();
                vyberMestaDiv.css('top', that.regions[regionId][1] + that.topOffset + 'px');
                vyberMestaDiv.css('left', that.regions[regionId][0] + that.leftOffset + 'px');
                var data = area.data('maphilight') || {};
                data.alwaysOn = true;
                area.data('maphilight', data).trigger('alwaysOn.maphilight');
            }, that.timeout);
            area.data('timeoutIdIn', timeoutIdIn);
        }
    });

    jQuery('area').mouseleave(function (event) {
        var area = jQuery(this);
        regionId = area.attr('id');
        var timeoutIdIn = area.data('timeoutIdIn');
        clearTimeout(timeoutIdIn);
        var areaActive = area.data('active');
        if (areaActive === true) {
            var timeoutIdOut = setTimeout(function () {
                area.data('active', false);
                currentArea = null;

                var data = area.data('maphilight') || {};
                data.alwaysOn = false;
                area.data('maphilight', data).trigger('alwaysOn.maphilight');
                //console.log(data);
                if(data == false){
                    vyberMestaDiv.hide();
                }
            }, that.timeout);
            area.data('timeoutIdOut', timeoutIdOut);
        }
    });
};


/*function clearInt() {
 clearTimeout(interval);
 }
 function hideIt() {
 jQuery('.vyber_lokality').slideUp(100, function() {
 jQuery('#mapa_regionov').maphilight({fillOpacity: 1, fillColor: 'A7090C', strokeColor: 'A7090C', fade: true, neverOn: true});
 });
 }*/
jQuery(document).ready(function () {
     var mapka = new Mapka(0, 0, 150, regions);


    /*jQuery('.vyber_lokality').mouseover(function() {
     clearInt();
     return false;
     });
     jQuery('.vyber_lokality').mouseleave(function() {
     clearInt();
     interval = setTimeout("hideIt()", 1000);
     return false;
     });*/
    jQuery('.lokalita_link').click(function () {
        mapka.init('restauracie');
        jQuery('.vyber_lokality').slideDown(100, function () {
            jQuery('#mapa_regionov').maphilight({fillOpacity: 1, fillColor: 'A7090C', strokeColor: 'A7090C', fade: true, neverOn: true});
        });
        return false;
    });

    jQuery('.static_lokalita_link').click(function () {
        mapka.init('promo-change-locality');
        //var mapka = new StaticMapka(0, 0, 150, regions);
        //mapka.init();
        jQuery('.vyber_lokality').slideDown(100, function () {
            jQuery('#mapa_regionov').maphilight({fillOpacity: 1, fillColor: 'A7090C', strokeColor: 'A7090C', fade: true, neverOn: true});
        });
        $('.middle').last().parent().addClass('selected');

        $('html, body').animate({
            scrollTop: $('.navigation').offset().top
        }, 20);
        $('.vyber_lokality').find('a').each(function() {
            $(this).attr('href', $(this).attr('href').replace("/restauracie/","/promo-change-locality/"))
        });
        return false;
    });
    /*jQuery('.lokalita_link').mouseleave(function() {
     clearInt();
     interval = setTimeout("hideIt()", 1000);
     return false;
     });*/
    jQuery('.zmen_lokalita').click(function () {
        jQuery('.vyber_lokality').slideToggle(100, function () {
            jQuery('#mapa_regionov').maphilight({fillOpacity: 1, fillColor: 'A7090C', strokeColor: 'A7090C', fade: true, neverOn: true});
        });
        return false;
    });
    jQuery('.close').click(function (event) {
        //event.preventDefault();
        //jQuery('.lokalita_link').trigger('click');
        jQuery('.vyber_lokality').slideUp(100, function () {
            jQuery('#mapa_regionov').maphilight({fillOpacity: 1, fillColor: 'A7090C', strokeColor: 'A7090C', fade: true, neverOn: true});
        });
    });
    jQuery('.body_wrapper').click(function (event) {
        //event.preventDefault();
        //jQuery('.lokalita_link').trigger('click');
        jQuery('.vyber_lokality').slideUp(100, function () {
            jQuery('#mapa_regionov').maphilight({fillOpacity: 1, fillColor: 'A7090C', strokeColor: 'A7090C', fade: true, neverOn: true});
        });
    });
});

/**
 * Vyhladavanie page
 */
jQuery(document).ready(function () {
    jQuery('#vyhladavanie_show_hide_detaily').click(function () {
        jQuery('#vyhladavanie_detaily_container').toggle();
    });
    jQuery('#vyhladavanie_detaily_container').mouseleave(function () {
        jQuery('#vyhladavanie_detaily_container').hide();
    });
    jQuery('.detaily_picker input[type="checkbox"]').change(function () {
        var selected = jQuery('.detaily_picker input:checked');

        if (selected.length > 0) {
            var resultString = "( ";
            jQuery('.detaily_picker input:checked').each(function (index) {
                if (index != 0) {
                    resultString = resultString + ", ";
                }
                resultString = resultString + jQuery(this).siblings("label").text();
            });
            resultString = resultString + " )";
            jQuery('#detaily_hodnota').text(resultString);
        }
        else {
            jQuery('#detaily_hodnota').text("");
        }
    });
});

/**
 * Vyplni prazdne pole hodnotou uvedenou v title
 */
jQuery.fn.restauracieLabelledFiled = function (settings) {
    settings = jQuery.extend({
        labelledClass: "",
        labelledStyle: ""
    }, settings);
    if (jQuery(this).val() === "" || jQuery(this).val() === null) {
        jQuery(this).val(jQuery(this).attr("title"));
        jQuery(this).addClass(settings.labelledClass);
        jQuery(this).attr("style", settings.labelledStyle);
    }
    jQuery(this).focus(function () {
        if (jQuery(this).val() === jQuery(this).attr("title")) {
            jQuery(this).val("");
            jQuery(this).removeClass(settings.labelledClass);
            jQuery(this).removeAttr("style");
        }
    });
    jQuery(this).blur(function () {
        if (jQuery(this).val() === "" || jQuery(this).val() === null) {
            jQuery(this).val(jQuery(this).attr("title"));
            jQuery(this).addClass(settings.labelledClass);
            jQuery(this).attr("style", settings.labelledStyle);
        }
    });

    var removeValuesOnExit = function (element) {
        if (element.val() === element.attr("title")) {
            element.val("");
            element.removeClass(settings.labelledClass);
            element.removeAttr("style");
        }
    };
    var thisElement = jQuery(this);
    jQuery(this).parent("form").submit(function () {
        removeValuesOnExit(thisElement);
    });
    jQuery(window).unload(function () {
        removeValuesOnExit(thisElement);
    });
};

jQuery.fn.removeTitle = function (labelledClass) {
    if (this.val() === this.attr("title")) {
        this.val("");
        this.removeClass(labelledClass);
        this.removeAttr("style");
    }
    return this;
};

jQuery.fn.realValue = function (settings) {
    if (jQuery(this).val() === jQuery(this).attr("title")) {
        return "";
    }
    else {
        return jQuery(this).val();
    }
};

jQuery(document).ready(function () {
    if (jQuery("#global_search_fulltext_field").length > 0) {
        jQuery("#global_search_fulltext_field").restauracieLabelledFiled({ labelledClass: "input_labelled", labelledStyle: "color:#a0a0a0"});
    }
    if (jQuery("#vyhladavanie_search_fulltext_field").length > 0) {
        jQuery("#vyhladavanie_search_fulltext_field").restauracieLabelledFiled({ labelledClass: "input_labelled", labelledStyle: "color:#a0a0a0"});
    }
    if (jQuery("#reviewText").length > 0) {
        jQuery("#reviewText").restauracieLabelledFiled({ labelledClass: "input_labelled", labelledStyle: "color:#a0a0a0"});
    }
    jQuery("#search_kategoriaakcie_field").change(function () {
        jQuery('form.main_search').submit();
    });
});

/**
 * Clanky
 */
    $(document).on('click', '#clanky_najcitanejsie_link', function () {
        $('#clanky_najcitanejsie').show();
        $('#clanky_najnovsie').hide();
        $('#clanky_najnovsie_link').removeAttr("class");
        $('#clanky_najcitanejsie_link').attr("class", "sel");
        return false;

    });
    $(document).on('click', '#clanky_najnovsie_link', function () {
        $('#clanky_najcitanejsie').hide();
        $('#clanky_najnovsie').show();
        $('#clanky_najcitanejsie_link').removeAttr("class");
        $('#clanky_najnovsie_link').attr("class", "sel");
        return false;
    });

/**
 * MainTabs
 jQuery(document).ready(function(){
	hideMainTabs();
	jQuery('#main_restauracie_content').show();
	function hideMainTabs() {
		jQuery('#main_oblubene_content').hide();
		jQuery('#main_restauracie_content').hide();
		jQuery('#main_dennemenu_content').hide();
		jQuery('#main_akcie_content').hide();
		jQuery('#main_oblubene_tab').removeAttr("class");
		jQuery('#main_restauracie_tab').removeAttr("class");
		jQuery('#main_dennemenu_tab').removeAttr("class");
		jQuery('#main_akcie_tab').removeAttr("class");
	}
	jQuery('#main_oblubene_tab').click(function() {
		hideMainTabs();
		jQuery('#main_oblubene_content').show();
		jQuery('#main_oblubene_tab').attr("class", "sel");
		return false;
	});
	jQuery('#main_restauracie_tab').click(function() {
		hideMainTabs();
		jQuery('#main_restauracie_content').show();
		jQuery('#main_restauracie_tab').attr("class", "sel");
		return false;
	});
	jQuery('#main_dennemenu_tab').click(function() {
		hideMainTabs();
		jQuery('#main_dennemenu_content').show();
		jQuery('#main_dennemenu_tab').attr("class", "sel");
		return false;
	});
	jQuery('#main_akcie_tab').click(function() {
		hideMainTabs();
		jQuery('#main_akcie_content').show();
		jQuery('#main_akcie_tab').attr("class", "sel");
		return false;
	});
});*/
/**
 * Vyber podlokality na titulke
 * */
var VyberPodlokality = function (timeout) {
    this.timeout = timeout;
};

VyberPodlokality.prototype.init = function () {
    var that = this;
    var currentLocality;

    jQuery('.vyber_podlokality').mouseenter(function () {
        var timeoutIdIn = currentLocality.data('timeoutIdIn');
        var timeoutIdOut = currentLocality.data('timeoutIdOut');
        clearTimeout(timeoutIdIn);
        clearTimeout(timeoutIdOut);
    });
    jQuery('.vyber_podlokality').mouseleave(function () {
        var thisElement = jQuery(this);
        var timeoutIdOut = setTimeout(function () {
            if (currentLocality !== null) {
                currentLocality.data('active', false);
            }
            thisElement.hide();
            currentLocality = null;
        }, that.timeout);
        currentLocality.data('timeoutIdOut', timeoutIdOut);
    });

    jQuery('.vyber_lokality_titulka').mouseenter(function () {
        var vyberLokalityLink = jQuery(this);
        var thisElement = jQuery(this);
        var timeoutIdIn = vyberLokalityLink.data('timeoutIdIn');
        clearTimeout(timeoutIdIn);
        var vyberLokalityLinkActive = vyberLokalityLink.data('active');
        if (vyberLokalityLinkActive === true) {
            var timeoutIdOut = vyberLokalityLink.data('timeoutIdOut');
            clearTimeout(timeoutIdOut);
        } else {
            timeoutIdIn = setTimeout(function () {
                vyberLokalityLink.data('active', true);
                currentLocality = vyberLokalityLink;
                var podlokalityDiv = thisElement.next();

                podlokalityDiv.css('left', 0);
                podlokalityDiv.css('top', 0);
                var podlokalityWidth = podlokalityDiv.width();
                if (podlokalityWidth > 450) {
                    podlokalityWidth = 450;
                    podlokalityDiv.width(podlokalityWidth);
                }

                var leftOffset = thisElement.position().left + thisElement.width() + 3;
                var topOffset = thisElement.position().top + thisElement.height() / 2 - podlokalityDiv.height() / 2;
                podlokalityDiv.width(podlokalityWidth);

                podlokalityDiv.css('left', leftOffset);
                podlokalityDiv.css('top', topOffset);
                podlokalityDiv.show();
            }, that.timeout);
            vyberLokalityLink.data('timeoutIdIn', timeoutIdIn);
        }
    });

    jQuery('.vyber_lokality_titulka').mouseleave(function (event) {
        var vyberLokalityLink = jQuery(this);
        var timeoutIdIn = vyberLokalityLink.data('timeoutIdIn');
        clearTimeout(timeoutIdIn);
        var vyberLokalityLinkActive = vyberLokalityLink.data('active');
        if (vyberLokalityLinkActive === true) {
            var timeoutIdOut = setTimeout(function () {
                vyberLokalityLink.data('active', false);
                currentLocality = null;
                jQuery('.vyber_podlokality').hide();
            }, that.timeout);
            vyberLokalityLink.data('timeoutIdOut', timeoutIdOut);
        }
    });
};

/**
 * Hodnotenia, Prihlasenie
 */
function redirect(url) {
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
        var referLink = document.createElement('a');
        referLink.href = url;
        document.body.appendChild(referLink);
        referLink.click();
    } else {
        window.location = url;
    }
}

/*
 * HODNOTENIE FORM
 */
jQuery(document).ready(function () {
    jQuery('#reviewForm').submit(function () {
        var valid = true;
        jQuery('#reviewForm span input[type=hidden]').each(function () {
            if (jQuery(this).val() == '' || jQuery(this).val() === undefined) {
                valid = false;
            }
        });

        var date = jQuery('#evaluation_form_datumNavstevyCombo').val();
        if (date == '' || date === undefined) {
            valid = false;
        }

        if (!valid) {
            jQuery('#reviewFeedback').fadeIn(400);
            return false;
        }
    });

    jQuery('#loginRequiredClassicDialog').dialog({
        modal: true,
        autoOpen: false,
        buttons: {
            'Prihlásiť': function () {
                jQuery(this).dialog('close');
                redirect('/login?ref='+window.location.href);
            }
        }
    });

    jQuery('#loginRequiredDialog').dialog({
        modal: true,
        autoOpen: false,
        buttons: {
            'Uložiť hodnotenie bez prihlásenia': {
                class: 'js-no-login-link',
                click:function(){
                    jQuery(this).dialog('close');
                    jQuery('#successfulEvaluation').dialog({width: 400}).dialog('open');
                }
            },
            'Prihlásiť': function () {
                jQuery(this).dialog('close');
                redirect('/login?ref='+window.location.href);
            }
        }
    }).on( "dialogopen", function( event, ui ) {
        aHref = $('<a></a>').attr('href','#').attr('class','no-login-link').text('Uložiť bez prihlásenia');
        $('.js-no-login-link').after(aHref).remove();
        aHref.on('click', function() {
            jQuery('#loginRequiredDialog').dialog('close');
            jQuery('#successfulEvaluation').dialog({width: 400}).dialog('open');

            return false;
        });
    });
    jQuery('#successfulEvaluation').dialog({
        modal: true,
        autoOpen: false,
        dialogClass: 'ui-success',
        height: '20px',
        open: function(event, ui) {
            jQuery('#successfulEvaluation').dialog({width: 400}).dialog('open');
        }
    });


    jQuery('.compact_rating:not(.zoznam_compact_rating)').each(function () {
        jQuery(this).qtip({
            content: jQuery(this).children(':first').html(),
            position: {
                at: 'top right',
                my: 'bottom left'
            },
            style: {
                classes: 'ui-tooltip-light ui-tooltip-shadow',
                tip: true
            }
        });
    });

});

jQuery(document).ready(function () {
    var maxsize = 500;

    $('#reviewText').keydown(function () {
        var len = this.value.length + 1;
        if (len > maxsize) {
            this.value = this.value.substring(0, maxsize);
            len = maxsize;
        }
        $('#charLeft').text(maxsize - len, 0);
    });
});

function reviewForm() {
    document.getElementById('hodnotenia').style.display = 'none';
    document.getElementById('addReviewPanel').style.display = 'block';
}


// foursquare like slider na titulke
function move(i) {
    return function () {
        jQuery('#feed' + i).detach().css('display', 'none').prependTo('#eventFeed');
    };
}

// hodnotenia na titulke
jQuery(document).ready(function () {
    setTimeout(function () {
        shift(3000, 25, 3, 0);
    }, 2000);
});

function shift(delay, count, showing, i) {
    var toShow = (i + showing) % count;
    jQuery('#feed' + toShow).slideDown(1000);
    jQuery('#feed' + i).slideUp(1000, move(i));
    i = (i + 1) % count;
    setTimeout(function () {
        shift(delay, count, showing, i);
    }, delay);
}
/**
 * SME Pocitadlo
 * */
function storm_pg_stat_hit(t, v, p, add_params) {
    var l = new String('');
    var d = document;
    var href = new String(d.location.href);
    var ref = '';

    if (document.location && document.location.protocol && document.location.protocol == 'https:') {
        l = l + 'https:';
    } else {
        l = l + 'http:';
    }
    l = l + '//services.sme.sk/pgstat/pgstat' + ((t == 'artp') ? 'p' : '') + '.asp?_r=' + (new Date()).getTime() + '&_r2=' + Math.floor(100000 * Math.random());
    if (t) l = l + '&t=' + t;
    if (v) l = l + '&v=' + v;
    if (p) l = l + p;
    if (add_params > 0) {
        if (d.referrer) ref = new String(d.referrer);
        l = l + '&href=' + escape(href.substring(0, 200)) + '&ref=' + escape(ref.substring(0, 200));
    }
    var storm_pg_stat_image = new Image();
    storm_pg_stat_image.src = l;
}
jQuery(document).ready(function () {
    var maxsize = 500;
    $('#reviewText').keydown(function () {
        var len = this.value.length + 1;
        if (len > maxsize) {
            this.value = this.value.substring(0, maxsize);
            len = maxsize;
        }
        $('#charLeft').text(maxsize - len, 0);
    });
});
jQuery(document).ready(function () {
    var maxsize = 512;
    $('#pridanieRestauracieText').keydown(function (e) {
        var len = this.value.length;
        if (e.which == 8) {
            if (len > 0) {
                len = this.value.length - 1;
            } else {
                len = 0;
            }
        } else {
            len = this.value.length + 1;
            if (len >= maxsize) {
                this.value = this.value.substring(0, maxsize);
                len = maxsize;
            }
        }
        $('#charLeft').text(maxsize - len, 0);
        //$('#charLeft').text(e.which);
    });
});

jQuery(document).ready(function () {

    /**
     * Plynule scrolovanie nahor
     * */
    jQuery('.scroll_up').click(function () {
        $('body,html').animate({ scrollTop: 0 }, 200);
        return false;
    });


    var images = jQuery('.fancybox');



    images.click(function() {
        var links = [];
        var current = this.href;
        links.push({ href: this.href, title: this.title });
        images.each(function (key, value) {
            if(current != value.href) {
                links.push({ href: value.href, title: value.title });
            }
        });
        $.fancybox.open(links);
        return false;
    })
});

function showFullWeekMenu(){
    $('#js-showWeekMenu').remove();
    $('.ostatne_menu').removeClass('hidden');

    return false;
}

/* advanced search - custom select and options */
jQuery(document).ready(function() {

    var searchSelect = $('.js-advanced-search-select'),
        searchCategs = $('.js-advanced-search-categs');

    $('body').on('click', function(){
        searchCategs.removeClass('visible');
    });

    searchCategs.on('click', function(e){
        e.stopPropagation();
    });

    searchCategs.find('li').on('click', function(){
        var searchCategsLiVal = $(this).data('value'),
            searchCategsLiTxt = $(this).text(),
            thisSelect = $(this).parent().parent().siblings(searchSelect);

        thisSelect.find('.js-input-select').val(searchCategsLiTxt);
        thisSelect.find('.js-input-select-hidden').val(searchCategsLiVal);
        searchCategs.removeClass('visible');
        $(this).parent().find('li').removeClass('selected');
        $(this).closest('li').addClass('selected');
    });

    searchSelect.on('click', function(e){
        e.stopPropagation();
        searchCategs.removeClass('visible');
        $(this).parent().closest('td').find(searchCategs).addClass('visible');
    });

    searchSelect.find('.js-input-select').on('keydown focus', function(){
        $(this).blur();
    });

});
