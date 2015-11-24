var apiRoot = 'https://gsafinearts.pbs.gsa.gov/emuseum/api/',

    artistsCacheTemplate = {
        artists: {
            "a": [],
            "b": [],
            "c": [],
            "d": [],
            "e": [],
            "f": [],
            "g": [],
            "h": [],
            "i": [],
            "j": [],
            "k": [],
            "l": [],
            "m": [],
            "n": [],
            "o": [],
            "p": [],
            "q": [],
            "r": [],
            "s": [],
            "t": [],
            "u": [],
            "v": [],
            "w": [],
            "x": [],
            "y": [],
            "z": []
        },
        "status": [],
        "date": null
    },

    artistsCache = artistsCacheTemplate,

    galleriesCache = {
        "galleries": null,
        "date": null
    },

    alphaOrder = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],

    states = {
        "al": "alabama",
        "ak": "alaska",
        "az": "arizona",
        "ar": "arkansas",
        "ca": "california",
        "co": "colorado",
        "ct": "connecticut",
        "dc": "district of columbia",
        "de": "delaware",
        "fl": "florida",
        "ga": "georgia",
        "hi": "hawaii",
        "id": "idaho",
        "il": "illinois",
        "in": "indiana",
        "ia": "iowa",
        "ks": "kansas",
        "ky": "kentucky",
        "la": "louisiana",
        "me": "maine",
        "md": "maryland",
        "ma": "massachusetts",
        "mi": "michigan",
        "mn": "minnesota",
        "ms": "mississippi",
        "mo": "missouri",
        "mt": "montana",
        "ne": "nebraska",
        "nv": "nevada",
        "nh": "new hampshire",
        "nj": "new jersey",
        "nm": "new mexico",
        "ny": "new york",
        "nc": "north carolina",
        "nd": "north dakota",
        "oh": "ohio",
        "ok": "oklahoma",
        "or": "oregon",
        "pa": "pennsylvania",
        "pr": "puerto rico",
        "ri": "rhode island",
        "sc": "south carolina",
        "sd": "south dakota",
        "tn": "tennessee",
        "tx": "texas",
        "ut": "utah",
        "vi": "virgin islands",
        "vt": "vermont",
        "va": "virginia",
        "wa": "washington",
        "wv": "west virginia",
        "wi": "wisconsin",
        "wy": "wyoming"
    },

    preloadMe = [
        'img/social-media/facebook.png',
        'img/social-media/twitter.png',
        'img/social-media/pinterest.png',
        'img/social-media/email.png',
        'img/social-media/print.png',
        'img/social-media/facebook-active.png',
        'img/social-media/twitter-active.png',
        'img/social-media/pinterest-active.png',
        'img/social-media/email-active.png',
        'img/social-media/print-active.png'
    ],

    isOldIE,
    $load,
    $fail,
    $section,
    $header,
    loadTimeout,
    today,
    refreshPeriod /*IN DAYS*/ = 7,
    gaDimensions = {},
    gaCrumb = '/finearts/';

$(function() {
    $load = $('#load');
    $section = $('section');
    $fail = $('#fail');
    $header = $('#emuseum-header');
    $('#wrapper').show();
    load();
    ie();
    if (isOldIE === true) {
        return;
    }
    today = getDate(),
    helloDevs();
    preloadImages();
    gsaHeader();
    bindings();
    routes();

    /* CLEAR ALL CACHES
    localStorage['fineArtsDB_artistsCache'] = '';
    localStorage['fineArtsDB_galleriesCache'] = '';
    */

    $(window).hashchange(function() {
        $fail.hide();
        $section.hide();
        load();
        routes();
        if (typeof ga !== "undefined") {
            ga('send', 'pageview', '/fa/' + window.location.hash);
        }
    });
});

function helloDevs() {
    console.log(
        ' _______________________________________ \n' +
        '|                                       |\n' +
        "|       All JSON requests to GSA's      |\n" +
        '|      Fine Arts API will be logged     |\n' +
        '|          to the console below.        |\n' +
        '|_______________________________________|\n ');
}

function ie() {
    //Site is IE9 Compatible ONLY. No IE9 Compat, No IE8/7
    //if version token MSIE < 9, indicating older browser or browser mode
    var UA = navigator.userAgent;
    if(UA.indexOf('MSIE 7') > -1 || UA.indexOf('MSIE 8') > -1){
        $('#wrapper').hide();
        $('#compatibility-mode,#old-ie').append('<small style="color:#666">'+UA+'</small>');
        //if trident token === 5, indicating IE9
        if(UA.indexOf('Trident/5') > -1){
            $('#compatibility-mode').show();
        }
        else{
            $('#old-ie').show();
        }
        isOldIE = true;
        loaded();
    }
}

//ROUTING
function routes() {
    navHighlight();
    if (typeof ga !== "undefined") {
        reportGA();
    }
    //HOME PAGE
    if (window.location.hash === '' ||
        window.location.hash === '#' ||
        window.location.hash === '#/') {
        loadHomePage();
    }
    //ARTISTS INDEX
    else if (window.location.hash.indexOf('#/artists') !== -1) {
        loadArtists();
        navHighlight('artists');
    }
    //GALLERIES
    else if (window.location.hash.indexOf('#/galleries') !== -1) {
        loadGalleries();
        navHighlight('galleries');
    }
    //ABOUT
    else if (window.location.hash.indexOf('#/about-the-collection') !== -1) {
        loadAbout();
        navHighlight('about-the-collection');
    }
    //NEW DEAL ART
    else if (window.location.hash.indexOf('#/new-deal-art') !== -1) {
        loadNewDealArt();
        navHighlight('galleries');
    }
    //DISCLAIMER
    else if (window.location.hash.indexOf('#/disclaimer') !== -1) {
        loadDisclaimer();
    }
    //OVERVIEWS
    else if (window.location.hash.indexOf('#/artwork/') !== -1) {
        loadArtwork();
    } else if (window.location.hash.indexOf('#/artist/') !== -1) {
        loadArtist();
        navHighlight('artists');
    } else if (window.location.hash.indexOf('#/building/') !== -1) {
        loadBuilding();
    } else if (window.location.hash.indexOf('#/loan/') !== -1) {
        loadLoan();
    } else if (window.location.hash.indexOf('#/gallery') !== -1) {
        loadGallery();
        navHighlight('galleries');
    }
    //SEARCH RESULTS
    else if (window.location.hash.indexOf('#/results/artwork') !== -1) {
        var type = 'objects';
        loadResults(type);
        navHighlight('search');
    } else if (window.location.hash.indexOf('#/results/artists') !== -1) {
        var type = 'people';
        loadResults(type);
        navHighlight('search');
    } else if (window.location.hash.indexOf('#/results/buildings') !== -1) {
        var type = 'buildings';
        loadResults(type);
        navHighlight('search');
    }
    //SEARCH
    else if (window.location.hash.indexOf('#/search') !== -1) {
        loadSearch();
        navHighlight('search');
    }
    //LOCATION
    else if (window.location.hash.indexOf('#/location') !== -1) {
        loadLocation();
        navHighlight('location');
    } else if (window.location.hash.indexOf('#/scott') !== -1) {
        scott();
    } else {
        fail('404', 'Route Not Found. Please double check the URL and try again.')
    }
    $('html').focus();
}

