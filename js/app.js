/**
 * Created by james on 6/24/2017.
 */
var app = angular.module('oneiros', ['ui.router', 'vcRecaptcha', 'ui.materialize']);

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
            $(".button-collapse").sideNav({
                closeOnClick: true
            });
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
                duration: 2000,
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

            Sugar.extend();

            var setup = createSetup('years', 12);
            var setup2 = createSetup('gallons', 300);
            var setup3 = createSetup('chickens', 15);
            var setup4 = createSetup('/365 days', 365);
            var setup6 = createSetup('dogs', 50);
            var setup7 = createSetup('books', 30);
            var setup8 = createSetup('/365 days', 365);
            var bar = new ProgressBar.Line('#container', setup);
            var bar2 = new ProgressBar.Line('#container2', setup2);
            var bar3 = new ProgressBar.Line('#container3', setup3);
            var bar4 = new ProgressBar.Line('#container4', setup4);
            var bar5 = new ProgressBar.Line('#container5', setup4);
            var bar6 = new ProgressBar.Line('#container6', setup6);
            var bar7 = new ProgressBar.Line('#container7', setup7);
            bar.animate(.75);  // Number from 0.0 to 1.0

            bar2.animate(105/300.0);  // Number from 0.0 to 1.0
            bar3.animate(13/15.0);  // Number from 0.0 to 1.0

            var dayAgo = Date.create('October 6, 2016').daysAgo();
            bar4.animate(dayAgo/365.0);  // Number from 0.0 to 1.0
            var dayAgo = Date.create('December 9, 2016').daysAgo();
            bar5.animate(dayAgo/365.0);  // Number from 0.0 to 1.0

            bar6.animate(3/50);  // Number from 0.0 to 1.0
            bar7.animate(5/30);  // Number from 0.0 to 1.0
        }


        init();
    }]);

app.controller('ContactCtrl', [
    '$scope',
    '$state',
    '$window',
    '$http',
    'vcRecaptchaService',
    function($scope, $state, $window, $http, vcRecaptchaService){
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
        $scope.captchaValue = null;
        $scope.publicKey = "6LdqFScUAAAAAOcHxta8OI1DCCbF5IJ_iRT8ApQD";

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
            $scope.captchaValue = null;
        }

        $scope.generateEmail = function(){

            console.log($scope.captchaValue);

            $scope.serviceOptions.forEach(function(n){
               if(n.value){
                   $scope.services += n.name + " | "
               }
            });

            var toast = "";

            if ($scope.name.length < 1){
                toast += " name,"
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
            } /*else if(vcRecaptchaService.getResponse() === ""){
                Materialize.toast("Please resolve the captcha before submitting", 5000, 'rounded red')
            }*/
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
                        //gcaptcharesponse: vcRecaptchaService.getResponse()
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
                        console.log(response.message);
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

        function init()
        {
            $('.collapsible').collapsible();
            $('select').material_select();
        }


        init();
    }]
);

app.controller('demo-firmCtrl', [
    '$scope',
    '$state',
    '$location',
    function($scope, $state, $location){

        $scope.projects = [
            {
                "name":"abbot",
                "title": "Abbot Residence",
                "image": "images/abbot.jpg"
            },
            {
                "name":"coffin",
                "title": "Coffin Residence",
                "image": "images/coffin.jpg"
            },
            {
                "name":"ellison",
                "title": "Ellison Residence",
                "image": "images/ellison.jpg"
            }
        ];

        $scope.isActive = function (name){
           if( $location.url().indexOf(name) != -1){
                return 'active';
           } else if (name === 'home' && $location.url().split("/").length - 1 == 2){
               return 'active';
           }
        };

        function init(){

        }

        init();
    }]
);

app.controller('demo-firmCtrl', [
    '$scope',
    '$state',
    '$location',
    function($scope, $state, $location){

        $scope.projects = [
            {
                "name":"abbot",
                "title": "Abbot Residence",
                "image": "images/abbot.jpg"
            },
            {
                "name":"coffin",
                "title": "Coffin Residence",
                "image": "images/coffin.jpg"
            },
            {
                "name":"ellison",
                "title": "Ellison Residence",
                "image": "images/ellison.jpg"
            }
        ];

        $scope.changeText = function(isTrue, number){
            if (isTrue && number > 5){
                console.log("Wow this is true and greater than 5!");
                $scope.ourText= number + " is indeed greater than 5!";
            }

        };

        $scope.ourText = "";

        $scope.isActive = function (name){
           if( $location.url().indexOf(name) != -1){
                return 'active';
           } else if (name === 'home' && $location.url().split("/").length - 1 == 2){
               return 'active';
           }
        };

        function init(){

        }

        init();
    }]
);

