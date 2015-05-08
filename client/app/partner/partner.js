'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('partner', {
        url: '/partner',
        templateUrl: 'app/partner/partner.html',
        controller: 'PartnerCtrl'
      });
  });