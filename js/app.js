/**
 * Created by james on 6/24/2017.
 */
var app = angular.module('oneiros', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'templates/home.tpl.html',
                controller: 'HomeCtrl'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'templates/about.tpl.html',
                controller: 'AboutCtrl'
            })
            .state('services', {
                url: '/services',
                templateUrl: 'templates/services.tpl.html',
                controller: 'ServicesCtrl'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'templates/contact.tpl.html',
                controller: 'ContactCtrl'
            })
            .state('samples', {
                url: '/samples',
                templateUrl: 'templates/samples.tpl.html',
                controller: 'SamplesCtrl'
            });

        $urlRouterProvider.otherwise('home');
    }]);

app.controller('NavCtrl', [
    '$scope',
    '$state',
    function($scope, $state){

        $scope.isActive = function (name){
            if( $state.current.name == name){
                return 'active';
            }
        };

        function init() {
            $('.button-collapse').sideNav();
        }
        init();
    }]);

app.controller('AboutCtrl', [
    '$scope',
    '$state',
    function($scope, $state){
    }]);

app.controller('ContactCtrl', [
    '$scope',
    '$state',
    function($scope, $state){
        $scope.followUpOptions = ['E-mail', 'Call', 'Text'];
        $scope.serviceOptions = [
            {name:'New Website', value:false},
            {name:'Website Redesign', value:false},
            {name:'Logo/Graphic Design', value:false},
            {name:'Eat24 Online Order Integration', value:false},
            {name:'Web Training', value:false},
            {name:'Other', value:false}
            ];
        $scope.name = "";
        $scope.phone = "";
        $scope.email = "";
        $scope.website = "";
        $scope.business = "";
        $scope.followUp = "";
        $scope.services = [];
        $scope.other = "";

        function init(){
            $scope.followUpOptions = ['E-mail', 'Call', 'Text'];
            $('select').material_select();

            console.log($scope.serviceOptions);
        }

        init();

        $scope.openEmail = function(){

        }
    }]);

app.controller('HomeCtrl', [
    '$scope',
    '$state',
    function($scope, $state){
        function init() {
            $('.parallax').parallax();
        }

        init();
    }]);

app.controller('SamplesCtrl', [
    '$scope',
    '$state',
    function($scope, $state){
    }]);

app.controller('ServicesCtrl', [
    '$scope',
    '$state',
    function($scope, $state){
        function init(){
            $('.collapsible').collapsible();
        }

        init();
    }]);