app.controller('ubblsaCtrl', [
    '$scope',
    '$state',
    '$location',
    function($scope, $state, $location){
    
        $scope.Date = Date;

        $scope.followUpOptions = ['E-mail', 'Call', 'Text'];
        $scope.serviceOptions = [
            {name:'Want to Join', value:false},
            {name:'Talk about Event', value:false},
            {name:'General Questions', value:false},
            {name:'Comments', value:false},
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
        $scope.captchaValue = null;
        $scope.publicKey = "6LdqFScUAAAAAOcHxta8OI1DCCbF5IJ_iRT8ApQD";

        $scope.board = [
            {
                name:"Brandon Cahee",
                photo: "images/samples/ubblsa/blank.png",
                pos: "President"
            },
            {
                name:"Eroncia Berry",
                photo: "images/samples/ubblsa/blank.png",
                pos: "Vice President"
            },
            {
                name:"Alyxandrya McClelland",
                photo: "images/samples/ubblsa/blank.png",
                pos: "Treasurer"
            },
            {
                name:"Hamda Hussein",
                photo: "images/samples/ubblsa/blank.png",
                pos: "Director of Academic Affairs"
            },
            {
                name:"Dytonia Reed",
                photo: "images/samples/ubblsa/blank.png",
                pos: "Director of Community Service"
            },
            {
                name:"D'ereka Bolden",
                photo: "images/samples/ubblsa/blank.png",
                pos: "Director of Programming"
            },
            {
                name:"Usman Suleman",
                photo: "images/samples/ubblsa/blank.png",
                pos: "Director of Public Relations"
            },
            {
                name:"Edward Shields",
                pos: "Day Student Representative",
                photo: "images/samples/ubblsa/edshields.jpg",
                linkedin: 'https://www.linkedin.com/in/edward-shields-3b96b2125',
                desc: "I am a law student at the University of Baltimore with an interest in Criminal Law as well as Criminology. " +
                "My vision is to become an accomplished lawyer while giving back to the community monetarily and physically as well as with pro bono legal advice."
            },
            {
                name:"Kimetha Payton",
                photo: "images/samples/ubblsa/blank.png",
                pos: "Evening Representative"
            },
            {
                name:"Tashani Dickson",
                photo: "images/samples/ubblsa/blank.png",
                pos: "Historian"
            }
        ];

        $scope.selectedMember = $scope.board[7];

        $scope.selectMember = function(member){
            $scope.selectedMember = member;
        }

        $scope.events = [{
            image:"images/samples/ubblsa/board-retreat.jpg",
            title: "Board Retreat",
            date: "July 7th, 2017",
            desc: "On this past weekend, the University of Baltimore School of Law's Black Law Students Association (UB BLSA) " +
            "Executive Board held our Board Retreat. During the retreat, the Board focused on ways to advance our vision of " +
            "renewing our commitment to excellence through service in leadership by the building and engagement of our membership and alumni, " +
            "our external community advocacy, our political involvement, and the building of strategic partnerships within our broader legal community. " +
            "In the two day event, Board members participated in an strategy/planning session to prepare and map out events for the year, and to begin the " +
            "work of the organization for the academic year. To culminate our work, we took part in a day of team building so that we could effectively learn " +
            "skills, and tools to best advocate for our members. #UBBLSA #LEADERSHIPINSERVICE",
            photos: ["images/samples/ubblsa/board-retreat.jpg", "images/samples/ubblsa/board-retreat.jpg",
                "images/samples/ubblsa/board-retreat.jpg", "images/samples/ubblsa/board-retreat.jpg",
                "images/samples/ubblsa/board-retreat.jpg", "images/samples/ubblsa/board-retreat.jpg",
                "images/samples/ubblsa/board-retreat.jpg"]
        },
            {
                image:"images/samples/ubblsa/board-retreat.jpg",
                title: "Event 2",
                date: "July 4th, 2017",
                desc: "On this past weekend, the University of Baltimore School of Law's Black Law Students Association (UB BLSA) " +
                "Executive Board held our Board Retreat. During the retreat, the Board focused on ways to advance our vision of " +
                "renewing our commitment to excellence through service in leadership by the building and engagement of our membership and alumni, " +
                "our external community advocacy, our political involvement, and the building of strategic partnerships within our broader legal community. " +
                "In the two day event, Board members participated in an strategy/planning session to prepare and map out events for the year, and to begin the " +
                "work of the organization for the academic year. To culminate our work, we took part in a day of team building so that we could effectively learn " +
                "skills, and tools to best advocate for our members. #UBBLSA #LEADERSHIPINSERVICE",
                photos: ["images/samples/ubblsa/board-retreat.jpg", "images/samples/ubblsa/board-retreat.jpg"]
            },
            {
                image:"images/samples/ubblsa/board-retreat.jpg",
                title: "Event 3",
                date: "June 15th, 2017",
                desc: "On this past weekend, the University of Baltimore School of Law's Black Law Students Association (UB BLSA) " +
                "Executive Board held our Board Retreat. During the retreat, the Board focused on ways to advance our vision of " +
                "renewing our commitment to excellence through service in leadership by the building and engagement of our membership and alumni, " +
                "our external community advocacy, our political involvement, and the building of strategic partnerships within our broader legal community. " +
                "In the two day event, Board members participated in an strategy/planning session to prepare and map out events for the year, and to begin the " +
                "work of the organization for the academic year. To culminate our work, we took part in a day of team building so that we could effectively learn " +
                "skills, and tools to best advocate for our members. #UBBLSA #LEADERSHIPINSERVICE",
                photos: ["images/samples/ubblsa/board-retreat.jpg", "images/samples/ubblsa/board-retreat.jpg",
                    "images/samples/ubblsa/board-retreat.jpg", "images/samples/ubblsa/board-retreat.jpg",
                    "images/samples/ubblsa/board-retreat.jpg", "images/samples/ubblsa/board-retreat.jpg",]
            },
            {
                image:"images/samples/ubblsa/board-retreat.jpg",
                title: "Event 4",
                date: "May 8th, 2017",
                desc: "On this past weekend, the University of Baltimore School of Law's Black Law Students Association (UB BLSA) " +
                "Executive Board held our Board Retreat. During the retreat, the Board focused on ways to advance our vision of " +
                "renewing our commitment to excellence through service in leadership by the building and engagement of our membership and alumni, " +
                "our external community advocacy, our political involvement, and the building of strategic partnerships within our broader legal community. " +
                "In the two day event, Board members participated in an strategy/planning session to prepare and map out events for the year, and to begin the " +
                "work of the organization for the academic year. To culminate our work, we took part in a day of team building so that we could effectively learn " +
                "skills, and tools to best advocate for our members. #UBBLSA #LEADERSHIPINSERVICE",
                photos: ["images/samples/ubblsa/board-retreat.jpg", "images/samples/ubblsa/board-retreat.jpg",
                    "images/samples/ubblsa/board-retreat.jpg", "images/samples/ubblsa/board-retreat.jpg",
                    "images/samples/ubblsa/board-retreat.jpg",]
            }];

        $scope.selectedEvent = $scope.events[0];

        function init(){
            $(document).ready(function() {
                $('select').material_select();
                $('.slider').slider();
                $('.materialboxed').materialbox();
                $('.modal').modal();
                $(".button-collapse").sideNav({
                    closeOnClick: true
                });
            });
        }

        function clearForm() {
            $scope.serviceOptions = [
                {name:'Want to Join', value:false},
                {name:'Talk about Event', value:false},
                {name:'General Questions', value:false},
                {name:'Comments', value:false},
                {name:'Other', value:false}
            ];
            $scope.name = "";
            $scope.phone = "";
            $scope.email = "";
            $scope.website = "";
            $scope.followUp = "";
            $scope.other = "";
            $scope.services = "";
        }

        $scope.goToEvent = function(event) {
            $scope.selectedEvent = event;
            Materialize.toast("This would navigate to Event Page for " + event.title
                + " and have the gallery of photos and full description.", 10000, 'rounded green');
            //$state.go('demopage', {id:'ubblsa', page:'event'});
            //$('#events-modal').modal('open');
        };

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
            if ($scope.email.length < 1) {
                toast += " email,"
            }

            if (toast.length > 0){
                toast = toast.slice(0, -1);
                Materialize.toast("Please fill out the " + toast + " fields before submitting.", 5000, 'rounded red')
            } else {
                Materialize.toast("Thanks for the email, we'll get back to you shortly!", 5000, 'rounded green');
                clearForm();
            }
        };

        $scope.isActive = function (name){
            if( $location.url().indexOf(name) != -1){
                return 'active';
            } else if (name === 'home' && $location.url().split("/").length - 1 == 2){
                return 'active';
            }
        };

        init();
    }]
);

