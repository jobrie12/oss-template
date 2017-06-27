/**
 * Created by james on 6/24/2017.
 */
var app = angular.module('oneiros', ['ui.router']);

app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}]);

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
            })
            .state('demo', {
                url: '/samples/{id}',
                templateUrl: function($stateParams){
                    return 'templates/samples/'+$stateParams.id + '/index.tpl.html'
                },
                resolve: {
                    controllerName: ['$stateParams', '$timeout','$q',
                        function ($stateParams, $timeout, $q)
                        {
                            var deferred = $q.defer();
                            $timeout(function(){

                                deferred.resolve($stateParams.id + 'Ctrl');

                            },250);
                            return deferred.promise;
                        }
                    ],
                },
                controllerProvider:['controllerName', function (controllerName)
                {
                    return controllerName;
                }]
            }).state('demopage', {
                url: '/samples/{id}/{page}',
                templateUrl: function($stateParams){
                    return 'templates/samples/'+$stateParams.id + '/'+$stateParams.page+'.tpl.html'
                },
                resolve: {
                    controllerName: ['$stateParams', '$timeout','$q',
                        function ($stateParams, $timeout, $q)
                        {
                            var deferred = $q.defer();
                            $timeout(function(){

                                deferred.resolve($stateParams.id + 'Ctrl');

                            },250);
                            return deferred.promise;
                        }
                    ]
                },
                controllerProvider:['controllerName', function (controllerName)
                {
                    return controllerName;
                }]
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

        $scope.Date = Date;
        $scope.playing = {
            brewing: false,
            chickens: false
        };

        $scope.playVideo = function(video){
            var vid = document.getElementById(video + "Video");
            vid.addEventListener('ended',myHandler,false);
            function myHandler(e) {
                $scope.playing[video] = false;
                $scope.$apply();
            }
            vid.volume = 0.0;
            $scope.playing[video] = true;
            vid.play();
        };

        function createSetup(units, scale){

            return {
                color: '#ff0000',
                // This has to be the same size as the maximum width to
                // prevent clipping
                strokeWidth: 2,
                trailWidth: 1,
                easing: 'easeInOut',
                duration: 3400,
                svgStyle: {width: '100%', height: '100%'},
                text: {
                    style: {
                        // Text color.
                        // Default: same as stroke color (options.color)
                        position: 'absolute',
                        right: '40px',
                        padding: 0,
                        margin: 0,
                        transform: null
                    },
                    class:'right',
                    autoStyleContainer: false
                },
                from: { color: '#ff0000', width: 2 },
                to: { color: '#00ff00', width: 2 },
                // Set default step function for all animate calls
                step: function(state, circle) {
                    circle.path.setAttribute('stroke', state.color);
                    circle.path.setAttribute('stroke-width', state.width);

                    var value = Math.round(circle.value() * scale * 10) / 10.0;
                    if (value === 0) {
                        circle.setText('');
                    } else {
                        circle.setText(value + ' ' + units);
                    }

                    circle.text.style.color = state.color;
                }
            }

        }

        function init(){

            var setup = createSetup('years', 12);
            var setup2 = createSetup('gallons', 300);
            var setup3 = createSetup('chickens', 15);
            var setup4 = createSetup('/365 days', 365);
            var bar = new ProgressBar.Line('#container', setup);
            var bar2 = new ProgressBar.Line('#container2', setup2);
            var bar3 = new ProgressBar.Line('#container3', setup3);
            var bar4 = new ProgressBar.Line('#container4', setup4);
            bar.animate(.75);  // Number from 0.0 to 1.0
            bar2.animate(105/300.0);  // Number from 0.0 to 1.0
            bar3.animate(13/15.0);  // Number from 0.0 to 1.0

            var dayAgo = Date.create('October 6, 2016').daysAgo();
            bar4.animate(dayAgo/365.0);  // Number from 0.0 to 1.0
        }

        init();
    }]);

