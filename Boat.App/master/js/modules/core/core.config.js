/// <reference path="E:\Documents\Visual Studio 2015\Projects\Boat\Boat.App\app/pages/login.html" />
(function () {
    'use strict';

    angular
        .module('app.core')
        .config(coreConfig);
    coreConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function coreConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
        .state('login', {
            url: '/login',
           templateUrl:'../app/pages/login.html'
        });
    }

    //coreConfig.$inject = ['$controllerProvider', '$complieProvider', '$filterProvider', '$provider'];
    //function coreConfig($controllerProvider, $complieProvider, $filterProvider, $provider) {
    //    var core = angular.module('app.core');
    //    // registering components after bootstrap
    //    core.controller = $controllerProvider.register;
    //    core.directive = $compileProvider.directive;
    //    core.filter = $filterProvider.register;
    //    core.factory = $provide.factory;
    //    core.service = $provide.service;
    //    core.constant = $provide.constant;
    //    core.value = $provide.value;
    //}
})();