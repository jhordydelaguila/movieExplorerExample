angular.module('FilmModel', [])

.factory('Film', function(){
    
    function Film(title, year, runtime, director, actors, plot, poster, imdbRating){
        this.title = title;
        this.year = year;
        this.runtime = runtime;
        this.director = director;
        this.actors = actors;
        this.plot = plot;
        this.poster = poster;
        this.imdbRating = imdbRating;
    }
    
    Film.build = function(data){
        if(!data || (!data.Title && !data.title))
            return null;
        
        //check if properties start by uppercase
        if('Title' in data){
            var lowerCaseStartingData = {};
            var key, keys = Object.keys(data);
            for(var i=0; i<keys.length; i++){
                key = keys[i].charAt(0).toLowerCase() + keys[i].slice(1);
                lowerCaseStartingData[key] = data[keys[i]];
            }
            data = lowerCaseStartingData;
        }
        
        //build film, using lowercase starting properties
        return new Film(data.title, data.year, data.runtime, data.director, data.actors, data.plot, data.poster, data.imdbRating);
    }
    
    Film.prototype.toJson = function(){
        return angular.toJson(this);
    }
    
    Film.fromJsonBunch = function(data){
        if(angular.isArray(data)){
            return data.map(Film.build).filter(Boolean);
        }
        return Film.build(data);
    }

    return Film;
})