//CLICKS
function bindings() {
    $('.menu-trigger').on('click', function() {
        $('header .menu').slideToggle();
    });
    $(window).on('resize', function() {
        if ($header.width() > 769) {
            $('header .menu').show()
        } else {
            $('header .menu').hide()
        }
    });
    $('header .menu a').on('click', function() {
        if ($header.width() < 769) {
            $('header .menu').slideToggle()
        }
    });
    $('.nav-search').on('click', function() {
        $('#search input[type=text]').val('');
        $('#search select :first-child').attr('selected', 'selected');
        $('#search #city').attr('disabled', 'disabled').html('<option value="">Select a State First</option>')
    });
    $('body').on('click', '.social-media .print', function(e) {
        window.print();
        e.preventDefault();
    });
    $.ajaxSetup({
        dataType: "jsonp",
        timeout: 90000,
        cache: true
    });

    $('.skip-content').on('click', function(e) {
        $(".nav-home").focus();
        $(this).blur();
        e.preventDefault();
    })
}

//NAV HIGHLIGHTER
function navHighlight(page) {
    if (page) {
        $('header .menu .nav-' + page).addClass('active');
    } else {
        $('header .menu a').removeClass('active');
    }
}

//HOME PAGE
function loadHomePage() {
    if ($(window).width() > 769) {
        animateSplash();
    }

    /*$('#splash > a').on('click',function(){
        var hash = $(this).attr('href');
        window.location.hash = hash;
    });*/
    loaded();
    $('#home').show();

    function animateSplash() {

        var play = true,
            order = [6, 2, 9, 4, 5, 7, 1, 10, 2, 11, 8, 3],
            interval = 800, //2000
            pause = 8000,
            fadeInTime = 900, //2500
            fadeOutTime = 900, //2500
            itemQueue = [],
            fadeOutQueue = [],
            rotateQueue,
            currentItem,
            fadeOutPartial = [2, 4, 7, 10],
            partialFadeVal = 0.33;


        //WAS RESPONSIVE SPLASH PAGE
        //$(window).on('resize',setSplashDimensions);

        /*function setSplashDimensions(){
            var splashHeight = $(window).height() - $('header').height() - $('footer').height() - $('#gsa-footer').height();
            var splashWidth = splashHeight/1.1;

            $('#splash').css({
                'height':splashHeight+'px',
                'width':'990px'
            });
        }*/

        rotate();

        $("#home #splash").hover(
            function() {
                //CANCEL ROTATION
                play = false;
                //CLEAR ALL ACTIVE TIMEOUTS
                for (i = 0; i < itemQueue.length; i++) {
                    clearTimeout(itemQueue[i])
                };
                for (i = 0; i < fadeOutQueue.length; i++) {
                    clearTimeout(fadeOutQueue[i])
                };
                clearTimeout(rotateQueue);
                //REORDER ARRAY - RESUME ROTATION
                var anustart = order.indexOf(currentItem);
                //COOOOOOINCIDENCE!
                var newOrder = [];

                for (i = anustart; i < order.length; i++) {
                    newOrder.push(order[i]);
                }
                for (i = 0; i < anustart; i++) {
                    newOrder.push(order[i])
                };

                order = newOrder;


            },
            function() {
                play = true;
                rotate();
            }
        );

        $('#home #splash > a').hover(
            function() {
                //BRING UP ITEM DETAILS, HIDE ALL OTHERS
                $(this).children('.splash-details').stop().animate({
                    opacity: 1
                }, 400).children('p').show();
                $(this).siblings().each(function(i) {
                    var delay = i * 25;
                    var fadeOutVal = 0;
                    if ($(this).hasClass('splash-fade-out-partial')) {
                        var fadeOutVal = partialFadeVal;
                    }
                    var fadeTo0 = function(el) {
                        $(el).children('.splash-details').stop().animate({
                            opacity: fadeOutVal
                        }, 50).children('p').hide();
                    }
                    setTimeout(fadeTo0, delay, this)
                });
            },
            function() {
                var fadeOutVal = 0;
                if ($(this).hasClass('splash-fade-out-partial')) {
                    var fadeOutVal = partialFadeVal;
                }
                $(this).children('.splash-details').stop().animate({
                    opacity: fadeOutVal
                }, 50).children('p').hide();
            }
        );

        $('#home #splash > a').focus(function() {
            //BRING UP ITEM DETAILS, HIDE ALL OTHERS
            $(this).children('.splash-details').stop().animate({
                opacity: 1
            }, 400).children('p').show();
            $(this).siblings().each(function(i) {
                var delay = i * 25;
                var fadeOutVal = 0;
                if ($(this).hasClass('splash-fade-out-partial')) {
                    var fadeOutVal = partialFadeVal;
                }
                var fadeTo0 = function(el) {
                    $(el).children('.splash-details').stop().animate({
                        opacity: fadeOutVal
                    }, 50).children('p').hide();
                }
                setTimeout(fadeTo0, delay, this)
            });
        })

        function rotate() {
            for (var i = 0; i < order.length; i++) {

                var item = order[i];

                function fade(item) {
                    if (play === true) {
                        currentItem = item;
                        //FADE TO ZERO FOR SOME ELEMENTS, NOT FOR OTHERS
                        var fadeOutVal = 0;
                        if (fadeOutPartial.indexOf(item) > -1) {
                            var fadeOutVal = partialFadeVal;
                        }
                        $('.splash-' + item + ' .splash-details').stop().animate({
                            opacity: 1
                        }, fadeInTime);
                        var fadeOut = setTimeout(function() {
                            if (play === true) {
        
                                $('.splash-' + item + ' .splash-details').stop().animate({
                                    opacity: fadeOutVal
                                }, fadeOutTime);
                            }
                        }, pause + fadeInTime);

                        fadeOutQueue.push(fadeOut);
                    }
                }

                itemQueue[i] = setTimeout(fade, i * interval, item);

                /*IE8 SUPPORT NO LONGER NECESSARY HERE:
                itemQueue[i] = setTimeout((function(item) {
                    return function() {
                        fade(item);
                    };
                })(item), i * interval);
                */

                if (i === order.length - 1) {
                    rotateQueue = setTimeout(function() {
                        rotate();
                    }, (interval * i) + pause);
                };
            }
        }
    };
}


function loadAbout() {
    $('#about-the-collection').show();
    loaded();
}

function loadNewDealArt() {
    $('#new-deal-art').show();
    $('.leftCol nav').stick_in_parent({
        parent: $('.row')
    });
    $('.leftCol nav h2').on('click', function() {
        var val = $(this).attr('id').replace('nav-', '');
        scrollToAnchor(val);
    });
    loaded();
}

function loadDisclaimer() {
    $('#disclaimer').show();
    loaded();
}

