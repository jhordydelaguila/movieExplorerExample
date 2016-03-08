angular.module('FilmsModule')

.controller('FilmsController', function($scope, Film, films) {
    
    var initView = function(){
        $scope.films = films;
    };
    
    
    $scope.$on('$ionicView.loaded', function(){
        initView();
    });

});
