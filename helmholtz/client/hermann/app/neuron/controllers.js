'use strict';
/* Controllers */
var mod_exp = angular.module( 'hermann.neuron', [
    'ngResource',
    'ngRoute',
    'hermann.people',
    'ui.bootstrap',
    'angularModalService',
    'mod_tlv',
    'neuronServices'
    ]);

mod_exp.controller('ListNeuron', [
  '$scope', '$rootScope', 'neuron' ,'ModalService', 'CellType', 'electrode', 'timeLine', 'Experiment',
  function($scope, $rootScope, neuron, ModalService, CellType, electrode, timeLine, Experiment) {
    $rootScope.page_title = "Cells";
  	$scope.neuron = neuron.get({}, function(data){
      $scope.neuron.objects.forEach( function( neur ){
        var $electrode = neur.depend.split('/');
        var $idElectrode = $electrode[3];
        neur.electrode = electrode.get({id:$idElectrode}, function(data){
          neur.parent = data.objects[0].text;
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

mod_exp.controller('DetailNeuron', ['$scope', '$rootScope', '$routeParams', 'timeLine', 'electrode' ,'neuron', 'Experiment', 'CellType',
function($scope, $rootScope, $routeParams, timeLine, electrode, neuron, Experiment, CellType){
    $rootScope.page_title = "Cells";
    $scope.neur = neuron.get( {id: $routeParams.eID}, function(neur){
        var $electrode = neur.objects[0].depend.split('/');
        var $idElectrode = $electrode[3];
        neur.start = neur.objects[0].start;
        neur.end = neur.objects[0].end;
        neur.text = neur.objects[0].text;
        neur.type = neur.objects[0].type;
        neur.electrode = electrode.get({id:$idElectrode}, function(data){
          neur.parent = data.objects[0].text;
        });
    });
}]);
