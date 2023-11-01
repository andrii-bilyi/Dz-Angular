var app = angular.module('movieSearchApp', []);

app.controller('MovieSearchController', function ($scope, $http) {
    $scope.searchTitle = '';
    $scope.searchType = 'movie';
    $scope.movies = [];
    $scope.pages = [];   
    $scope.isMovieDetailsVisible = false; // По замовчуванню доп інформація не відображається

    const apiKey = '66b72799';
    const apiUrl = 'http://www.omdbapi.com/';
    $scope.searchMovies = function () {
        $http.get(apiUrl, {
            params: {
                apiKey: apiKey,
                s: $scope.searchTitle,
                type: $scope.searchType,
                r: 'json'
            }
        }).then(function (response) {
            if (response.data.Response === 'True') {
                $scope.movies = response.data.Search;
                var totalPages = Math.ceil(response.data.totalResults / 10);
                $scope.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
                $scope.isMovieDetailsVisible = false; // Очистити доп інформацію при новому пошуку
            } else {
                $scope.movies = [];
                $scope.pages = [];
                $scope.isMovieDetailsVisible = false; // Очистити доп інформацію при відсутності результатів
            }
        });
    };

    $scope.loadPage = function (pageNumber) {
        $http.get(apiUrl, {
            params: {
                apiKey: apiKey,
                s: $scope.searchTitle,
                type: $scope.searchType,
                page: pageNumber,
                r: 'json'
            }
        }).then(function (response) {
            if (response.data.Response === 'True') {
                $scope.movies = response.data.Search;
                $scope.isMovieDetailsVisible = false; // Очистити доп інформацію при переході на іншу сторінку
            }
        });
    };

    $scope.showMovieDetails = function (movieId) {

        $http.get(apiUrl, {
            params: {
                apiKey: apiKey,
                i: movieId,
                r: 'json'
            }
        }).then(function (response) {
            if (response.data.Response === 'True') {
                $scope.selectedMovie = response.data;
                $scope.isMovieDetailsVisible = true;
            } else {
                 $scope.isMovieDetailsVisible = false; // Очистити докладну інформацію, якщо деталей не знайдено                
            }
        });
    };
});