app.controller('demo-firmCtrl', [
    '$scope',
    '$state',
    '$location',
    function($scope, $state, $location){

        $scope.projects = [
            {
                "name":"abbot",
                "title": "Abbot Residence",
                "image": "images/abbot.jpg"
            },
            {
                "name":"coffin",
                "title": "Coffin Residence",
                "image": "images/coffin.jpg"
            },
            {
                "name":"ellison",
                "title": "Ellison Residence",
                "image": "images/ellison.jpg"
            }
        ];

        $scope.changeText = function(isTrue, number){
            if (isTrue && number > 5){
                console.log("Wow this is true and greater than 5!");
                $scope.ourText= number + " is indeed greater than 5!";
            }

        };

        $scope.ourText = "";

        $scope.isActive = function (name){
           if( $location.url().indexOf(name) != -1){
                return 'active';
           } else if (name === 'home' && $location.url().split("/").length - 1 == 2){
               return 'active';
           }
        };

        function init(){

        }

        init();
    }]
);

app.controller('ubblsaCtrl', [
    '$scope',
    '$state',
    '$location',
    function($scope, $state, $location){
    
        $scope.Date = Date;

        $scope.followUpOptions = ['E-mail', 'Call', 'Text'];
        $scope.serviceOptions = [
            {name:'Want to Join', value:false},
            {name:'Talk about Event', value:false},
            {name:'General Questions', value:false},
            {name:'Comments', value:false},
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
        $scope.captchaValue = null;
        $scope.publicKey = "6LdqFScUAAAAAOcHxta8OI1DCCbF5IJ_iRT8ApQD";

        $scope.board = [
            {
                name:"Brandon Cahee",
                photo: "images/samples/ubblsa/blank.png",
                pos: "President"
            },
            {
                name:"Eroncia Berry",
                photo: "images/samples/ubblsa/blank.png",
                pos: "Vice President"
            },
            {
                name:"Alyxandrya McClelland",
                photo: "images/samples/ubblsa/blank.png",
                pos: "Treasurer"
            },
            {
                name:"Hamda Hussein",
                photo: "images/samples/ubblsa/blank.png",
                pos: "Director of Academic Affairs"
            },
            {
                name:"Dytonia Reed",
                photo: "images/samples/ubblsa/blank.png",
                pos: "Director of Community Service"
            },
            {
                name:"D'ereka Bolden",
                photo: "images/samples/ubblsa/blank.png",
                pos: "Director of Programming"
            },
            {
                name:"Usman Suleman",
                photo: "images/samples/ubblsa/blank.png",
                pos: "Director of Public Relations"
            },
            {
                name:"Edward Shields",
                pos: "Day Student Representative",
                photo: "images/samples/ubblsa/edshields.jpg",
                linkedin: 'https://www.linkedin.com/in/edward-shields-3b96b2125',
                desc: "I am a law student at the University of Baltimore with an interest in Criminal Law as well as Criminology. " +
                "My vision is to become an accomplished lawyer while giving back to the community monetarily and physically as well as with pro bono legal advice."
            },
            {
                name:"Kimetha Payton",
                photo: "images/samples/ubblsa/blank.png",
                pos: "Evening Representative"
            },
            {
                name:"Tashani Dickson",
                photo: "images/samples/ubblsa/blank.png",
                pos: "Historian"
            }
        ];

        $scope.selectedMember = $scope.board[7];

        $scope.selectMember = function(member){
            $scope.selectedMember = member;
        };

        $scope.events = [{
            image:"images/samples/ubblsa/board-retreat.jpg",
            title: "Board Retreat",
            date: "July 7th, 2017",
            desc: "On this past weekend, the University of Baltimore School of Law's Black Law Students Association (UB BLSA) " +
            "Executive Board held our Board Retreat. During the retreat, the Board focused on ways to advance our vision of " +
            "renewing our commitment to excellence through service in leadership by the building and engagement of our membership and alumni, " +
            "our external community advocacy, our political involvement, and the building of strategic partnerships within our broader legal community. " +
            "In the two day event, Board members participated in an strategy/planning session to prepare and map out events for the year, and to begin the " +
            "work of the organization for the academic year. To culminate our work, we took part in a day of team building so that we could effectively learn " +
            "skills, and tools to best advocate for our members. #UBBLSA #LEADERSHIPINSERVICE",
            photos: ["images/samples/ubblsa/board-retreat.jpg", "images/samples/ubblsa/board-retreat.jpg",
                "images/samples/ubblsa/board-retreat.jpg", "images/samples/ubblsa/board-retreat.jpg",
                "images/samples/ubblsa/board-retreat.jpg", "images/samples/ubblsa/board-retreat.jpg",
                "images/samples/ubblsa/board-retreat.jpg"]
        },
            {
                image:"images/samples/ubblsa/board-retreat.jpg",
                title: "Event 2",
                date: "July 4th, 2017",
                desc: "On this past weekend, the University of Baltimore School of Law's Black Law Students Association (UB BLSA) " +
                "Executive Board held our Board Retreat. During the retreat, the Board focused on ways to advance our vision of " +
                "renewing our commitment to excellence through service in leadership by the building and engagement of our membership and alumni, " +
                "our external community advocacy, our political involvement, and the building of strategic partnerships within our broader legal community. " +
                "In the two day event, Board members participated in an strategy/planning session to prepare and map out events for the year, and to begin the " +
                "work of the organization for the academic year. To culminate our work, we took part in a day of team building so that we could effectively learn " +
                "skills, and tools to best advocate for our members. #UBBLSA #LEADERSHIPINSERVICE",
                photos: ["images/samples/ubblsa/board-retreat.jpg", "images/samples/ubblsa/board-retreat.jpg"]
            },
            {
                image:"images/samples/ubblsa/board-retreat.jpg",
                title: "Event 3",
                date: "June 15th, 2017",
                desc: "On this past weekend, the University of Baltimore School of Law's Black Law Students Association (UB BLSA) " +
                "Executive Board held our Board Retreat. During the retreat, the Board focused on ways to advance our vision of " +
                "renewing our commitment to excellence through service in leadership by the building and engagement of our membership and alumni, " +
                "our external community advocacy, our political involvement, and the building of strategic partnerships within our broader legal community. " +
                "In the two day event, Board members participated in an strategy/planning session to prepare and map out events for the year, and to begin the " +
                "work of the organization for the academic year. To culminate our work, we took part in a day of team building so that we could effectively learn " +
                "skills, and tools to best advocate for our members. #UBBLSA #LEADERSHIPINSERVICE",
                photos: ["images/samples/ubblsa/board-retreat.jpg", "images/samples/ubblsa/board-retreat.jpg",
                    "images/samples/ubblsa/board-retreat.jpg", "images/samples/ubblsa/board-retreat.jpg",
                    "images/samples/ubblsa/board-retreat.jpg", "images/samples/ubblsa/board-retreat.jpg",]
            },
            {
                image:"images/samples/ubblsa/board-retreat.jpg",
                title: "Event 4",
                date: "May 8th, 2017",
                desc: "On this past weekend, the University of Baltimore School of Law's Black Law Students Association (UB BLSA) " +
                "Executive Board held our Board Retreat. During the retreat, the Board focused on ways to advance our vision of " +
                "renewing our commitment to excellence through service in leadership by the building and engagement of our membership and alumni, " +
                "our external community advocacy, our political involvement, and the building of strategic partnerships within our broader legal community. " +
                "In the two day event, Board members participated in an strategy/planning session to prepare and map out events for the year, and to begin the " +
                "work of the organization for the academic year. To culminate our work, we took part in a day of team building so that we could effectively learn " +
                "skills, and tools to best advocate for our members. #UBBLSA #LEADERSHIPINSERVICE",
                photos: ["images/samples/ubblsa/board-retreat.jpg", "images/samples/ubblsa/board-retreat.jpg",
                    "images/samples/ubblsa/board-retreat.jpg", "images/samples/ubblsa/board-retreat.jpg",
                    "images/samples/ubblsa/board-retreat.jpg",]
            }];

        $scope.selectedEvent = $scope.events[0];

        function init(){
            $(document).ready(function() {
                $('select').material_select();
                $('.slider').slider();
                $('.materialboxed').materialbox();
                $('.modal').modal();
                $(".button-collapse").sideNav({
                    closeOnClick: true
                });
            });
        }

        function clearForm() {
            $scope.serviceOptions = [
                {name:'Want to Join', value:false},
                {name:'Talk about Event', value:false},
                {name:'General Questions', value:false},
                {name:'Comments', value:false},
                {name:'Other', value:false}
            ];
            $scope.name = "";
            $scope.phone = "";
            $scope.email = "";
            $scope.website = "";
            $scope.followUp = "";
            $scope.other = "";
            $scope.services = "";
        }

        $scope.goToEvent = function(event) {
            $scope.selectedEvent = event;
            Materialize.toast("This would navigate to Event Page for " + event.title
                + " and have the gallery of photos and full description.", 10000, 'rounded green');
            //$state.go('demopage', {id:'ubblsa', page:'event'});
            //$('#events-modal').modal('open');
        };

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
            if ($scope.email.length < 1) {
                toast += " email,"
            }

            if (toast.length > 0){
                toast = toast.slice(0, -1);
                Materialize.toast("Please fill out the " + toast + " fields before submitting.", 5000, 'rounded red')
            } else {
                Materialize.toast("Thanks for the email, we'll get back to you shortly!", 5000, 'rounded green');
                clearForm();
            }
        };

        $scope.isActive = function (name){
            if( $location.url().indexOf(name) != -1){
                return 'active';
            } else if (name === 'home' && $location.url().split("/").length - 1 == 2){
                return 'active';
            }
        };

        init();
    }]
);

