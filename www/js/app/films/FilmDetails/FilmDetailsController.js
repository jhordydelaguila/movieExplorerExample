angular.module('FilmsModule')

.controller('FilmDetailsController', function($scope, FilmsService, currentFilmIndex) {
    
    $scope.data = {};
    $scope.data.films = FilmsService.films;
    
    var initView = function(){
        $scope.data.currentPage = currentFilmIndex;
    };
    
    var setupSlider = function(){
        //some options to pass to our slider
        $scope.data.sliderOptions = {
            initialSlide: currentFilmIndex,
            direction: 'horizontal', //or vertical
            speed: 300, //0.3s transition
            grabCursor: true //this replaces cursor by a hand when hover slider
        };
        
        //create delegate reference to link with slider
        $scope.data.sliderDelegate = null;
        
        //watch our sliderDelegate reference, and use it when it becomes available
        $scope.$watch('data.sliderDelegate', function(newVal, oldVal){
            if(newVal != null){ 
                $scope.data.sliderDelegate.on('slideChangeEnd', function(){
                    $scope.data.currentPage = $scope.data.sliderDelegate.activeIndex;
                    //use $scope.$apply() to refresh any content external to the slider
                    $scope.$apply();
                });
            }
        });        
    };
    
    $scope.$on('$ionicView.loaded', function(){
        initView();
    });
    
    
    //init slider when loading controller, so sliderOptions dict is available in the view
    setupSlider();
  

});