function loadSearch() {
    $('#search').show();
    loaded();

    //BIND SEARCH BUTTONS
    $('#search-for-artwork button').on('click', searchForArtwork);

    $('#search-for-artist button').on('click', searchForArtist);

    $('#search-for-buildings button').on('click', searchForBuildings);

    //PULL CITIES FOR SELECTED STATE
    $('#search').on('change', '#search-for-buildings-state', function() {
        if ($(this).val() === '') {
            $('#search-for-buildings-city').attr('disabled', 'disabled').html('<option value="">Select a State First</option>')
        } else {
            $('#search-for-buildings-city').attr('disabled', 'disabled').html('<option value="">Loading Cities...</option>').parent('.selectWrapper').addClass('loading');
            var state = $(this).val();
            $.ajax({
                    url: apiRoot + 'search/buildings?State=' + state + '&end=1000'
                })
                .success(function(json) {
                    results = json.results;
                    if (json.total_results === 0) {
                        noArtwork()
                    } else {
                        var cities = [];
                        for (i in results) {
                            if (cities.indexOf(results[i].city) === -1) {
                                cities.push(results[i].city)
                            }
                        }
                        if (cities[0] === undefined) {
                            noArtwork()
                        } else {
                            $('#search-for-buildings-city').html('<option value="">Select a City</option>')
                            for (i in cities) {
                                if (cities[i] !== undefined) {
                                    $('#search-for-buildings-city').append('<option value="' + cities[i] + '">' + cities[i] + '</option>')
                                }
                            }
                            $('#search-for-buildings-city').removeAttr('disabled').parent('.selectWrapper').removeClass('loading').removeClass('disabled');
                        }
                    }
                })
                .error(function(textStatus, error) {
                    noArtwork()
                });

            function noArtwork() {
                $('#search-for-buildings-city').html('<option value="">No Artwork Found</option>').parent('.selectWrapper').removeClass('loading').addClass('disabled');
            }
        }
    });

    //BIND ENTER KEY
    Mousetrap.bindGlobal(['enter'], function(e) {
        if ($('#search-for-artwork input[type=text]').is(":focus")) {
            searchForArtwork()
            pd()
        }
        if ($('#search-for-artist input[type=text]').is(":focus")) {
            searchForArtist()
            pd()
        }
        if ($('#search-for-buildings input[type=text]').is(":focus")) {
            searchForBuildings()
            pd()
        }

        function pd() {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                //INTERNET EXPLODER
                e.returnValue = false;
            }
        }
    });

    //BUILD SEARCH QUERIES
    function searchForArtwork() {
        var base = '#/results/artwork?keyword=';
        var keywords = $('#keywords-artwork').val().doorknob()
        window.location.href = base + keywords;
    };

    function searchForArtist() {
        var base = '#/results/artists?keyword=';
        var keywords = $('#keywords-artist').val().doorknob()
        window.location.href = base + keywords;
    };

    function searchForBuildings() {
        var base = '#/results/buildings?';
        var parameters = [];

        if ($('#search #building-name').val() !== '' && $('#search-for-buildings-building-name').val() !== undefined) {
            parameters.push('Building%20Name=' + $('#search-for-buildings-building-name').val().doorknob());
        }
        if ($('#search #state ').val() !== '' && $('#search-for-buildings-state').val() !== undefined) {
            parameters.push('State=' + $('#search-for-buildings-state').val());

        }
        if ($('#search #city').val() !== '' && $('#search-for-buildings-city').val() !== undefined) {
            parameters.push('City=' + $('#search-for-buildings-city').val());
        }

        window.location.href = base + parameters.join('&');
    };
};

function loadLocation() {

    $('#location').show();
    //RESET
    $('#state').val('');
    $("#map > svg > path").each(function() {
        $(this).css('fill', '');
    });
    $('#results-location').html('').hide()

    var mapWidth = $('#location').width();
    var mapHeight = mapWidth * 0.75;
    $('#map').css({
        width: mapWidth,
        height: mapHeight
    });
    $('#map').usmap({
        stateHoverAnimation: 0,
        stateStyles: {
            fill: '#C8E5F2',
            stroke: '#7C97AD'
        },
        stateHoverStyles: {
            fill: '#ea3239',
            stroke: '#911D21'
        },
        labelBackingStyles: {
            fill: '#C8E5F2',
            stroke: '#7C97AD'
        },
        labelTextStyles: {
            fill: 'black'
        },
        labelBackingHoverStyles: {
            fill: '#ea3239',
            stroke: '#911D21'
        },
        click: function(event, data) {
            $('#location #state option[value="' + data.name + '"]').attr("selected", "selected");
            //browseByState(data.name);
            if (Modernizr.history) {
                history.pushState({}, '', '/location/' + data.name)
            } else {
                window.location.hash = '/location/' + data.name;
            }

        },
        includeTerritories: ['PR', 'VI']
    });

    //LOCATION STATE
    var hash = window.location.hash.split('/');
    if (hash[2]) {
        var hashState = hash[2].toUpperCase();
        browseByState(hashState)
        loaded(false);
    } else {
        loaded();
    }

    $('#location').on('click', '#location-go', function() {
        //var stateMenu = $(this);
        var stateMenu = $('#state');
        $("#map > svg > path").each(function() {
            $(this).css('fill', '');
        });

        var state = stateMenu.val();
        if (state !== '') {
            $('#' + state).css('fill', 'red');
            if (Modernizr.history) {
                history.pushState({}, '', '/location/' + state)
            } else {
                window.location.hash = '/location/' + state;
            }
        } else {
            $('#results-location').html('').hide()
        }
    });

    function browseByState(state) {
        $('#location .selectWrapper').addClass('loading');
        $("#map > svg > path").each(function() {
            $(this).css('fill', '');
        });
        $('#' + state).css('fill', 'red');
        $('#location #results-location').html('').hide();
        var req = apiRoot + 'search/buildings?State=' + state + '&end=1000'
        console.log('JSON request: ' + req)
        $.ajax({
                url: req,
                jsonpCallback: randomJSONpCallback()
            })
            .success(function(json) {
                var results = []
                if (isArray(json.results)) {
                    results = results.concat(json.results)
                } else {
                    //console.log('is not Array')
                    results.push(json.results);
                }
                if (json.total_results === 0 || json === undefined) {
                    var html = '<h3>Buildings in ' + states[json.search_value[0].value.toLowerCase()].titleCase() + '<span style="float:right" class="label label-default label-danger">0</span></h3><h4>No Buildings Found</h4>'
                    $('#location #results-location').html(html).show();
                } else {
                    var locations = [];
                    for (i in results) {
                        var hasCity = false,
                            cityIndex = null;
                        for (j in locations) {
                            if (locations[j].city === results[i].city) {
                                hasCity = true;
                                cityIndex = j;
                            }
                        }
                        if (!hasCity) {
                            var city = {
                                city: results[i].city,
                                buildings: [
                                    results[i]
                                ]
                            };
                            locations.push(city);
                        } else {
                            if (cityIndex !== 'last') {
                                //IE PROBLEM
                                locations[cityIndex].buildings.push(results[i]);
                            }
                        }
                    }

                    for (i = 0; i < locations.length; i++) {
                        locations[i].buildings.sort(function(a, b) {
                            return a.building.toLowerCase().localeCompare(b.building.toLowerCase());
                        });
                    }

                    locations.sort(function(a, b) {
                        return a.city.toLowerCase().localeCompare(b.city.toLowerCase());
                    });
                    var state = states[results[0].state.toLowerCase()].titleCase();

                    var template = $('#templates .results-location').html();
                    var html = Mustache.to_html(template, {
                        locations: locations,
                        state: state,
                        total: json.total_results
                    });

                    $('#location #results-location').html(html).show();

                    $('.results-location-header').sticky();
                }
                $('#location .selectWrapper').removeClass('loading')
                scrollToAnchor('results-location');
            })
            .error(function(textStatus, error) {
                var html = '<h3>Buildings<span style="float:right" class="label label-default label-danger">0</span></h3><h4>Server Error: No Buildings Found</h4>';
                $('#location #results-location').html(html).show().scrollToAnchor();
                $('#location .selectWrapper').removeClass('loading')
            });
    }
}

