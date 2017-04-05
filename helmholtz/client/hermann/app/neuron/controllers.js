'use strict';
/* Controllers */
var mod_exp = angular.module( 'hermann.neuron', [
    'ngResource',
    'ngRoute',
    'hermann.people',
    'ui.bootstrap',
    'angularModalService',
    'mod_tlv',
    'neuronServices',
    'RecordingBlockService',
    ]);

mod_exp.controller('ListNeuron', [
  '$scope', '$rootScope', 'neuron' ,'ModalService', 'CellType', 'electrode', 'timeLine', 'Experiment', 'RecordingBlocks',
  function($scope, $rootScope, neuron, ModalService, CellType, electrode, timeLine, Experiment, RecordingBlocks) {
    $rootScope.page_title = "Cells";
  	$scope.neuron = neuron.get({}, function(data){
      $scope.neuron.objects.forEach( function( neur ){
        var $electrode = neur.depend.split('/');
        var $idElectrode = $electrode[3];
        neur.electrode = electrode.get({id:$idElectrode}, function(data){
          neur.parent = data.objects[0].text;
        });
        if(neur.rec_blocks != null){
          var rec_blocks = neur.rec_blocks.split('/');
          var id_rec_blocks = rec_blocks[3];
          neur.recordings_block = RecordingBlocks.get({id:id_rec_blocks}, function(data){
            neur.name = data.name;
            neur.notes = data.notes;
          });
        }

        //get timeline
        var $timeline = neur.timeline.split('/');
        var $idTimeline = parseInt($timeline[3]);
        neur.timeline = timeLine.get({id:$idTimeline}, function(data){
          var $exp = data.experiment;
          //get experiment
          var $experiment = $exp.split('/');
          var $idExperiment = $experiment[2];
          neur.experiment = Experiment.get({id:$idExperiment});
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

mod_exp.controller('DetailNeuron', ['$scope', '$rootScope', '$routeParams', 'timeLine', 'electrode' ,'neuron', 'Experiment', 'CellType', 'RecordingBlocks',
function($scope, $rootScope, $routeParams, timeLine, electrode, neuron, Experiment, CellType, RecordingBlocks){
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
        if(neur.objects[0].rec_blocks != null){
          var rec_blocks = neur.objects[0].rec_blocks.split('/');
          var id_rec_blocks = rec_blocks[3];
          neur.recordings_block = RecordingBlocks.get({id:id_rec_blocks}, function(data){
            neur.name = data.name;
            neur.notes = data.notes;
          });
        }
    });
}]);
