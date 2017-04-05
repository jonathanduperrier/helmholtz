'use strict';
/* Controllers */
var mod_exp = angular.module( 'hermann.protocol', [
    'ngResource',
    'ngRoute',
    'hermann.people',
    'ui.bootstrap',
    'angularModalService',
    'mod_tlv',
    'protocolServices',
    'RecordingRecordingService',
    'RecordingBlockService',
    ]);

mod_exp.controller('ListProtocol', [
  '$scope', '$rootScope', 'protocol' ,'ModalService', 'neuron','timeLine', 'Experiment', 'RecordingRecordings', 'RecordingBlocks',
  function($scope, $rootScope, protocol, ModalService, neuron, timeLine, Experiment, RecordingRecordings, RecordingBlocks) {
    $rootScope.page_title = "Protocol";
  	$scope.protocol = protocol.get({}, function(data){
      $scope.protocol.objects.forEach( function( prot ){
        var rec_recording = prot.rec_recording.split('/');
        var id_rec_recording = rec_recording[3];
        RecordingRecordings.get({id: id_rec_recording}, function(data){
          prot.depend = data.block;
          prot.text = data.name;
          prot.start = data.rec_datetime;

          var $neur = prot.depend.split('/');
          var $idNeur = $neur[3];
          prot.neuron = neuron.get({id:$idNeur});

          //get timeline
          var $timeline = prot.timeline.split('/');
          var $idTimeline = parseInt($timeline[3]);
          prot.timeline = timeLine.get({id:$idTimeline}, function(data){
            var $exp = data.experiment;
            //get experiment
            var $experiment = $exp.split('/');
            var $idExperiment = $experiment[2];
            prot.experiment = Experiment.get({id:$idExperiment});
            var id_depend = prot.depend.split("/");
            prot.neuron = RecordingBlocks.get({id:id_depend[3]});
          });
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

mod_exp.controller('DetailProtocol', ['$scope', '$rootScope', '$routeParams', 'timeLine', 'neuron', 'protocol', 'Experiment', 'RecordingRecordings',
function($scope, $rootScope, $routeParams, timeLine, neuron, protocol, Experiment){
  $rootScope.page_title = "Protocol";
  $scope.prot = protocol.get( {id: $routeParams.eID}, function(data){

  });
}]);