//SEARCH RESULTS
function loadResults(type) {

    $('#results').html('');

    var hash = window.location.hash.split('?');

    var searchParams = hash[1];
    searchParams = searchParams.replace('&refine=false', '').replace('&scott=scott', '');

    fetchAllResults(type, searchParams, appendResults);
};

//ARTIST INDEX
function loadArtists() {
    //localStorage is populated
    if (localStorage['fineArtsDB_artistsCache']) {
        //DOM is populated
        if ($('#artists-index .alpha-heading').length === 26) {
            load('Refreshing artists from the Fine Arts Database', 30000)
            $('#artists').show();
            artistsReady();
            loaded();
            //DOM is not populated
        } else {
            $('#artists-index').html('')
            artistsCache = JSON.parse(localStorage['fineArtsDB_artistsCache'])
            if (today > (artistsCache.date + refreshPeriod * 86400)) {
                //console.log('ARTISTS: Old artistsCache, refreshing from API.')
                load('Refreshing artists from the Fine Arts Database', 30000)
                artistCache = artistsCacheTemplate;
                loadFromAPI()
                return;
            }
            artistsAppend(artistsCache);
            artistsReady();
        }
        //localStorage is not populated
    } else {
        $('#artists-index').html('')
        load('Loading artists from the Fine Arts Database', 30000)
            //console.log('ARTISTS: No artistsCache, pulling from API.')
        loadFromAPI()
    }

    function loadFromAPI() {
        function repeater(i) {
            var req = apiRoot + 'search/people?Index=' + alphaOrder[i] + '&end=1000';
            $.ajax({
                url: req,
                jsonpCallback: randomJSONpCallback()
            }).success(function(json) {
                artistsHandler(json);
                if (i < 25) {
                    repeater(i + 1);
                }
            }).error(function() {
                repeater(i);
            });
        }
        repeater(0);
    }
}

function artistsReady() {

    $('#artists').show();

    $('#artists-index li').each(function() {
        $(this).data('name', $(this).text().toLowerCase());
    });

    var firstRegex = new RegExp('([a-zA-Z])+( )+([a-zA-Z])+');
    //beginnings only
    var secondRegex = '\\b{{input}}';
    var thirdRegex = '\\s*(\\b{{first}}[a-z]*)\\s(\\b{{second}}[a-z]*)\\s*';
    var fourthRegex = '\\s*(\\b{{second}}[a-z]*)\\s(\\b{{first}}[a-z]*)\\s*';

    $('#filter').on('keyup', function() {

        delay(runFilter, 500);

        function runFilter() {
                $('#filter').addClass('loading');
                $('#artists-index').hide();
                var val = $('#filter').val().toLowerCase().replace(/[^a-zA-Z\d\s:]|[0-9\d:]/g, '');
                var filterRegex = firstRegex;
                var filterRegex2 = secondRegex;
                var filterRegex3 = thirdRegex;
                var filterRegex4 = fourthRegex;
                if (filterRegex.test(val)) {
                    val = val.replace(/ +(?= )/g, '');
                    valarray = val.split(' ');
                    filterRegex3 = filterRegex3.replace(/\{\{first\}\}/g, valarray[0]).replace(/\{\{second\}\}/g, valarray[1]);
                    filterRegex4 = filterRegex4.replace(/\{\{first\}\}/g, valarray[0]).replace(/\{\{second\}\}/g, valarray[1]);
                    filterRegex3 = new RegExp(filterRegex3, 'i');
                    filterRegex4 = new RegExp(filterRegex4, 'i');
                    $('#artists-index .artist').each(function() {
                        if (filterRegex3.test($(this).data('name')) || filterRegex4.test($(this).data('name'))) {
                            $(this).removeClass('filter-hidden');
                        } else {
                            $(this).addClass('filter-hidden');
                        }
                    });
                    showHideHeadings()
                } else {
                    if (val.replace('/ /g', '') === '') {
                        $('#artists-index .artist').removeClass('filter-hidden');
                        showHideHeadings()
                    } else {
                        filterRegex2 = filterRegex2.replace(/\{\{input\}\}/g, val.replace(/ /g, ''));
                        filterRegex2 = new RegExp(filterRegex2);
                        $('#artists-index .artist').each(function() {
                            if (filterRegex2.test($(this).data('name'))) {
                                $(this).removeClass('filter-hidden');
                            } else {
                                $(this).addClass('filter-hidden');
                            }
                        });
                        showHideHeadings()
                    }
                }

                function showHideHeadings() {
                    $('#artists-index .alpha-heading').each(function() {
                        if ($(this).find('.artist:not(.filter-hidden)').length === 0) {
                            $(this).addClass('filter-hidden');
                        } else {
                            $(this).removeClass('filter-hidden');
                        }
                    });
                    if ($('#artists-index').find('.alpha-heading:not(.filter-hidden)').length === 0) {
                        $('#artists-index .heading-none').removeClass('filter-hidden')
                    } else {
                        $('#artists-index .heading-none').addClass('filter-hidden')
                    }
                    $('#filter').removeClass('loading');
                }
                $('#artists-index').show(0);
            }
    });

    loaded()

    //BROWSE WITH SELECT MENU
    $('#selectAlphaWrapper select').change(function() {
        var val = $(this).val();
        scrollToAnchor(val, -200)
    });
    $('#artists-search').sticky();
}

//GALLERIES
function loadGalleries() {
    //IF IN MEMORY
    if (galleriesCache.galleries !== null) {
        galleriesHandler(galleriesCache);
    } else {
        //IF IN LOCALSTORAGE
        if (localStorage['fineArtsDB_galleriesCache']) {
            galleriesCache = JSON.parse(localStorage['fineArtsDB_galleriesCache']);
            if (today > (galleriesCache.date + refreshPeriod*86400) ) {
                load('Refreshing galleries from the Fine Arts Database');
                loadFromAPI();
                return;
            }
            galleriesHandler(galleriesCache);
        } else {
            //IF NEITHER
            load('Loading galleries from the Fine Arts Database');
            loadFromAPI();
        }
    }

    function loadFromAPI() {
        var req = apiRoot + 'collections/all';
        console.log('JSON request: ' + req)
        $.ajax({
            url: req,
            jsonpCallback: randomJSONpCallback()
        }).success(function(json) {
            galleriesCache = json.results;
            galleriesHandler(galleriesCache);
            localStorage.setItem('fineArtsDB_galleriesCache', JSON.stringify(galleriesCache));
        }).error(function() {
            fail()
        });
    }
};

