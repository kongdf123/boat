(function () {
    'use strict';

    angular
        .module('com.boat.app', [
            'app.core',
            //'app.routes',
            'ui.router'
        ]);

    angular
        .module('app.core', [
            'ngRoute'
        ]);

    angular
        .module('app.pages', [
            'app.core'
        ]);

    angular
        .module('app.pages')
        .controller('LoginController', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
            $scope.credentials = {
                username: '',
                password: ''
            };
            $scope.login = function (credentials) {
                AuthService.login(credentials).then(function (user) {
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    $scope.setCurrentUser(user);
                }, function () {
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                });
            }; javascript: void (0);
        });

    angular
        .module('com.boat.app')
        .constant('AUTH_EVENTS', {
            loginSuccess: 'auth-login-success',
            loginFailed: 'auth-login-failed',
            logoutSuccess: 'auth-logout-success',
            sessionTimeout: 'auth-session-timeout',
            notAuthenticated: 'auth-not-authenticated',
            notAuthorized: 'auth-not-authorized'
        })
        .constant('USER_ROLES', {
            all: '*',
            admin: 'admin',
            editor: 'editor',
            guest: 'guest'
        });

    angular
        .module('com.boat.app')
        .factory('AuthService', function ($http, Session) {
            var authService = {};

            authService.login = function (credentials) {
                return $http
                  .post('/login', credentials)
                  .then(function (res) {
                      Session.create(res.data.id, res.data.user.id,
                                     res.data.user.role);
                      return res.data.user;
                  });
            };

            authService.isAuthenticated = function () {
                return !!Session.userId;
            };

            authService.isAuthorized = function (authorizedRoles) {
                if (!angular.isArray(authorizedRoles)) {
                    authorizedRoles = [authorizedRoles];
                }
                return (authService.isAuthenticated() &&
                  authorizedRoles.indexOf(Session.userRole) !== -1);
            };
            return authService;
        });

    angular
        .module('com.noat.app')
        .service('Session', function () {
            this.create = function (sessionId, userId, userRole) {
                this.id = sessionId;
                this.userId = userId;
                this.userRole = userRole;
            };
            this.destroy = function () {
                this.id = null;
                this.userId = null;
                this.userRole = null;
            };
            return this;
        });

    angular
        .module('com.noat.app')
        .controller('ApplicationController', function ($scope, USER_ROLES, AuthService) {
            $scope.currentUser = null;
            $scope.userRoles = USER_ROLES;
            $scope.isAuthorized = AuthService.isAuthorized;

            $scope.setCurrentUser = function (user) {
                $scope.currentUser = user;
            };
        });

    angular
        .module('com.noat.app')
        .config(function ($stateProvider, USER_ROLES) {
            $stateProvider.state('dashboard', {
                url: '/dashboard',
                templateUrl: 'dashboard/index.html',
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
                }
            });
        });

    angular
        .module('com.noat.app')
        .run(function ($rootScope, AUTH_EVENTS, AuthService) {
            $rootScope.$on('$stateChangeStart', function (event, next) {
                var authorizedRoles = next.data.authorizedRoles;
                if (!AuthService.isAuthorized(authorizedRoles)) {
                    event.preventDefault();
                    if (AuthService.isAuthenticated()) {
                        // user is not allowed
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                    } else {
                        // user is not logged in
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                    }
                }
            });
        });

    angular
        .module('com.noat.app')
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push([
              '$injector',
              function ($injector) {
                  return $injector.get('AuthInterceptor');
              }
            ]);
        })
        .factory('AuthInterceptor', function ($rootScope, $q,AUTH_EVENTS) {
            return {
                responseError: function (response) { 
                    $rootScope.$broadcast({
                        401: AUTH_EVENTS.notAuthenticated,
                        403: AUTH_EVENTS.notAuthorized,
                        419: AUTH_EVENTS.sessionTimeout,
                        440: AUTH_EVENTS.sessionTimeout
                    }[response.status], response);
                    return $q.reject(response);
                }
            };
        });
})();