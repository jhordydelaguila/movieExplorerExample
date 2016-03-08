angular.module('UtilsModule',[])

    .constant('defaultImg',"img/defaultFilm.jpg")

    .controller('safeSrcController', ['$scope', function($scope){

        //image object 
        var img = new Image();        
        var currentSrc;

        this.onLoadSuccess = function(callback){
            img.onload = function(){
                callback(this.src);
            };
        };

        this.onLoadError = function(callback){
            img.onerror = function(e){
                callback(e);
            };
        };


        this.updateSrc = function(src){            
            if(angular.isDefined(src) && src.length && currentSrc != src){
                currentSrc = src;
                img.src = currentSrc;
            }
        };

        $scope.$on('$destroy', function(){
            if(img){
                img = null;
            }
        });

    }])


    .directive('safeSrc', ['defaultImg', function(defaultImg) {
        return {
            restrict: "A",
            controller:'safeSrcController',
            scope:{
                safeSrc: '@'
            },
            link: function(scope, element, attrs, safeSrcCtrl) {


                //in first moment, set default img
                element[0].src = defaultImg;


                safeSrcCtrl.onLoadSuccess(
                    function(src){
                        element[0].src = src;
                    }
                );

                safeSrcCtrl.updateSrc(scope.safeSrc);

                //this $watch will be autom. removed when scope is destroyed
                scope.$watch('safeSrc', function(newVal, oldVal){
                    safeSrcCtrl.updateSrc(scope.safeSrc);
                });

            }
        }
    }])

    .directive('safeBgSrc', ['defaultImg', function(defaultImg) {
        return {
            restrict: "A",
            controller:'safeSrcController',
            scope:{
                safeBgSrc: '@'
            },
            link: function(scope, element, attrs, safeSrcCtrl) {


                //in first moment, set default bg img
                element.css({
                    'backgroundImage': 'url(' + defaultImg +')',
                });


                safeSrcCtrl.onLoadSuccess(
                    function(src){
                        element.css({
                            'backgroundImage': 'url(' + src +')',
                        });
                    }
                );

                safeSrcCtrl.updateSrc(scope.safeBgSrc);

                //this $watch will be autom. removed when scope is destroyed
                scope.$watch('safeBgSrc', function(newVal, oldVal){
                    safeSrcCtrl.updateSrc(scope.safeBgSrc);
                });

            }
        }
    }])