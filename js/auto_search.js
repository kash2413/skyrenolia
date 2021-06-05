function initSearchEngine() {
    var charMap = {
        'ľ': 'l',
        'š': 's',
        'č': 'c',
        'ť': 't',
        'ž': 'z',
        'ý': 'y',
        'á': 'a',
        'í': 'i',
        'é': 'e',
        'ď': 'd',
        'ó': 'o',
        'ü': 'u'
    };

    var $dsr = $('#global_search_fulltext_field');

    var $restaurantSearchField = $('#restaurant_search_fulltext_field');

    var normalize = function (str) {
        $.each(charMap, function (chars, normalized) {
            var regex = new RegExp('[' + chars + ']', 'gi');
            str = str.replace(regex, normalized);
        });

        return str;
    };

    var restaurantSearchEngine = new Bloodhound({
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(normalize(d.v));
        },
        queryTokenizer: function (q) {
            return Bloodhound.tokenizers.whitespace;
        },
        limit: 10,
        remote: {
            url: "/autocomplete-search/r/%QUERY"
        }
    });


    var localitySearchEngine = new Bloodhound({
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(normalize(d.v));
        },
        queryTokenizer: function (q) {
            return Bloodhound.tokenizers.whitespace;
        },
        limit: 10,
        remote: {
            url: "/autocomplete-search/l/%QUERY"
        }
    });

    // initialize the bloodhound suggestion engine
    restaurantSearchEngine.initialize();
    localitySearchEngine.initialize();

    // instantiate the typeahead UI
    $dsr.typeahead({
            highlight: true
        },
        {
            displayKey: 'v',
            source: restaurantSearchEngine.ttAdapter(),
            templates: {
                header: '<div class="tt-title">'+restaurantString+'</div>',
                suggestion: function (o) {
                    return '<div class="suggestion">' + o.v + '</div>';
                }
            }
        },
        {
            displayKey: 'name',
            source: localitySearchEngine.ttAdapter(),
            templates: {
                header: '<div class="tt-title">Lokality</div>',
                suggestion: function (o) {
                    return '<div class="suggestion">' + o.name + '</div>';
                }
            }
        }
    ).on('typeahead:autocompleted typeahead:selected', function (jEvent, selected) {
            restId = $('#search_restaurant_id');
            locId = $('#search_locality_id');
            if(selected.id == undefined){
                restId.val('');
                locId.val(selected.localityId);
                $('#search_form_id').submit();
            } else {
                restId.val(selected.id);
                locId.val('');
                $('#search_form_id').submit();
            }
    });

    // instantiate the typeahead UI
    $restaurantSearchField.typeahead({
            highlight: true
        },
        {
            displayKey: 'v',
            source: restaurantSearchEngine.ttAdapter(),
            templates: {
                header: '',
                suggestion: function (o) {
                    return '<div class="suggestion">' + o.v + '</div>';
                }
            }
        }
    ).on('typeahead:autocompleted typeahead:selected', function (jEvent, selected) {
            restId = $('#search_restaurant_id_compt');
            locId = $('#search_locality_id');
            if(selected.id == undefined){
                restId.val('');
                locId.val(selected.localityId);
                $('#search_form_id_compt').submit();
            } else {
                restId.val(selected.id);
                locId.val('');
                $('#search_form_id_compt').submit();
            }
    });
}