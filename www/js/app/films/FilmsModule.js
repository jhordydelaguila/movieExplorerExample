angular.module('FilmsModule', ['FilmModel', 'OMDBFilmsModule'])


.config(function($stateProvider) {
    $stateProvider
        .state('app.films', {
        url: '/films',
        views:{
            'content':{
                templateUrl: 'js/app/films/Films/films.html',
                controller: 'FilmsController',
                resolve:{
                    films: function(FilmsService){ 
                        return FilmsService.getFilms();
                    }
                }
            }
        }
    })

        .state('app.films-detail', {
        url: '/films/detail/:filmTitle',
        views:{
            'content':{
                templateUrl: 'js/app/films/FilmDetails/films-detail.html',
                controller: 'FilmDetailsController',
                resolve:{
                    currentFilmIndex: function(FilmsService, $stateParams){ 
                        return FilmsService.getFilmPositionByTitle($stateParams.filmTitle);
                    }
                }                
            }
        }
    })
});