function galleriesHandler(galleries) {
    for (i in galleries) {
        if (galleries[i].fileName) {
            galleries[i].fileName = formatImagePath(galleries[i].fileName);
        }
    }
    galleries.sort(function(a, b) {
        return a.collection.toLowerCase().localeCompare(b.collection.toLowerCase());
    });
    for (i in galleries) {
        galleries[i].primaryImage = galleries[i].primaryImage
    }
    var template = $('#templates .galleries').html();
    var html = Mustache.to_html(template, {
        galleries: galleries
    })
    $('#galleries').html(html).show();
    loaded();
}

//GALLERY DETAIL
function loadGallery() {

    //GALLERY ID
    var hash = window.location.hash.split('/');
    var objID = hash[2];

    //IF IN MEMORY
    if (galleriesCache.galleries !== null) {
        var gallery = galleriesCache.filter(function(obj) {
            return obj.id == objID;
        });
        galleryHandler(gallery[0]);
    } else {
        //IF IN LOCALSTORAGE
        if (localStorage['fineArtsDB_galleriesCache']) {
            galleriesCache = JSON.parse(localStorage['fineArtsDB_galleriesCache']);
            if (today > galleriesCache.date) {
                jsonTime();
            } else {
                var gallery = galleriesCache.filter(function(obj) {
                    return obj.id == objID;
                });
                galleryHandler(gallery[0]);
            }
        } else {
            //IF NEITHER, ITS JSON TIME
            jsonTime();
        }
    }

    function jsonTime() {
        var req = apiRoot + 'collections/all';

        console.log('JSON request: ' + req)

        $.ajax({
                url: req,
                jsonpCallback: randomJSONpCallback()
            })
            .success(function(json) {

                galleriesCache = json.results;
                localStorage.setItem('fineArtsDB_galleriesCache', JSON.stringify(galleriesCache));

                var gallery = galleriesCache.filter(function(obj) {
                    return obj.id == objID;
                });
                galleryHandler(gallery[0]);
            })
            .error(function() {
                fail()
            });
    }
}

function galleryHandler(gallery) {
    if (!isArray(gallery.Objects)) {
        var obj = gallery.Objects;
        gallery.Objects = [];
        gallery.Objects.push(obj)
    }

    var totalImages = 0;
    for (i in gallery.Objects) {
        if (gallery.Objects[i].primaryImage) {
            gallery.Objects[i].primaryImage = formatImagePath(gallery.Objects[i].primaryImage);
            totalImages += 1;
        }
    }

    var total = gallery.Objects.length;

    var works = gallery.Objects

    var worksNoImage = works.filter(hasntImage);

    works = works.filter(hasImage);

    works = works.sort(function(a, b) {
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    });

    worksNoImage = worksNoImage.sort(function(a, b) {
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    });

    works = works.concat(worksNoImage);


    var template = $('#templates .gallery').html();
    var html = Mustache.to_html(template, {
        gallery: gallery,
        total: total,
        totalImages: totalImages,
        galleryObjects: works
    });
    $('#gallery').html(html).show();
    $('.leftCol nav h2').on('click', function() {
        if ($(this).attr('id')) {
            var val = $(this).attr('id').replace('nav-', '');
            scrollToAnchor(val);
        }
    });
    $('.leftCol nav').stick_in_parent({
        parent: $('.row')
    });
    loaded();
}