app.controller('ContactCtrl', [
    '$scope',
    '$state',
    '$window',
    '$http',
    function($scope, $state, $window, $http){
        $scope.followUpOptions = ['E-mail', 'Call', 'Text'];
        $scope.serviceOptions = [
            {name:'New Website', value:false},
            {name:'Website Redesign', value:false},
            {name:'Logo/Graphic Design', value:false},
            {name:'Eat24 Online Order Integration', value:false},
            {name:'E-Commerce', value:false},
            {name:'E-Mail Outreach', value:false},
            {name:'Web Training', value:false},
            {name:'Other', value:false}
            ];
        $scope.name = "";
        $scope.phone = "";
        $scope.email = "";
        $scope.website = "";
        $scope.business = "";
        $scope.followUp = "";
        $scope.other = "";
        $scope.services = "";

        function init(){
            $(document).ready(function() {
                $('select').material_select();
            });
        }

        init();

        function clearForm() {
            $scope.serviceOptions = [
                {name:'New Website', value:false},
                {name:'Website Redesign', value:false},
                {name:'Logo/Graphic Design', value:false},
                {name:'Eat24 Online Order Integration', value:false},
                {name:'E-Commerce', value:false},
                {name:'E-Mail Outreach', value:false},
                {name:'Web Training', value:false},
                {name:'Other', value:false}
            ];
            $scope.name = "";
            $scope.phone = "";
            $scope.email = "";
            $scope.website = "";
            $scope.business = "";
            $scope.followUp = "";
            $scope.other = "";
            $scope.services = "";
        }

        $scope.generateEmail = function(){

            $scope.serviceOptions.forEach(function(n){
               if(n.value){
                   $scope.services += n.name + " | "
               }
            });

            var toast = "";

            if ($scope.name.length < 1){
                toast += " name,"
            }
            if ($scope.business.length < 1) {
                toast += " business,"
            }
            if ($scope.email.length < 1) {
                toast += " email,"
            }
            if (!$scope.followUp) {
                toast += " follow up,"
            }
            if ($scope.services.length < 1) {
                toast += " services,"
            }

            if (toast.length > 0){
                toast = toast.slice(0, -1);
                Materialize.toast("Please fill out the " + toast + " fields before submitting.", 5000, 'rounded red')
            }else if ($scope.followUp != "E-Mail" && $scope.phone.length < 1){
                Materialize.toast("If you want us to follow up by phone, we will need a phone #", 5000, 'rounded red')
            }
            else {
                $scope.services = $scope.services.slice(0, -2);
                $http({
                    method: "POST",
                    url: "server/mail_handler.php",
                    data: {
                        name: $scope.name,
                        phone: $scope.phone,
                        email: $scope.email,
                        website: $scope.website,
                        business: $scope.business,
                        followUp: $scope.followUp,
                        services: $scope.services,
                        other: $scope.other
                    }
                }).then(function successCallback(response) {
                        if (response.data.indexOf('Failed') != -1){
                            Materialize.toast("ERROR: " + response.data, 5000, 'rounded red');
                            clearForm();
                        } else {
                            Materialize.toast("Thanks for the email, we'll get back to you shortly!", 5000, 'rounded green')
                            clearForm();
                        }
                    }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        Materialize.toast("ERROR: " + response.data, 5000, 'rounded red')
                    }

                );
            }
        }
    }]);

app.controller('HomeCtrl', [
    '$scope',
    '$state',
    function($scope, $state){

        $scope.quote = [
            {
                name:"New Website Domain and Hosting (3 years)",
                rate:150.00,
                quantity:1
            },
            {
                name:"Website Backend & Styling",
                rate:100.00,
                quantity:1
            },
            {
                name:"Web Content (Pages)**",
                rate:30.00,
                quantity:5
            },
            {
                name:"E-Mail Form",
                rate:25.00,
                quantity:1
            },
            {
                name:"1 Year Support, Updates, and Training",
                rate:0.00,
                quantity:1
            }
        ];

        $scope.total = 0.00;
        function init() {
            $('.parallax').parallax();

            $scope.quote.forEach(function(item){
                $scope.total += (item.rate * item.quantity);
            });
        }

        init();
    }]);

app.controller('SamplesCtrl', [
    '$scope',
    '$state',
    '$http',
    '$window',
    function($scope, $state, $http, $window){
        $scope.sampleCode = "";
        $scope.fetchDemo = function() {
            $http.get('templates/samples/'+$scope.sampleCode+'/index.tpl.html').then(function successCallback(response) {
                    $state.go('demo', {id:$scope.sampleCode});
                }, function errorCallback(response) {
                    Materialize.toast("No Demos were found with that code, sorry.", 5000, 'rounded red');
                }

            );
        }
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

app.controller('chessiesCtrl', [
    '$scope',
    '$state',
    function($scope, $state){
        $scope.id = "CHEEEEEEESSSIIIIIESSSS";

        function init(){

        }

        init();
    }]
);
