var mod_tlv = angular.module('mod_tlv', ['ui.bootstrap', 
                                         'angularModalService', 
                                         'timeLineServices', 
                                         'eventServices',
                                         'electrodeServices',
                                         'neuronServices',
                                         'protocolServices',
                                         'hermann.experiments',
                                         'CellTypeService',
                                         'DeviceTypeService',
                                         'SupplierService'
                                         ]);

mod_tlv.controller('timeLineVisualController', 
function ($scope, $rootScope, $compile, ModalService, $http, $q, timeLine, events, electrode, neuron, CellType, DeviceType, protocol, $routeParams, Experiment) {
    $scope.timeLineObj = [];
    $scope.eventObj = [];
    $scope.electrodeObj = [];
    $scope.neuronObj = [];
    $scope.protocolObj = [];

    $scope.idExp = 0;
    $scope.dateStartExp = "";
    $scope.dateEndExp = "";
    $scope.heightMinEpoch = 35;
    $rootScope.spin = 0;

    $scope.scale_coef = 60;

    // get the current experiment
    $scope.experiment = Experiment.get(
        {id:$routeParams.eID},
        function(data){ 
            console.log( $scope.experiment.id );

            // get timelines for this experiment only
            $scope.TLExp = timeLine.get(
                {experiment__id: $scope.experiment.id}, 
                function(data){
                    //console.log($scope.TLExp.objects);
                    // console.log($scope.TLExp.objects[0].name);
                    angular.forEach( $scope.TLExp.objects, function(value, key) {
                        //console.log(value.id);
                        //console.log($scope.TLExp.objects[key].id)

                        // get events
                        $scope.TLExp.objects[key].events = events.get(
                            {timeline__id: $scope.TLExp.objects[key].id}, 
                            function(data){}
                        );

                        // get epochs
                    });
                }
            );
        }
    );



});

mod_tlv.directive('timeLineDir', function(){
  return {
    replace: false,
    templateUrl: 'timeline/timeline.tpl.html'
  };
});

mod_tlv.directive('eventDir', function(){
  return {
    replace: false,
    templateUrl: 'timeline/event.tpl.html'
  };
});