//ARTWORK DETAIL
function loadArtwork() {

    var hash = window.location.hash.split('/');

    var objID = hash[2];

    var req = apiRoot + 'id/objects/' + objID;

    if (isNaN(parseInt(objID))) {
        fail('This Request is Not Valid.', 'Artwork ID must be a number, and should look like this: #/artwork/3606.')
    } else {
        console.log('JSON request: ' + req)
        $.ajax({
                url: req,
                jsonpCallback: randomJSONpCallback()
            })
            .success(function(json) {
                artwork = json.results;
                if (json.total_results === 0) {
                    fail("We're Sorry", 'This Artwork Could Not Be Found');
                } else {
                    var template = $('#templates .artwork').html();

                    //TEXT TYPE INTERPRETATION
                    if (artwork.ObjTextEntries) {
                        if (isArray(artwork.ObjTextEntries)) {
                            var interpretation = artwork.ObjTextEntries.filter(function(obj) {
                                return obj.textType == 'Interpretation';
                            });
                            if (interpretation.length > 0) {
                                interpretation = interpretation[0].textEntry;
                            }
                        } else {
                            if (artwork.ObjTextEntries.textType === 'Interpretation') {
                                var interpretation = artwork.ObjTextEntries.textEntry;
                            }
                        }
                    }


                    //RELATED ARTWORK
                    var artistRelated = [],
                        siteRelated = [],
                        collectionRelated = [];

                    if (artwork.artistRelatedObjects) {
                        if (!isArray(artwork.artistRelatedObjects)) {
                            var aro = artwork.artistRelatedObjects;
                            artwork.artistRelatedObjects = [];
                            artwork.artistRelatedObjects.push(aro);
                        }
                        artistRelated = artwork.artistRelatedObjects;
                    }

                    if (artwork.siteRelatedObjects) {
                        if (!isArray(artwork.siteRelatedObjects)) {
                            var sro = artwork.siteRelatedObjects;
                            artwork.siteRelatedObjects = [];
                            artwork.siteRelatedObjects.push(sro);
                        }
                        siteRelated = artwork.siteRelatedObjects;
                    }

                    if (artwork.Collections) {
                        if (!isArray(artwork.Collections)) {
                            var c = artwork.Collections;
                            artwork.Collections = [];
                            artwork.Collections.push(c);
                        }
                        for (i in artwork.Collections) {
                            if (!isArray(artwork.Collections[i].objects)) {
                                var aco = artwork.Collections[i].objects;
                                artwork.Collections[i].objects = [];
                                artwork.Collections[i].objects.push(aco);
                            }
                            collectionRelated.concat(artwork.Collections[i].objects)
                        }
                    }

                    //CONCAT INTO ONE ARRAY
                    var relatedWorks = [];
                    relatedWorks = relatedWorks.concat(artistRelated, siteRelated, collectionRelated);
                    if (relatedWorks.length > 0) {
                        //REMOVE THOSE WITHOUT IMAGES
                        relatedWorks = relatedWorks.filter(hasImage);
                    }
                    if (relatedWorks.length > 8) {
                        relatedWorks.splice(8, relatedWorks.length)
                    }
                    relatedWorks.sort(function(a, b) {
                        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
                    });
                    var hasRelated = (relatedWorks.length > 0);
                    if (artwork.ObjMedia) {
                        var additional = [];
                        if (!isArray(artwork.ObjMedia)) {
                            if (artwork.ObjMedia.primaryDisplay === 1) {
                                additional = null;
                            }
                        } else {
                            for (i in artwork.ObjMedia) {
                                if (artwork.ObjMedia[i].primaryDisplay !== 1) {
                                    additional.push(artwork.ObjMedia[i]);
                                }
                            }
                        }
                        var hasAdditional = (artwork.ObjMedia.length > 0);
                    }

                    //FORMAT IMAGE FILENAMES
                    if (hasRelated) {
                        for (i in relatedWorks) {
                            if (relatedWorks[i].primaryImage) {
                                relatedWorks[i].primaryImage = formatImagePath(relatedWorks[i].primaryImage);
                            }
                        }
                    }

                    if (hasAdditional) {
                        for (i in additional) {
                            if (additional[i].fileName) {
                                additional[i].fileName = formatImagePath(additional[i].fileName);
                            }
                        }
                    }

                    if (artwork.primaryImage) {
                        artwork.primaryImage = formatImagePath(artwork.primaryImage);
                    } else {
                        if (hasAdditional) {
                            artwork.primaryImage = formatImagePath(additional[0].fileName);
                            additional.splice(0, 1);
                        }
                    }

                    if (artwork.Collections && artwork.Collections.length > 0) {
                        var isInCollections = true;
                    }

                    //PULL ARTIST ID FROM OBJPEOPLE
                    var objPeople = artwork.ObjectsPeople;
                    for (i = 0; i < objPeople.length; i++) {
                        if (objPeople[i].role === 'Artist') {
                            var artistID = objPeople[i].personId;
                        }
                    }
                    if (additional) {
                        additional.sort(function(a, b) {
                            return a.rank - b.rank;
                        })
                    }

                    //PHOTOCAPTION is PUBLICCAPTION
                    var photoCaption = null;
                    //and PHOTOCREDIT is COPYRIGHT
                    var photoCredit = null;
                    if (artwork.ObjMedia) {
                        if (isArray(artwork.ObjMedia)) {
                            for (i in artwork.ObjMedia) {
                                if (artwork.ObjMedia[i].primaryDisplay == 1) {
                                    if (artwork.ObjMedia[i].copyright) {
                                        photoCredit = artwork.ObjMedia[i].copyright;
                                    }
                                    if (artwork.ObjMedia[i].publicCaption) {
                                        photoCaption = artwork.ObjMedia[i].publicCaption;
                                    }
                                }
                            }
                        } else {
                            if (artwork.ObjMedia.primaryDisplay == 1) {
                                photoCredit = artwork.ObjMedia.copyright;
                            }
                        }
                    }
                    //add line breaks for HTML
                    if (artwork.creditLine) {
                        artwork.creditLine = artwork.creditLine.replace(/(?:\r\n|\r|\n)/g, '<br/>');
                    }

                    //temp
                    console.log(artwork)
                    console.log(artwork.artistId)

                    //SOCIAL MEDIA
                    var wlh = encodeURIComponent(window.location.href);
                    var imagePath = 'http://gsa.gov/fa/images/display/' + artwork.primaryImage;
                    var socialMedia = {}
                    socialMedia.facebook = 'http://www.facebook.com/sharer/sharer.php?u=' + wlh;
                    socialMedia.twitter = 'http://twitter.com/share?text=' + encodeURIComponent(artwork.title) + ' by ' + encodeURIComponent(artwork.artist) + '&url=' + wlh + '&hashtags=GSAfinearts';
                    socialMedia.pinterest = 'http://pinterest.com/pin/create/button/?url=' + wlh + '&media=' + imagePath + '&description=' + artwork.title + ' by ' + artwork.artist;
                    socialMedia.email = 'mailto:?subject=' + encodeURIComponent('Fine Arts: ') + encodeURIComponent(artwork.title) + ' by ' + encodeURIComponent(artwork.artist) + '&body=' + encodeURIComponent("I've shared a link to GSA Fine Arts: ") + '%0D%0D' + wlh;
                    var html = Mustache.to_html(template, {
                        artwork: artwork,
                        interpretation: interpretation,
                        related: relatedWorks,
                        hasRelated: hasRelated,
                        additional: additional,
                        hasAdditional: hasAdditional,
                        socialMedia: socialMedia,
                        isInCollections: isInCollections,
                        artistID: artistID,
                        photoCredit: photoCredit,
                        photoCaption: photoCaption
                    });
                    $('#artwork').html(html).show();

                    $('.leftCol nav').stick_in_parent({
                        parent: $('.row')
                    });
                    $('.leftCol nav h2').on('click', function() {
                        if ($(this).attr('id')) {
                            var val = $(this).attr('id').replace('nav-', '');
                            scrollToAnchor(val);
                        }
                    });
                    //SWAP FEATURED IMAGE AREA ON CLICK
                    $('#additional-images a').on('click', function(event) {
                        var display = $(this).attr('href');
                        var large = display.replace('/display', '/large');
                        $('img.featured').attr('src', display).parent('a').attr('href', large);
                        $('.click-to-enlarge').attr('href', large);
                        //Replace Credit and Caption Notes
                        if ($(this).attr('data-credit')) {
                            console.log($(this).attr('data-credit'))
                            $('.photo-credit span').html($(this).attr('data-credit')).parent().show();
                        } else {
                            $('.photo-credit').hide();
                        }
                        if ($(this).attr('data-caption')) {
                            console.log($(this).attr('data-caption'))
                            $('.photo-caption span').html($(this).attr('data-caption')).parent().show();
                        } else {
                            $('.photo-caption').hide()
                        }
                        $('#artwork-overview').scrollToAnchor();
                        event.preventDefault();
                    });

                    loaded();
                }
            })
            .error(function() {
                fail()
            });
    }
}

//ARTIST DETAIL
function loadArtist() {

    var hash = window.location.hash.split('/');

    var artistID = hash[2];

    var req = apiRoot + 'id/people/' + artistID;

    if (isNaN(parseInt(artistID))) {
        fail('This Request is Not Valid.', 'Artist ID must be a number, and should look like this: #/artist/3606.')
    } else {

        console.log('JSON request: ' + req)

        $.ajax({
                url: req,
                jsonpCallback: randomJSONpCallback()
            })
            .success(function(json) {
                artist = json.results;
                if (json.total_results === 0) {
                    $('#artist').show();
                    fail("We're Sorry", 'This Artist Could Not Be Found');
                } else {

                    //RELATED ARTWORK
                    var works = artist.Objects;
                    if (artist.PeopleTextEntries) {
                        var pte = artist.PeopleTextEntries;
                        //Is PTE an object (1 result only), or an array (multiple results)
                        if (isArray(pte)) {
                            for (i in pte) {
                                if (pte[i].textType.indexOf('Web') > -1) {
                                    var artistInfo = pte[i].textEntry;
                                }
                            }
                        } else {
                            if (pte.textType.indexOf('Web') > -1) {
                                var artistInfo = pte[i].textEntry;
                            }
                        }
                    }
                    //GAH
                    if (!isArray(works)) {
                        var work = works;
                        var works = [];
                        works.push(work);
                    }

                    var worksNoImage = works.filter(hasntImage);

                    works = works.filter(hasImage);

                    works = works.sort(function(a, b) {
                        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
                    });

                    worksNoImage = worksNoImage.sort(function(a, b) {
                        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
                    });

                    works = works.concat(worksNoImage);


                    for (i in works) {
                        if (works[i].primaryImage) {
                            works[i].primaryImage = formatImagePath(works[i].primaryImage);
                        }
                    }
                    var totalWorks = works.length;
                    var template = $('#templates .artist').html();
                    var html = Mustache.to_html(template, {
                        artist: artist,
                        works: works,
                        artistInfo: artistInfo,
                        totalWorks: totalWorks
                    });
                    $('#artist').html(html).show();

                    $('.leftCol nav').stick_in_parent({
                        parent: $('.row')
                    });
                    $('.leftCol nav h2').on('click', function() {
                        var val = $(this).attr('id').replace('nav-', '');
                        scrollToAnchor(val);
                    });
                    loaded();
                }
            })
            .error(function() {
                fail()
            });
    }
}

