function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // Google Streetview request
    var street = $('#street').val();
    var city = $('#city').val();
    var address = street+', '+city;
    
    $greeting.text('So, you want to live at ' + address + '?');

    var streetviewUrl = 'http://maps.googleapis.com/maps/api/' + 
                        'streetview?size=600x450&location=' + address; 
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');
    
    // NYTimes Ajax request
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' +
                    city + '&sort=newest&api-key=2f65195b7b404009be295d918b36c931';
    
    $.getJSON(nytimesUrl, function (data) {
        $nytHeaderElem.text('New York Times Articles About ' + city);
        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' + '<a href="' + 
                            article.web_url+'">' + article.headline.main + 
                            '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
        }
    }).fail(function(e){
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded')
    });

    // Wikipedia Ajax request
    var wikipediaUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + 
                        city + '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text('Failed To Get Wikipedia Resources');
    }, 8000);

    $.ajax({
        url: wikipediaUrl,
        dataType: 'jsonp',
        success: function (response) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };
            
            clearTimeout(wikiRequestTimeout);        
        }
    });
    return false;
};

$('#form-container').submit(loadData);
