'use strict';
/* Controllers */
var mod_exp = angular.module( 'hermann.electrode', [
    'ngResource',
    'ngRoute',
    'hermann.people',
    'ui.bootstrap',
    'angularModalService',
    'mod_tlv',
    'electrodeServices',
    'DeviceItemService'
    ]);

mod_exp.controller('ListElectrode', [
  '$scope', '$rootScope', 'electrode', 'DeviceItems' ,'ModalService', 'timeLine', 'Experiment',
  function($scope, $rootScope, electrode, DeviceItems, ModalService, timeLine, Experiment) {
    $rootScope.page_title = "Electrode";
  	$scope.electrode = electrode.get({}, function(data){
      $scope.electrode.objects.forEach( function( elec ){
        var $type = elec.type.split('/');
        var $item = elec.item.split('/');

        elec.items = DeviceItems.get({id: $item[3]},function(value, key){
          elec.descent = value.descent;
          elec.resistence = value.resistence;
          elec.zero = value.zero;
          elec.hemisphere = value.hemisphere;
          elec.craniotomy = value.craniotomy;
        });
      });
    });
    $scope.predicate = 'label';
    $scope.reverse = false;
    $scope.order = function(predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
      $scope.predicate = predicate;
    };
  }
]);

mod_exp.controller('DetailElectrode', ['$scope', '$rootScope', '$routeParams', 'timeLine', 'electrode', 'Experiment', 'DeviceItems',
function($scope, $rootScope, $routeParams, timeLine, electrode, Experiment, DeviceItems){
    $rootScope.page_title = "Electrode";
    $scope.elec = electrode.get( {id: $routeParams.eID}, function(data){
        var $item = $scope.elec.objects[0].item.split('/');
        $scope.elec = $scope.elec.objects[0];
        $scope.elec.items = DeviceItems.get({id: $item[3]},function(value, key){
          $scope.elec.descent = value.descent;
          $scope.elec.resistence = value.resistence;
          $scope.elec.zero = value.zero;
          $scope.elec.hemisphere = value.hemisphere;
          $scope.elec.craniotomy = value.craniotomy;
        });
    });
  }
]);