//BUILDING DETAIL
function loadBuilding() {

    var hash = window.location.hash.split('/');

    var buildingID = hash[2];

    var req = apiRoot + 'id/buildings/' + buildingID;

    console.log('JSON request: ' + req)

    if (isNaN(parseInt(buildingID))) {
        fail('This Request is Not Valid.', 'Building ID must be a number, and should look like this: #/building/3606.')
    } else {
        $.ajax({
                url: req,
                jsonpCallback: randomJSONpCallback()
            })
            .success(function(json) {
                building = json.results;
                if (json.total_results === 0) {
                    fail("We're Sorry", 'This Building Could Not Be Found');
                } else {
                    var building = json.results;
                    if (building.primaryImage) {
                        building.primaryImage = formatImagePath(building.primaryImage);
                    }

                    //RELATED ARTWORK
                    if (isArray(building.Objects)) {
                        var works = building.Objects;
                    } else {
                        var works = [];
                        if (building.Objects) {
                            works.push(building.Objects);
                        }
                    }
                    var worksLength = works.length;
                    if (worksLength > 1) {
                        var worksNoImage = works.filter(hasntImage);

                        works = works.filter(hasImage);

                        works = works.sort(function(a, b) {
                            return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
                        });

                        worksNoImage = worksNoImage.sort(function(a, b) {
                            return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
                        });

                        works = works.concat(worksNoImage);
                    }
                    if (worksLength > 0) {
                        var hasWorks = true;
                        for (i in works) {
                            if (works[i].primaryImage) {
                                works[i].primaryImage = formatImagePath(works[i].primaryImage);
                            }
                        }
                    }
                    //PHOTO CREDIT
                    var photoCredit = null;
                    if (building.SiteMedia) {
                        if (isArray(building.SiteMedia)) {
                            for (i in building.SiteMedia) {
                                console.log(building.SiteMedia[i].copyright)
                                if (building.SiteMedia[i].primaryDisplay == 1) {
                                    photoCredit = building.SiteMedia[i].copyright;
                                }
                            }
                        } else {
                            if (building.SiteMedia.primaryDisplay == 1) {
                                photoCredit = building.SiteMedia.copyright;
                            }
                        }
                    }

                    //TEXT TYPE INTERPRETATION
                    if (building.SiteTextEntries) {
                        if (isArray(building.SiteTextEntries)) {
                            var interpretation = building.SiteTextEntries.filter(function(obj) {
                                return obj.textType == 'Interpretation';
                            });
                            if (interpretation.length > 0) {
                                interpretation = interpretation[0].textEntry /*.replace(/<[^>]*>/gi, "")*/ ;
                            }
                        } else {
                            if (building.SiteTextEntries.textType === 'Interpretation') {
                                var interpretation = building.SiteTextEntries.textEntry /*.replace(/<[^>]*>/gi, "")*/ ;
                            }
                        }
                    }

                    //TEXT TYPE WEB BIO
                    if (building.SiteTextEntries) {
                        if (isArray(building.SiteTextEntries)) {
                            var webBio = building.SiteTextEntries.filter(function(obj) {
                                return obj.textType == "Web bio";
                            });
                            if (webBio.length > 0) {
                                webBio = webBio[0].textEntry /*.replace(/<[^>]*>/gi, "")*/ ;
                            }
                        } else {
                            if (building.SiteTextEntries.textType === "Web bio") {
                                var webBio = building.SiteTextEntries.textEntry /*.replace(/<[^>]*>/gi, "")*/ ;
                            }
                        }
                    }


                    var template = $('#templates .building').html();
                    var html = Mustache.to_html(template, {
                        building: building,
                        works: works,
                        hasWorks: hasWorks,
                        worksLength: worksLength,
                        photoCredit: photoCredit,
                        interpretation: interpretation,
                        webBio: webBio
                    });
                    $('#building').html(html).show();

                    $('.leftCol nav').stick_in_parent({
                        parent: $('.row')
                    });
                    $('.leftCol nav h2').on('click', function() {
                        var val = $(this).attr('id').replace('nav-', '');
                        scrollToAnchor(val);
                    });

                    loaded();
                }
            })
            .error(function() {
                fail()
            });
    }
}

//LOAN DETAIL
function loadLoan() {

    var hash = window.location.hash.split('/');

    var buildingID = hash[2];

    var req = apiRoot + 'id/loans/' + buildingID;

    console.log('JSON request: ' + req)

    if (isNaN(parseInt(buildingID))) {
        fail('This Request is Not Valid.', 'Building ID must be a number, and should look like this: #/building/3606.')
    } else {
        $.ajax({
                url: req,
                jsonpCallback: randomJSONpCallback()
            })
            .success(function(json) {
                building = json.results;
                if (json.total_results === 0) {
                    fail("We're Sorry", 'This Building Could Not Be Found');
                } else {
                    var building = json.results;
                    if (building.primaryImage) {
                        building.primaryImage = formatImagePath(building.primaryImage);
                    }

                    //RELATED ARTWORK
                    if (isArray(building.Objects)) {
                        var works = building.Objects;
                    } else {
                        var works = [];
                        if (building.Objects) {
                            works.push(building.Objects);
                        }
                    }
                    var worksLength = works.length;
                    if (worksLength > 1) {

                        var worksNoImage = works.filter(hasntImage);

                        works = works.filter(hasImage);

                        works = works.sort(function(a, b) {
                            return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
                        });

                        worksNoImage = worksNoImage.sort(function(a, b) {
                            return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
                        });

                        works = works.concat(worksNoImage);
                    }
                    if (worksLength > 0) {
                        var hasWorks = true;
                        for (i in works) {
                            if (works[i].primaryImage) {
                                works[i].primaryImage = formatImagePath(works[i].primaryImage);
                            }
                        }
                    }
                    //PHOTO CREDIT
                    var photoCredit = null;
                    if (building.SiteMedia) {
                        if (isArray(building.SiteMedia)) {
                            for (i in building.SiteMedia) {
                                console.log(building.SiteMedia[i].copyright)
                                if (building.SiteMedia[i].primaryDisplay == 1) {
                                    photoCredit = building.SiteMedia[i].copyright;
                                }
                            }
                        } else {
                            if (building.SiteMedia.primaryDisplay == 1) {
                                photoCredit = building.SiteMedia.copyright;
                            }
                        }
                    }

                    var template = $('#templates .loan').html();
                    var html = Mustache.to_html(template, {
                        building: building,
                        works: works,
                        hasWorks: hasWorks,
                        worksLength: worksLength,
                        photoCredit: photoCredit
                    });
                    $('#building').html(html).show();

                    $('.leftCol nav').stick_in_parent({
                        parent: $('.row')
                    });
                    $('.leftCol nav h2').on('click', function() {
                        var val = $(this).attr('id').replace('nav-', '');
                        scrollToAnchor(val);
                    });

                    loaded();
                }
            })
            .error(function() {
                fail()
            });
    }
}



