angular.module('OMDBFilmsModule', ['FilmModel', 'StorageModule'])

.constant('filmNames',
    [
        'the martian',
        'interstellar',
        'star wars episode VII',
        'jupiter ascending',
        'batman v superman',
        'moonwalkers',
        'independence day Resurgence',
        'star trek beyond',
        'The Space Between Us',
        'Rogue One: A Star Wars Story'               
    ]
)

.constant('omdbApi', ( function(){
    var namePlaceholder = '[namePlaceholder]';
    
    return {
        url: 'http://www.omdbapi.com/?t=' + namePlaceholder + '&y=&plot=short&r=json',
        namePlaceholder: namePlaceholder
    }

})()
)


.factory('FilmsService', function($http, $q, filmNames, omdbApi, Film, storageService){
    
    //service and data members
    var filmsService = {};
    filmsService.films = [];
    filmsService.selectedFilm = null;
    
    //try to retrieve items from storage
    var storedItems = storageService.getItem("films");
    if(storedItems){
        filmsService.films = Film.fromJsonBunch(storedItems);
    }    

    
    //private static method to get url from title
    var urlFromTitle = function(title){
        //replace SPACES by +
        var queryString = title.split(' ').join('+');
        //replace placeholder with query
        var url = omdbApi.url.replace(omdbApi.namePlaceholder, queryString);
        return url;
    }
    
    //private static method to select film by title
    var selectFilmByTitle = function(title){
        for(var i=0; i<filmsService.films.length; i++){
            if(filmsService.films[i].title === title)
                return filmsService.films[i];
        }
        return null;
    }
    
    var selectPositionByTitle = function(title){
        for(var i=0; i<filmsService.films.length; i++){
            if(filmsService.films[i].title === title)
                return i;
        }
        return null;
    }
    

    
    filmsService.getFilm = function(title){
        var deferred = $q.defer();
        
        if(filmsService.films.length > 0){
            filmsService.selectedFilm = selectFilmByTitle(title);
            deferred.resolve(filmsService.selectedFilm);
        }
        else{
            $http.get( urlFromTitle(title, {})).then(
                    function(response){
                        filmsService.selectedFilm = Film.build(response.data);
                        deferred.resolve(filmsService.selectedFilm);
                    },
                    function(error){
                        filmsService.selectedFilm = null;
                        deferred.resolve(null);
                    }
                );
        }        
        
        return deferred.promise;
    };
    
    
    filmsService.getFilmPositionByTitle = function(title){
        var deferred = $q.defer();
        
        if(filmsService.films.length > 0){
            deferred.resolve(selectPositionByTitle(title));
        }
        else{
            filmsService.getFilms().then(
                function(response){
                    deferred.resolve(selectPositionByTitle(title));
                },
                function(error){
                    deferred.resolve(null);
                }
            );
        }        
        
        return deferred.promise;        

    };
    
    
    filmsService.getFilms = function(){
        var deferred = $q.defer();
        if(filmsService.films.length != 0){
            deferred.resolve(filmsService.films);
        }
        else{
            var nDownloads = 0;
            var someErrorOccured = false;
            var resolveIfFinished = function(success){
                //count the download
                nDownloads++;
                //register if there was an error with the download
                if(!success){
                    someErrorOccured = true;
                }
                //in case all http GETs have been finished, resolve or reject, depending on if error happened
                if(nDownloads === filmNames.length){
                    //persist items
                    storageService.setItem("films", filmsService.films);
                    if(!someErrorOccured){
                        deferred.resolve(filmsService.films);
                    }
                    else{
                        deferred.reject();
                    }
                }
            };
            
            for(var i=0; i< filmNames.length; i++){
                $http.get( urlFromTitle(filmNames[i], {})).then(
                    function(response){
                        filmsService.films.push(Film.build(response.data));
                        resolveIfFinished(true);
                    },
                    function(error){
                        console.log("error");
                        resolveIfFinished(false);
                    }
                );
            }
        }
        
        return deferred.promise;
    };

    return filmsService;
})