app.controller('gweinsteinCtrl', ['$scope', '$state', '$location', '$window', 'LoadReportService',
    function($scope, $state, $location, $window, LoadReportService){

    var accounts = $scope.accounts = {
        data: [],
        loaded: false,
        selected: null,
        formattedData: {
            Name: "Influencer Report",
            children: [],
            color: "white"
        },
        listData: [],
        count: 0
    };


    var select = $scope.select = {
        filterChoices: ['None', 'Categories', 'Groups', 'Threshold'],
        groupChoices: ['Arts & Culture', 'Business/Science/Education', 'Consumer Goods', 'Music', 'Entertainment',
        'Health/Beauty/Fashion/Fitness', 'Home/Family/Lifestyle', 'Political/Social', 'Sports', 'Not Found'],
        categoryChoices: ["Art",
            "Crafts",
            "Dance",
            "Design",
            "Reading",
            "Business",
            "Computers",
            "Education",
            "Finance",
            "Higher Education",
            "Marketing",
            "Science",
            "Small Business",
            "Automotive",
            "Beverages",
            "Consumer Electronics",
            "Shopping",
            "Toys And Games",
            "Music",
            "Actors",
            "Gaming",
            "Humor",
            "Movies",
            "Multimedia",
            "Podcasts",
            "Pop Culture",
            "Smalltalk",
            "TV",
            "XXX",
            "Beauty",
            "Fashion",
            "Fitness",
            "Health Care",
            "Nutrition",
            "Outdoor Recreation",
            "Animals",
            "Cooking",
            "Dating",
            "Events",
            "Food",
            "Home And Garden",
            "Local Life",
            "Parenting",
            "Travel",
            "Charity",
            "Current Events",
            "Environmentalism",
            "Military",
            "Politics",
            "Religion",
            "Extreme Sports",
            "Leisure Sports",
            "Major Sports",
            "Other Sports"
        ],
        loose: false,
        fileList: [{display: "James Doe", name: "James Doe.json"},{display: "John Doe", name: "john-doe-ir.json"}],
        showList: false,
        threshold: 0.01
    };

    select.filterBy = select.filterChoices[0];

    var categories = $scope.categories = {
        groups: ['Arts & Culture', 'Business/Science/Education', 'Consumer Goods', 'Music', 'Entertainment',
            'Health/Beauty/Fashion/Fitness', 'Home/Family/Lifestyle', 'Political/Social', 'Sports', 'Not Found'],
        groupColors: {
            'Arts & Culture': '#F44336',
            'Business/Science/Education': '#9C27B0',
            'Consumer Goods': '#2196F3',
            'Music': '#00838F',
            'Entertainment': '#FF9800',
            'Health/Beauty/Fashion/Fitness': '#FFEB3B',
            'Home/Family/Lifestyle': '#F4511E',
            'Political/Social': '#6D4C41',
            'Sports': '#607D8B',
            'Not Found': '#000000'
        },
        dict: {
            'Art': {group: 0, color:"#FFCDD2"},
            'Crafts': {group: 0, color:"#E57373"},
            'Dance': {group: 0, color:"#F44336"},
            'Design': {group: 0, color:"#D32F2F"},
            'Reading': {group: 0, color:"#B71C1C"},
            'Business': {group: 1, color:"#CE93D8"},
            'Computers': {group: 1, color:"#6A1B9A"},
            'Education': {group: 1, color:"#BA68C8"},
            'Finance': {group: 1, color:"#AB47BC"},
            'Higher Education': {group: 1, color:"#9C27B0"},
            'Marketing': {group: 1, color:"#8E24AA"},
            'Science': {group: 1, color:"#7B1FA2"},
            'Small Business': {group: 1, color:"#6A1B9A"},
            'Automotive': {group: 2, color:"#BBDEFB"},
            'Beverages': {group: 2, color:"#64B5F6"},
            'Consumer Electronics': {group: 2, color:"#2196F3"},
            'Shopping': {group: 2, color:"#1976D2"},
            'Toys And Games': {group: 2, color:"#0D47A1"},
            'Music': {group: 3, color:"#00838F"},
            'Actors': {group: 4, color:"#FFE0B2"},
            'Gaming': {group: 4, color:"#FFCC80"},
            'Humor': {group: 4, color:"#FFB74D"},
            'Movies': {group: 4, color:"#FFA726"},
            'Multimedia': {group: 4, color:"#FB8C00"},
            'Podcasts': {group: 4, color:"#F57C00"},
            'Pop Culture': {group: 4, color:"#EF6C00"},
            'Smalltalk': {group: 4, color:"#E65100"},
            'TV': {group: 4, color:"#FF9800"},
            'XXX': {group: 4, color:"#FFF3E0"},
            'Beauty': {group: 5, color: "#FFD600"},
            'Fashion': {group: 5, color: "#FFF176"},
            'Fitness': {group: 5, color: "#FFEE58"},
            'Health Care': {group: 5, color: "#FFEB3B"},
            'Nutrition': {group: 5, color: "#FDD835"},
            'Outdoor Recreation': {group: 5, color: "#FBC02D"},
            'Animals': {group: 6, color: "#FFCCBC"},
            'Cooking': {group: 6, color: "#FFAB91"},
            'Dating': {group: 6, color: "#FF8A65"},
            'Events': {group: 6, color: "#FF7043"},
            'Food': {group: 6, color: "#FF5722"},
            'Home And Garden': {group: 6, color: "#F4511E"},
            'Local Life': {group: 6, color: "#E64A19"},
            'Parenting': {group: 6, color: "#D84315"},
            'Travel': {group: 6, color: "#BF360C"},
            'Charity': {group: 7, color: "#A1887F"},
            'Current Events': {group: 7, color: "#8D6E63"},
            'Environmentalism': {group: 7, color: "#795548"},
            'Military': {group: 7, color: "#6D4C41"},
            'Politics': {group: 7, color: "#5D4037"},
            'Religion': {group: 7, color: "#4E342E"},
            'Extreme Sports': {group: 8, color: "#CFD8DC"},
            'Leisure Sports': {group: 8, color: "#90A4AE"},
            'Major Sports': {group: 8, color: "#607D8B"},
            'Other Sports': {group: 8, color: "#455A64"}
        }
    };

    var categori = $scope.categori = ["Art",
        "Crafts",
        "Dance",
        "Design",
        "Reading",
        "Business",
        "Computers",
        "Education",
        "Finance",
        "Higher Education",
        "Marketing",
        "Science",
        "Small Business",
        "Automotive",
        "Beverages",
        "Consumer Electronics",
        "Shopping",
        "Toys And Games",
        "Music",
        "Actors",
        "Gaming",
        "Humor",
        "Movies",
        "Multimedia",
        "Podcasts",
        "Pop Culture",
        "Smalltalk",
        "TV",
        "XXX",
        "Beauty",
        "Fashion",
        "Fitness",
        "Health Care",
        "Nutrition",
        "Outdoor Recreation",
        "Animals",
        "Cooking",
        "Dating",
        "Events",
        "Food",
        "Home And Garden",
        "Local Life",
        "Parenting",
        "Travel",
        "Charity",
        "Current Events",
        "Environmentalism",
        "Military",
        "Politics",
        "Religion",
        "Extreme Sports",
        "Leisure Sports",
        "Major Sports",
        "Other Sports"
    ];


    $(document).ready(function(){
        $('.collapsible').collapsible();
        d3.select("body").style('background-color', 'white');
    });


    function init(){
        /*categories.groups.forEach(function(group){
            accounts.formattedData.children.push({
                Name: group,
                children: [],
                color: categories.groupColors[group]
            })
        });*/

        d3.select("div#circleChart")
            .append("div")
            .classed("svg-container", true) //container class to make it responsive
            .append("svg")
            //responsive SVG needs these 2 attributes and no width and height attr
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 1200 1200")
            //class to make it responsive
            .classed("svg-content-responsive", true);

        for (var prop in categories.dict){
            if (categories.dict.hasOwnProperty(prop)){
                accounts.formattedData.children.push({
                    Name: prop,
                    children: [],
                    color: categories.dict[prop].color,
                    group: categories.dict[prop].group
                })
            }
        }

        select.report = select.fileList[0];

        $scope.loadNewSet(true);

        /*LoadReportService.fetch().then(function(data) {
            accounts.data = data.data;
            accounts.data.forEach(function(account){
                var groupInfo = categories.dict[account.Category];
                if (!groupInfo){
                    groupInfo = {group: 9, color: 'black'};
                }
                account.color = groupInfo.color;
                account.group = groupInfo.group;

                var index = categori.indexOf(account.Category);
                if (index != -1){
                    accounts.formattedData.children[index].children.push(account);
                    accounts.count++;
                }
            });

            buildChart();
        })*/
    };

    var formatData = function(){
        accounts.data.forEach(function(account){
            var groupInfo = categories.dict[account.Category];
            if (!groupInfo){
                groupInfo = {group: 9, color: 'black'};
            }
            account.color = groupInfo.color;
            account.group = groupInfo.group;

            var index = categori.indexOf(account.Category);
            if (index != -1){
                accounts.formattedData.children[index].children.push(account);
                accounts.count++;
            }
        });
    };

    var buildChart = function(){
        // Define the div for the tooltip
        var div = d3.select("body").append("div")
            .attr("id", "TOOLTIP-CONTENT")
            .attr("class", "tooltip")
            .style("opacity", 0);

        var svg = d3.select("svg"),
            diameter = 1200,
            g = svg.append("g").attr("transform", "translate(2,2)"),
            format = d3.format(",d");

        var pack = d3.pack()
            .size([diameter - 4, diameter - 4]);

        var root = accounts.formattedData;

        root = d3.hierarchy(root)
            .sum(function(d) { return d['Blended Score']; })
            .sort(function(a, b) { return b.value - a.value; });

        var node = g.selectAll(".node")
            .data(pack(root).descendants())
            .enter().append("g")
            .attr("class", function(d) { var cls = "node"; if (!d.children){cls +=" leaf"} if (d.data.Name !== 'Influencer Report'){cls += " clickable";} return cls; })
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .on("mouseover", function(d) {
                svg.selectAll(".overlabels").transition()
                    .duration(200)
                    .style("opacity", 0).transition()
                    .duration(200)
                    .style("display", 'none');;
                if (d.data.Username){
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html("<img src='https://twitter.com/"+ d.data.Username+"/profile_image?size=bigger' alt='' " +
                        "class='circle responsive-img'><h6 class='orange-text text-darken-2'><b>" + d.data.Name + "</b></h6><h6>"+d.data.Category+"</h6>" +
                        "<i class=\"fab fa-twitter cyan-text\"></i>" + "@"+d.data.Username +
                        "<br/><i class=\"fas fa-users\"></i> " + format(d.data.Followers))
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                }
                else{
                    if (d3.select(this).attr("class").indexOf("clickable") != -1){
                        var group = categories.groups[d.data.group];
                        group = group.replace(/\//g,'<br>');
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<br><br><br><h6><b>" + d.data.Name + "</b></h6><h6>"+group+"</h6><h6>"+ d.children.length +" Accounts </h6>"
                        )
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px")
                            .style('text-align', 'center');
                    }
                }
            })
            .on("mouseout", function(d) {
                if (d.data.Username){
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                } else {
                    if (d3.select(this).attr("class").indexOf("clickable") != -1){
                        div.transition()
                            .duration(200)
                            .style("opacity", 0);
                    } else {
                        svg.selectAll(".overlabels").transition()
                            .duration(200)
                            .style("opacity", 0.85)
                            .style("display", "inline");
                    }
                }
            })
            .on("click", function(d) {
                if (d.data.Username){
                    var url = 'https://twitter.com/'+ d.data.Username;
                    $window.open(url, '_blank')
                }
                else{
                    if (d3.select(this).attr("class").indexOf("clickable") != -1){
                        $scope.viewCategory(d.data.Name);
                        $scope.$apply();
                    }
                }
            });

        /*node.append("title")
            .text(function(d) { return d.data.Name + "\n" + format(d.value); });*/

        node.append("circle")
            .attr("r", function(d) { return d.r; })
            .style("fill", function(d){
                return d.data.color ? d.data.color : 'white';
            });

        node.filter(function(d) { return !d.children; }).append("text")
            .attr("dy", "0.3em")
            .text(function(d) { var max = (d.r / 2.5) - Math.sqrt(d.r); if (max > 15) max = max / 1.23; return d.data.Name.substring(0, max); })
            .style('fill', function(d) {
                var hsl = d3.hsl(d.data.color);
                return hsl.l > 0.5 ? 'black' : 'white';
            })
            .style('font-size', function(d){
                var fs = (Math.sqrt(d.r) + 8);
                return fs+'px';
            });

        var nodetwo = g.selectAll(".nodetwo")
            .data(pack(root).descendants())
            .enter().append("g")
            .attr("class", function(d) { var cls = "nodetwo"; if (!d.children){cls +=" leaf"} if (d.data.Name !== 'Influencer Report'){cls += " clickable";} return cls; })
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        /*nodetwo.append("title")
            .text(function(d) { return d.data.Name + "\n" + format(d.value); });*/

        nodetwo.append("circle")
            .attr("r", function(d) { return d.r; })
            .style("fill", 'none')
            .style('stroke', 'none');

        nodetwo.filter(function(d) { return !d.children; }).append("text")
            .attr("dy", "0.3em")
            .text('')
            .style('fill', 'none')
            .style('stroke', 'none');

        nodetwo.filter(function(d){return d.children && d.data.Name !== "Influencer Report";})
            .append("span")
            .attr('width','100px')
            .attr('height', '50px')
            .style('background-color', 'black');

        nodetwo.filter(function(d){return d.children && d.data.Name !== "Influencer Report";})
            .append("text")
            .attr('class', 'overlabels')
            .attr('dy','0.3em')
            .text(function(d) {return d.data.Name;})
            .style('fill', function(d){return d.data.color})
            .style('font-size', function(d){return (1 + (Math.sqrt(d.r)*4.5)) +'px'})
            .style('font-weight', 'bold')
            .style('stroke', 'black')
            .style('stroke-width', function(d){return (1 + (Math.sqrt(d.r)*4.5)) < 20 ? '1px' : '2px';})
            .style('opacity',0.85);
    };

    var removeChart = function(){
        d3.select("svg").selectAll('*').remove();
        d3.select('div#TOOLTIP-CONTENT').remove(function (d){$scope.$apply();});
    };

    $scope.viewCategory = function(name){
        select.filterBy = 'Categories';
        select.selectedCategories = [name];
        $scope.updateData();
    };

    $scope.updateData = function(forceType, clean){
        removeChart();
        accounts.formattedData = {
            Name: "Influencer Report",
            children: [],
            color: "white"
        };
        accounts.listData = [];
        accounts.count = 0;
        if (clean){
            select.loose = false;
            select.filterBy = select.filterChoices[0];
            select.selectedCategories = [];
            select.selectedGroups = [];
            for (var prop in categories.dict){
                if (categories.dict.hasOwnProperty(prop)){
                    accounts.formattedData.children.push({
                        Name: prop,
                        children: [],
                        color: categories.dict[prop].color,
                        group: categories.dict[prop].group
                    })
                }
            }
            accounts.data.forEach(function(account){
                var groupInfo = categories.dict[account.Category];
                if (!groupInfo){
                    groupInfo = {group: 9, color: 'black'};
                }
                account.color = groupInfo.color;
                account.group = groupInfo.group;

                var index = categori.indexOf(account.Category);
                if (index != -1){
                    accounts.formattedData.children[index].children.push(account);
                    accounts.listData.push(account);
                    accounts.count++;
                }
            });
        } else {
            if (!select.loose){
                for (var prop in categories.dict){
                    if (categories.dict.hasOwnProperty(prop)){
                        accounts.formattedData.children.push({
                            Name: prop,
                            children: [],
                            color: categories.dict[prop].color,
                            group: categories.dict[prop].group
                        })
                    }
                }
            }
            accounts.data.forEach(function(account){
                var groupInfo = categories.dict[account.Category];
                if (!groupInfo){
                    groupInfo = {group: 9, color: 'black'};
                }
                account.color = groupInfo.color;
                account.group = groupInfo.group;

                var index = categori.indexOf(account.Category);
                if (select.filterBy == 'None' && index != -1){
                    if (select.loose){
                        accounts.formattedData.children.push(account);
                    } else {
                        accounts.formattedData.children[index].children.push(account);
                    }
                    accounts.listData.push(account);
                    accounts.count += 1;
                } else if (select.filterBy == 'Categories' && index != -1){
                    if (select.selectedCategories.indexOf(account.Category) !== -1){
                        if (select.loose){
                            accounts.formattedData.children.push(account);
                        } else {
                            accounts.formattedData.children[index].children.push(account);
                        }
                        accounts.listData.push(account);
                        accounts.count += 1;
                    }
                } else if (select.filterBy == 'Groups' && index != -1){
                    if (select.selectedGroups.indexOf(categories.groups[account.group]) !== -1){
                        if (select.loose){
                            accounts.formattedData.children.push(account);
                        } else {
                            accounts.formattedData.children[index].children.push(account);
                        }
                        accounts.listData.push(account);
                        accounts.count += 1;
                    }
                } else if (select.filterBy == 'Threshold' && index != -1){
                    if (account['Blended Score'] >= select.threshold){
                        if (select.loose){
                            accounts.formattedData.children.push(account);
                        } else {
                            accounts.formattedData.children[index].children.push(account);
                        }
                        accounts.listData.push(account);
                        accounts.count += 1;
                    }
                }
            });
        }

        buildChart();
    };

    $scope.loadData = function(){
        var files = document.getElementById('selectFiles').files;
        console.log(files);
        if (files.length <= 0) {
            return false;
        }

        var fr = new FileReader();

        fr.onload = function(e) {
            var result = JSON.parse(e.target.result);
            var formatted = JSON.stringify(result, null, 2);
            accounts.data = result;
            console.log(accounts.data);
            formatData();
            $scope.accounts.loaded = true;
            $scope.$apply();
            buildChart();
        };

        fr.readAsText(files.item(0));
    };

    $scope.loadNewSet = function(first){
        if (first){
            LoadReportService.fetch(select.report.name).then(function(data) {
                accounts.data = data.data;
                accounts.listData = data.data;
                formatData();
                $scope.accounts.loaded = true;
                buildChart();
            });
        } else {
            LoadReportService.fetch(select.report.name).then(function(data) {
                accounts.data = data.data;
                $scope.accounts.loaded = true;
                $scope.updateData();
            });
        }
    };

    $scope.selectAccount = function(account){
        accounts.selected = account;
    };

    $scope.resetData = function(){
        $scope.updateData(false, true);
    };

    init();
}]);

app.factory('LoadReportService', function($q,$timeout,$http) {
    var players = {
        fetch: function(file, callback) {
            var deferred = $q.defer();
            $timeout(function() {
                $http.get("./templates/samples/gweinstein/"+file).then(function(data) {
                    deferred.resolve(data);
                });
            }, 30);

            return deferred.promise;
        }
    };

    return players;
});

app.controller('parchitectsCtrl', [
    '$scope',
    '$state',
    '$location',
    function($scope, $state, $location){

    }]
);