//ROUTE HELPERS

//FETCHES all results for a search query, then routes them
function fetchAllResults(searchType, searchParams, handler) {

    var req = apiRoot + 'search/' + searchType + '?' + searchParams;
    if (req.indexOf('&end') === -1) {
        req += '&end=1000'
    }

    console.log('JSON request: ' + req)

    $.ajax({
            url: req,
            jsonpCallback: randomJSONpCallback()
        })
        .success(function(json) {
            handler(json, searchType);
        })
        .error(function() {
            fail()
        });
};

//CACHES all artists, Saves as local storage
function artistsHandler(json) {
    for (var i = 0; i < json.results.length; i++) {
        var item = json.results[i];
        addValue(artistsCache.artists, item.index.toLowerCase(), item);
    };
    if (!artistsCache.status) {
        artistsCache.status = [];
    }
    artistsCache.status.push(json.results[0].index);
    if (artistsCache.status.length === 26) {
        artistsCache.date = getDate();
        delete artistsCache.status;
        artistsAppend(artistsCache);
        var stringified = JSON.stringify(artistsCache);
        localStorage.setItem('fineArtsDB_artistsCache', stringified);
    }
}

//APPENDS artists to Artist Index, and preps next letter append on scroll function.
function artistsAppend(source) {
    $('#fail,#load').hide();
    var artists = source.artists;
    for (var i = 0; i < Object.size(source.artists); i++) {
        $('#artists #artists-index').show().append('<div class="alpha-heading" id="' + artists[alphaOrder[i]][0].index.toLowerCase() + '"><h3>' + artists[alphaOrder[i]][0].index + '</h3><small><a href="#" class="go-to-filter">(Filter)</a></small><ul></ul>')
        for (var j = 0; j < artists[alphaOrder[i]].length; j++) {
            if (artists[alphaOrder[i]][j].lastName && artists[alphaOrder[i]][j].firstName) {
                var name = '<strong>' + artists[alphaOrder[i]][j].lastName + '</strong> ' + artists[alphaOrder[i]][j].firstName;
            } else {
                var name = '<strong>' + artists[alphaOrder[i]][j].displayName + '</strong>';
            }
            $('#artists #' + alphaOrder[i] + ' ul').append('<li class="artist"><a href="' + '#/artist/' + artists[alphaOrder[i]][j].id + '">' + name + '</a></li>');
        };
        if (i === 25) {
            $('#artists #artists-index').append('<div class="heading-none filter-hidden"><h3>No Results</h3></div>')
            artistsReady();
        }
    };
    $('.go-to-filter').click(function(e) {
        $('#filter').focus();
        e.preventDefault();
    })
}


/*CACHES any result -- UNUSED
function cacheResults(item) {
  resultsCache.push(item);
}*/

//APPENDS search results
function appendResults(json, type) {
    if (json.results && json.results.length !== 0) {
        if (isArray(json.results)) {
            var results = json.results;
        } else {
            var results = [];
            results.push(json.results);
        }
        //SORT RESULTS WITH IMAGES FIRST
        if (results.length > 1) {
            if (type === 'objects') {
                results.sort(imagesFirst);
                //SORT ALPHA BY TITLE
                results = results.sort(function(a, b) {
                    if (a.title && b.title) {
                        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
                    }
                });
            }
            if (type === 'people') {
                results = results.sort(function(a, b) {
                    if (a.lastName && b.lastName) {
                        return a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase());
                    }
                });
            }
            if (type === 'buildings') {
                for (i in results) {
                    if (results[i].building == undefined) {
                        results.splice(i, 1)
                    }
                }
                results = results.sort(function(a, b) {
                    if (a.building && b.building) {
                        return a.building.toLowerCase().localeCompare(b.building.toLowerCase());
                    }
                });

            }
        }
    } else {
        $('#results').html('<h1>Search Results</h1><h2>No Results Found.</h2>').show();
        loaded();

        var type = 'none';
    }
    //GET SEARCH PARAMETERS AS OBJECT
    var searchParams = window.location.hash.split('?')[1].split("&").map(function(n) {
        return n = n.split("="), this[n[0]] = n[1], this
    }.bind({}))[0];

    var yourQuery = '';

    console.log('buildingname', searchParams['Building%20Name'])
        //BUILD STRING SUMMARY FOR QUERY...BUILDINGS FIRST
    if (searchParams['Building%20Name'] && searchParams.City && searchParams.State) {
        yourQuery = '"' + searchParams['Building%20Name'] + '" in ' + searchParams.City + ', ' + searchParams.State;
    }
    if (!searchParams['Building%20Name'] && searchParams.City && searchParams.State) {
        yourQuery = searchParams.City + ', ' + searchParams.State;
    }
    if (!searchParams['Building%20Name'] && !searchParams.City && searchParams.State) {
        yourQuery = states[searchParams.State.toLowerCase()].titleCase();
    }
    if (searchParams['Building%20Name'] && !searchParams.City && searchParams.State) {
        yourQuery = '"' + searchParams['Building%20Name'] + '" in ' + states[searchParams.State.toLowerCase()].titleCase();
    }
    if (searchParams['Building%20Name'] && !searchParams.City && !searchParams.State) {
        yourQuery = '"' + searchParams['Building%20Name'] + '"'
    }
    //ALL OTHER SEARCHES
    if (searchParams.keyword) {
        yourQuery = '"' + searchParams.keyword + '"'
    }

    yourQuery = yourQuery.replace(/%20/g, ' ')

    var totalImages = 0;
    //FORMAT IMAGE PATHS
    for (i in results) {
        if (results[i].primaryImage) {
            results[i].primaryImage = formatImagePath(results[i].primaryImage);
            totalImages += 1;
        }
    }

    var highEnd = 200;

    var totalResults = results.length;

    if (totalResults > highEnd && window.location.hash.indexOf('&refine=false') === -1) {
        var over9000 = true;
    }
    if (window.location.hash.indexOf('&scott=scott') > -1) {
        scott()
    }

    var template = $('#templates .results-' + type).html();
    var html = Mustache.to_html(template, {
        results: results,
        total: totalResults,
        over9000: over9000,
        highEnd: highEnd,
        yourQuery: yourQuery
    });

    $('#results').html(html).show();
    loaded();

    $('#results h1').sticky();
}

//LOAD WITH TIMEOUT
function load(message, timeout) {
    clearTimeout(loadTimeout);

    if (message) {
        $load.text(message)
    }
    if (!timeout) {
        var timeout = 90000;
    }
    $fail.hide();
    $section.hide();
    $load.show();
    loadTimeout = setTimeout(fail, timeout);
}

function loaded(scroll) {
    clearTimeout(loadTimeout);
    $load.hide().html('');
    if (scroll != false) {
        scrollToAnchor('wrapper', 0, 0)
    }
}



//ERROR REPORT
function fail(message, description) {
    if (message === undefined) {
        var message = "We're Sorry";
    }
    if (description === undefined) {
        var description = 'An error has occured. Please try again.';
    }
    $('#fail').html('').append('<h3>' + message + '</h3>').append('<p>' + description + '</p>').show();
    $('#load,section').hide();
};
