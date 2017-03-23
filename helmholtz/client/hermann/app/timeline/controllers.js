var mod_tlv = angular.module('mod_tlv', ['ui.bootstrap',
                                         'angularModalService',
                                         'timeLineServices',
                                         'eventServices',
                                         'epochServices',
                                         'DeviceItemService',
                                         'RecordingBlockService',
                                         'RecordingAnimalService',
                                         'measurementService',
                                         'measurementParameterService',
                                         'hermann.experiments',
                                         'CellTypeService',
                                         'DeviceTypeService',
                                         'SupplierService',
                                         'ngRoute',
                                         ]);

mod_tlv.controller('timeLineVisualController',
function ($scope, $rootScope, $compile, ModalService, $http, $q, timeLine, events, epochs, CellType, DeviceType, $routeParams, Experiment, $route, DeviceItems, RecordingBlocks, RecordingAnimals, measurements, measurementsParameters) {
    $scope.$route = $route;
    $scope.id_content_type_item = "34";

    $scope.idExp = 0;
    $scope.dateStartExp = "";
    $scope.dateEndExp = "";
    $scope.min_epoch_height = 20;
    $rootScope.spin = 0;

    $scope.margin_bottom_timeline = 150;
    $scope.scale_coef = 60;

    $scope.config_defaults = {
        'CAT VISUAL INVIVO INTRA': {
            '1 Anesthetic': {
                'event': 'Alphaxan',
                'epoch': 'Alphaxan'
            },
            '2 Paralytic': {
                'event': 'Rocuronium',
                'epoch': 'Rocuronium'
            },
            '3 Physiologic': {
                'event': 'LRS+G5%',
                'epoch': 'LRS+G5%'
            },
            '4 Environment': {
                'event': 'Generic',
                'epoch': 'Generic'
            },
            '5 Electrode': {
                'event': 'Generic',
                'epoch': 'Generic'
            },
            '6 Neuron': {
                'event': 'Generic',
                'epoch': 'Generic'
            },
            '7 Protocol': {
                'event': 'Generic',
                'epoch': 'Generic'
            }
        },
        'CAT VISUAL INVIVO EXTRA': {
            '1 Anesthetic': {
                'event': 'Alphaxan',
                'epoch': 'Isoflurane'
            },
            '2 Paralytic': {
                'event': 'Rocuronium',
                'epoch': 'Rocuronium'
            },
            '3 Physiologic': {
                'event': 'LRS+G5%',
                'epoch': 'LRS+G5%'
            },
            '4 Environment': {
                'event': 'Generic',
                'epoch': 'Generic'
            },
            '5 Electrode': {
                'event': 'Generic',
                'epoch': 'Generic'
            },
            '6 Neuron': {
                'event': 'Generic',
                'epoch': 'Generic'
            },
            '7 Protocol': {
                'event': 'Generic',
                'epoch': 'Generic'
            }
        },
        'CAT VISUAL VSD': {
            '1 Anesthetic': {
                'event': 'Alphaxan',
                'epoch': 'Isoflurane'
            },
            '2 Paralytic': {
                'event': 'Rocuronium',
                'epoch': 'Rocuronium'
            },
            '3 Physiologic': {
                'event': 'LRS+G5%',
                'epoch': 'LRS+G5%'
            },
            '4 Environment': {
                'event': 'Generic',
                'epoch': 'Generic'
            },
            '5 Electrode': {
                'event': 'Descent',
                'epoch': 'Hollow'
            },
            '6 Neuron': {
                'event': 'Generic',
                'epoch': 'Generic'
            },
            '7 Protocol': {
                'event': 'Generic',
                'epoch': 'Generic'
            },
        },
    };

    $scope.config_choices = {
        '1 Anesthetic': [
            'Generic',
            'Alphaxan',
            'Propofol',
            'Isoflurane',
        ],
        '2 Paralytic': [
            'Generic',
            'Rocuronium',
            'Pancuronium',
            'Vecuronium',
            'Cisatracurium',
        ],
        '3 Physiologic': [
            'Generic',
            'NaCP',
            'LRS',
            'G5%',
            'LRS+G5%',
        ],
        '4 Environment': [
            'Generic'
        ],
        '5 Electrode epoch': [
            'Hollow',
            'Multi',
        ],
        '5 Electrode event': [
            'Descent',
            'Researcher',
        ],
        '6 Neuron': [
            'Generic'
        ],
        '7 Protocol': [
            'Generic'
        ],
    };

    $scope.depend_choices = {
        '6 Neuron': {
            timeline: '5 Electrode',
            timeline_key: null,
            option_epochs: []
        },
        '7 Protocol': {
            timeline: '6 Neuron',
            timeline_key: null,
            option_block: [] // {text:<parent.epoch.text>,resource_uri:<parent.epoch.uri>,closed}, {}
        },
    }

    $scope.stopSpin = function() {
      if($rootScope.spin == 1){
        setTimeout(function(){ angular.element(window).spin(); }, 3500);
      }
      $rootScope.spin = 0;
    };

    //$scope.stopSpin();

    // get the current experiment
    $scope.experiment = Experiment.get(
        {id:$routeParams.eID},
        function(data){
            angular.element(window).spin();
            $rootScope.spin = 1;

            //format of date of end experiment
            $dateEndExp = new Date($scope.experiment.end);
            if($scope.experiment.end != null){
              $scope.dateEndExp = $dateEndExp.format('dd/mm/yyyy - HH:MM');
            }
            //$scope.stopSpin();
            // get timelines for this experiment only
            $scope.TLExp = timeLine.get(
                {experiment__id: $scope.experiment.id},
                function(data){
                    angular.element(window).spin();
                    $rootScope.spin = 1;
                    angular.forEach( $scope.TLExp.objects, function(value, key) {
                        $scope.TLExp.objects[key].height = $scope.margin_bottom_timeline;
                        $scope.TLExp.objects[key].key = key;
                        // get dependency keys
                        angular.forEach( $scope.depend_choices, function(dep, k) {
                            if( dep.timeline == value.name ){
                                $scope.depend_choices[k].timeline_key = key;
                            };
                        });

                        // get events
                        $scope.TLExp.objects[key].events = events.get(
                            {timeline__id: $scope.TLExp.objects[key].id},
                            function(data){
                                angular.element(window).spin();
                                $rootScope.spin = 1;
                                angular.forEach( $scope.TLExp.objects[key].events.objects, function(value2, key2) {
                                    angular.element(".resetstarthour").remove();
                                    //calculation of event placement on timeline
                                    timeStampStartExp = $scope.experiment.start.valueOf();
                                    timeStampEvt = $scope.TLExp.objects[key].events.objects[key2].date.valueOf();
                                    $scope.TLExp.objects[key].events.objects[key2].vPlacement = ((new Date(timeStampEvt)/1e3|0) - (new Date(timeStampStartExp)/1e3|0)) / $scope.scale_coef;
                                    // check whether event placement is higher than current value
                                    if( $scope.TLExp.objects[key].events.objects[key2].vPlacement > $scope.TLExp.objects[key].height){
                                        $scope.TLExp.objects[key].height = $scope.TLExp.objects[key].events.objects[key2].vPlacement + $scope.margin_bottom_timeline;
                                    }
                                });
                                $scope.TLExp.objects[key].measurements = measurements.get(function(value3, key3){
                                });
                                $scope.TLExp.objects[key].measurementsParams = measurementsParameters.get(function(value4, key4){
                                });
                            }
                        );

                        // get epochs
                        $scope.TLExp.objects[key].epochs = epochs.get(
                            {timeline__id: $scope.TLExp.objects[key].id},
                            function(data){
                                angular.element(window).spin();
                                $rootScope.spin = 1;
                                angular.forEach( $scope.TLExp.objects[key].epochs.objects, function(value2, key2) {
                                    angular.element(".resetstarthour").remove();
                                    //calculation of event placement on timeline
                                    timeStampStartExp = $scope.experiment.start.valueOf();
                                    timeStampEpoch = $scope.TLExp.objects[key].epochs.objects[key2].start.valueOf();

                                    $scope.TLExp.objects[key].epochs.objects[key2].vPlacement = ((new Date(timeStampEpoch)/1e3|0) - (new Date(timeStampStartExp)/1e3|0)) / $scope.scale_coef;

                                    if($scope.TLExp.objects[key].epochs.objects[key2].end != null){
                                        timeStampEpochEnd = $scope.TLExp.objects[key].epochs.objects[key2].end.valueOf();
                                        $scope.TLExp.objects[key].epochs.objects[key2].epoch_height = ((new Date(timeStampEpochEnd)/1e3|0) - (new Date(timeStampEpoch)/1e3|0)) / $scope.scale_coef;
                                        if($scope.TLExp.objects[key].epochs.objects[key2].epoch_height < $scope.min_epoch_height){
                                          $scope.TLExp.objects[key].epochs.objects[key2].epoch_height = $scope.min_epoch_height;
                                        }
                                    }
                                    // check whether event placement is higher than current value
                                    if( $scope.TLExp.objects[key].epochs.objects[key2].vPlacement > $scope.TLExp.objects[key].height){
                                        $scope.TLExp.objects[key].height = $scope.TLExp.objects[key].epochs.objects[key2].vPlacement + $scope.margin_bottom_timeline;
                                    }
                                });
                                $scope.TLExp.objects[key].DeviceItems = DeviceItems.get({timeline__id: $scope.TLExp.objects[key].id},function(value3, key3){
                                });
                                $scope.TLExp.objects[key].RecordingBlocks = RecordingBlocks.get({timeline__id: $scope.TLExp.objects[key].id}, function(){});
                                $scope.TLExp.objects[key].RecordingAnimals = RecordingAnimals.get({timeline__id: $scope.TLExp.objects[key].id}, function(){});
                                angular.forEach($scope.TLExp.objects, function(value, key) {
                                  var current_timeline_height = $( "#timeline_"+value.id ).height();
                                  angular.forEach(value.epochs.objects, function(value2, key2) {
                                    if(value2.end == null){
                                      value2.epoch_height = current_timeline_height - value2.vPlacement;
                                    }
                                  });
                                });
                            }
                        );
                    });
                }
            );

            //chronometer
            var currentDate = new Date();
            var pastDate  = new Date($scope.experiment.start);
            var diff = currentDate.getTime() / 1000 - pastDate.getTime() / 1000;
            var clock = $('.clock').FlipClock(diff, {
                clockFace: 'DailyCounter',
                countdown: false
            });
            //end of chronometer
        }
    );

    //show dialog add event
    $scope.showDlgEvent = function( timeline, event ){
        text_event = "";
        // if we are creating an event, we initialize it here
        var tln = timeline.name.split(' ');
        var stop_show_dlg = 0;
        var cat_name_evt = "";
        if(((timeline.name == "5 Electrode") || (timeline.name == "6 Neuron")) && (timeline.epochs.objects.length<=0)){
            stop_show_dlg = 1;
            if(timeline.name == "5 Electrode"){
                cat_name_evt = "electrode"
            } else if (timeline.name == "6 Neuron"){
                cat_name_evt = "neuron"
            }
        }
        if( event == null ){
            // ADD
            var epcdepend = null;
            dateStartExp = $scope.experiment.start.valueOf();
            dateEvent = new Date();
            angular.forEach( timeline.epochs.objects, function(epc, k) {
                if(epc.end == null){
                  epcdepend = epc.resource_uri;
                  text_event = epc.type + " - " + epc.text + " - " + dateEvent.format('yyyy/mm/dd HH:MM');
                }
              }
            );
            event = {
                id : null,
                timeline : "/notebooks/timeline/" + timeline.id,
                text : text_event,
                date : dateEvent,
                dateFormat : dateEvent.format('yyyy/mm/dd HH:MM'),
                //type : $scope.config_defaults[$scope.experiment.type][timeline.name]['event'],
                color : "#FFFFFF",
                vPlacement : (((new Date(dateEvent)/1e3|0) - (new Date(dateStartExp)/1e3|0)) / $scope.scale_coef),
                depend : epcdepend,
            };
            // template add
            edition = false;
            var title_event = "Event "+tln[1];
            if(timeline.name == "7 Protocol"){
                $scope.depend_choices[timeline.name].option_block = [];
                angular.forEach($scope.TLExp.objects[timeline.key].RecordingBlocks.objects, function(block, k){
                    opt = {
                        name: block.name,
                        resource_uri: block.resource_uri,
                    }
                    $scope.depend_choices[timeline.name].option_block.push(opt);
                });
                $scope.config_choices = $scope.depend_choices;
            }
        } else {
            // EDIT
            edition = true;
            var currentDate = new Date();
            var startDate  = new Date(event.date);
            var diff = new Date(currentDate.getTime() - startDate.getTime());
            var diff_day = (diff.getDate())-1;
            var diff_hour = (diff.getHours())-1;
            if(diff_hour <= 9){
              diff_hour = "0"+diff_hour;
            }
            var diff_minute = (diff.getMinutes());
            if(diff_minute <= 9){
              diff_minute = "0"+diff_minute;
            }
            var title_event = "Event "+tln[1]+"      |||      "+startDate.format('dd/mm/yyyy HH:MM')+"      |||       "+diff_day+" / "+diff_hour+":"+diff_minute;
            
            if(timeline.name == "7 Protocol"){
                $scope.depend_choices[timeline.name].option_block = [];
                angular.forEach($scope.TLExp.objects[timeline.key].RecordingAnimals.objects, function(data){
                    if(data.resource_uri == event.rec_recording){
                        angular.forEach($scope.TLExp.objects[timeline.key].RecordingBlocks.objects, function(block, k){
                            if(block.resource_uri == data.block){
                                opt = {
                                    name: block.name,
                                    resource_uri: block.resource_uri,
                                }
                                $scope.depend_choices[timeline.name].option_block.push(opt);
                            }
                        });
                        event.block = data.block;
                        event.name = data.name;
                        event.date = event.rec_datetime = data.rec_datetime;
                        $scope.config_choices = $scope.depend_choices;
                    }
                });
            }
        }

        if(stop_show_dlg == 0){
            ModalService.showModal({
                templateUrl: "timeline/modal_dlg_event_"+tln[0]+".tpl.html",
                controller: "ManageEventController_"+tln[0],
                inputs: {
                    title: title_event,
                    config_defaults: $scope.config_defaults,
                    config_choices: $scope.config_choices,
                    timeline_name: timeline.name,
                    edition: edition,
                    event: event,
                    list_epoch: timeline.epochs.objects,
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then( function(result) {
                    if(result.del_evt == true){
                        if(timeline.name == "5 Electrode"){
                            $scope.showConfirmRemoveEvent(result.event, measurements, "");
                        } else if(timeline.name == "7 Protocol"){
                            $scope.showConfirmRemoveEvent(result.event, "", RecordingAnimals);
                        } else {
                            $scope.showConfirmRemoveEvent(result.event, "", "");
                        }
                    } else {
                        $scope.manageEvent( timeline, result.event, edition, measurements );
                    }
                });
            });
        } else {
            bootbox.alert("Please create an "+cat_name_evt+" before create an event !");
        }
    };

    //create event: display it in the timaline and insert it in the database
    $scope.manageEvent = function( timeline, event, edition, measurements ){
        var epoch_item_id = "";
        angular.element(window).spin();
        //hide reset start hour of experiment
        angular.element(".resetstarthour").remove();
        $rootScope.spin = 1;
        if(timeline.name == "5 Electrode"){
          angular.forEach( $scope.TLExp.objects[timeline.key].epochs.objects, function(epc, k) {
            if($scope.TLExp.objects[timeline.key].epochs.objects[k].resource_uri == event.depend){
              event.text = epc.text;
              epoch_item_array = epc.item.split('/');
              epoch_item_id = epoch_item_array[3];
            }
          });
        }
        if(edition == false){
            if(timeline.name == "7 Protocol"){
                angular.forEach( $scope.TLExp.objects[timeline.key].RecordingBlocks.objects, function(v, k) {
                    if(v.resource_uri == event.block){
                        event.type = v.name;
                    }
                });
                event.rec_datetime = event.date;
                event.text = event.name;
                event.color = "#cccccc";
                RecordingAnimal = {
                    block: event.block,
                    name: event.name,
                    rec_datetime: event.rec_datetime,
                }
                RecordingAnimals.post(RecordingAnimal, function(data){
                    RecordingAnimals.get({timeline__id: timeline.resource_uri}, function(data){
                        event.rec_recording = data.objects[data.objects.length-1].resource_uri;
                        $scope.postEvent(timeline, event, "protocol", measurements);
                    });
                });
            } else {
                $scope.postEvent(timeline, event, "normal", measurements);
            }
        } else {
            event.vPlacement = (((new Date(event.date.valueOf())/1e3|0) - (new Date($scope.experiment.start.valueOf())/1e3|0)) / $scope.scale_coef);
            if(timeline.name == "7 Protocol"){
                angular.forEach( $scope.TLExp.objects[timeline.key].RecordingBlocks.objects, function(v, k) {
                    if(v.resource_uri == event.block){
                        event.type = v.name;
                    }
                });
                event.rec_datetime = event.date;
                event.text = event.name;
                event.color = "#cccccc";
            }
            events.put({id:event.id}, angular.toJson(event), function(){
                if(timeline.name == "7 Protocol"){
                    RecordingAnimal = {
                        block: event.block,
                        name: event.name,
                        rec_datetime: event.rec_datetime,
                    }
                    id_rec_array = event.rec_recording.split('/');
                    id_rec = id_rec_array[3];
                    RecordingAnimals.put({id:id_rec}, angular.toJson(RecordingAnimal), function(){
                        angular.forEach( $scope.TLExp.objects[timeline.key].events.objects, function(value, key) {
                            if($scope.TLExp.objects[timeline.key].events.objects[key].id == event.id){
                                $scope.TLExp.objects[timeline.key].events.objects[key].text = event.name;
                                $scope.TLExp.objects[timeline.key].events.objects[key].date = event.rec_datetime;

                                $scope.TLExp.objects[timeline.key].events.objects[key].block = event.block;
                                $scope.TLExp.objects[timeline.key].events.objects[key].name = event.name;
                                $scope.TLExp.objects[timeline.key].events.objects[key].rec_datetime = event.rec_datetime;

                                $scope.TLExp.objects[timeline.key].RecordingAnimals.objects[key].block = event.block;
                                $scope.TLExp.objects[timeline.key].RecordingAnimals.objects[key].name = event.name;
                                $scope.TLExp.objects[timeline.key].RecordingAnimals.objects[key].rec_datetime = event.rec_datetime;
                            }
                        });
                    });
                }
                $scope.stopSpin();
            });
        }
    };

    $scope.postEvent = function(timeline, event, specific_event, measurements){
        events.post(event, function(data){
            event.id = data.id;
            $scope.TLExp.objects[timeline.key].events.objects.push(event);
            $scope.TLExp.objects[timeline.key].height = event.vPlacement + $scope.margin_bottom_timeline;
            angular.forEach($scope.TLExp.objects, function(value, key) {
                angular.forEach(value.epochs.objects, function(value2, key2) {
                    if(specific_event == "electrode"){
                        if(value2.measurement != null){
                          id_measurement_array = value2.measurement.split('/');
                          id_measurement = id_measurement_array[3];                      
                          var measurement_r = measurements.get({id: id_measurement},function(value3, key3){
                            value2.item = value3.resource_uri;
                            events.put({id:value2.id}, angular.toJson(value2));
                          });
                        }
                    }
                });
            });
            $scope.stopSpin();
        });
    };

    $scope.showConfirmRemoveEvent = function(event, measurements, RecordingAnimals) {
        ModalService.showModal({
            templateUrl: 'timeline/modal_confirm_remove_event.tpl.html',
            controller: "ModalController"
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                if (result=="Yes") {
                    $scope.removeEvent(event, measurements, RecordingAnimals);
                }
            });
        });
    };

    $scope.removeEvent = function(event, measurements, RecordingAnimals){
        angular.element('#event_' + event.id).remove();
        events.del({id:event.id});
        if(measurements != ""){
          measurements.del({id:measurements.id});
        }
        if((RecordingAnimals != "") && (event.rec_recording != null)){
            id_rec_recording_array = event.rec_recording.split('/');
            id_rec_recording = parseInt(id_rec_recording_array[3]);
            RecordingAnimals.del({id:id_rec_recording});
        }
    };

    //show dialog add epoch
    $scope.showDlgEpoch = function(timeline, epoch){
        var tln = timeline.name.split(' ');
        var epcdepend = null;
        angular.forEach( timeline.epochs.objects, function(epc, k) {
            if(epc.end == null){
              epcdepend = epc.resource_uri;
            }
          }
        );
        // check new epoch
          if( epoch == null ){
            // ADD
            dateStartExp = $scope.experiment.start.valueOf();
            dateStartEpoch = new Date();
            epoch = {
                id : null,
                timeline : "/notebooks/timeline/" + timeline.id,
                start : dateStartEpoch,
                dateFormat : dateStartEpoch.format('dd/mm/yyyy HH:MM'),
                //value : ,
                end : null,
                //type : $scope.config_defaults[$scope.experiment.type][timeline.name]['epoch'],
                text : "",
                color : "#FFF600",
                vPlacement : (((new Date(dateStartEpoch)/1e3|0) - (new Date(dateStartExp)/1e3|0)) / $scope.scale_coef),
                depend : null,
            }
            edition = false;
            var title_epoch = "Epoch "+tln[1];
        } else {
          // EDIT
          edition = true;
          var currentDate = new Date();
          var startDate  = new Date(epoch.start);
          var diff = new Date(currentDate.getTime() - startDate.getTime());
          var diff_day = (diff.getDate())-1;
          var diff_hour = (diff.getHours())-1;
          if(diff_hour <= 9){
            diff_hour = "0"+diff_hour;
          }
          var diff_minute = (diff.getMinutes());
          if(diff_minute <= 9){
            diff_minute = "0"+diff_minute;
          }

          var title_epoch = "Epoch "+tln[1]+" - "+startDate.format('dd/mm/yyyy HH:MM')+" - "+diff_day+" / "+diff_hour+":"+diff_minute;

            angular.forEach( $scope.TLExp.objects[timeline.key].epochs.objects, function(value, key) {
              if($scope.TLExp.objects[timeline.key].epochs.objects[key].id == epoch.id){
                epoch = $scope.TLExp.objects[timeline.key].epochs.objects[key];
              }
            });
        }

        // set dependencies
        if( $scope.depend_choices[timeline.name] != undefined ){
            // get all epochs in parent timeline
            $scope.depend_choices[timeline.name].option_epochs = [];
            angular.forEach( $scope.TLExp.objects[ $scope.depend_choices[timeline.name].timeline_key ].epochs.objects,
                function(epc, k) {
                    opt = {
                        text: epc.text,
                        resource_uri: "/notebooks/epoch/"+epc.id,
                        closed: epc.end==null ? false : true // if the epoch end date is null, it is an open epoch
                    }
                    $scope.depend_choices[timeline.name].option_epochs.push(opt)
                }
            );
        }
        //define controller in terms of timeline.name
        var continueDisplayModal = false;
        if((epcdepend != null) && (edition == false)){
          bootbox.confirm("An epoch is still running now! Do you want to continue ?",
            function(result){
              if(result == true){
                $scope.displayDlgEpoch(title_epoch, timeline, edition, epoch, tln, DeviceItems, RecordingBlocks);
              }
            }
          );
        } else {
          $scope.displayDlgEpoch(title_epoch, timeline, edition, epoch, tln, DeviceItems, RecordingBlocks);
        }
    };

    $scope.displayDlgEpoch = function(title_epoch, timeline, edition, epoch, tln, DeviceItems, RecordingBlocks){
      if(timeline.name == "5 Electrode"){
        angular.forEach($scope.TLExp.objects[timeline.key].DeviceItems.objects, function(data){
          if(data.resource_uri == epoch.item){
            epoch.label = data.descent+data.hemisphere+data.craniotomy;
            epoch.text = data.descent+data.hemisphere+data.craniotomy;
            epoch.descent = data.descent;
            epoch.resistence = data.resistence;
            epoch.zero = data.zero;
            epoch.hemisphere = data.hemisphere;
            epoch.craniotomy = data.craniotomy;
          }
        });
      }
      if(timeline.name == "6 Neuron"){
        angular.forEach($scope.TLExp.objects[timeline.key].RecordingBlocks.objects, function(data){
            if(data.resource_uri == epoch.rec_blocks){
                epoch.name = data.name;
                epoch.start = data.start;
                epoch.end = data.end;
                epoch.notes = data.notes;
            }
        });
      }

      ModalService.showModal({
          templateUrl: "timeline/modal_dlg_epoch_"+tln[0]+".tpl.html",
          controller: "ManageEpochController_"+tln[0],
          inputs: {
              title: title_epoch,
              depend_choices: $scope.depend_choices,
              config_choices: $scope.config_choices,
              timeline_name: timeline.name,
              edition: edition,
              epoch: epoch,
          }
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {
              if(result.del_epoch == true){
                  if(timeline.name == "5 Electrode"){
                    $scope.showConfirmRemoveEpoch(result.epoch, DeviceItems, "");
                  } else if(timeline.name == "6 Neuron") {
                    $scope.showConfirmRemoveEpoch(result.epoch, "", RecordingBlocks);
                  } else {
                    $scope.showConfirmRemoveEpoch(result.epoch, "", "");
                  }
              } else {
                  $scope.manageEpoch( timeline, result.epoch, edition, DeviceItems );
              }
          });
      });
    };


    //create epoch: display it in the timaline and insert it in the database
    $scope.manageEpoch = function(timeline, epoch, edition, DeviceItems){
        angular.element(window).spin();
        angular.element(".resetstarthour").remove();
        $rootScope.spin = 1;
          if(edition == false){
            if(timeline.name == "5 Electrode"){
              epoch.label = epoch.descent+epoch.hemisphere+epoch.craniotomy;
              epoch.text = epoch.descent+epoch.hemisphere+epoch.craniotomy;
              DeviceItem = {
                  type : "/stimulations/type/default",//obligatoire
                  label : epoch.label,
                  descent : epoch.descent,
                  resistence : epoch.resistence,
                  zero : epoch.zero,
                  hemisphere : epoch.hemisphere,
                  craniotomy : epoch.craniotomy,
              }
              DeviceItems.post(DeviceItem, function(data){
                DeviceItems.get({timeline__id: timeline.resource_uri}, function(data){
                  epoch.item = data.objects[data.objects.length-1].resource_uri;
                  $scope.postEpoch(epoch, timeline, "electrode", DeviceItems);
                });
                //$scope.stopSpin();
              });
            } else if(timeline.name == "6 Neuron") {
                RecordingBlock = {
                    experiment: "/experiment/"+$scope.experiment.id,
                    name : epoch.name,
                    start : epoch.start,
                    end : epoch.end,
                    notes : epoch.notes,
                }
                epoch.type = epoch.name;
                epoch.text = epoch.notes;
                RecordingBlocks.post(RecordingBlock, function(data){
                    RecordingBlocks.get({timeline__id: timeline.resource_uri}, function(data){
                        epoch.rec_blocks = data.objects[data.objects.length-1].resource_uri;
                        $scope.postEpoch(epoch, timeline, "neuron", RecordingBlocks);
                    });
                });
            } else {
              //post epoch
              $scope.postEpoch(epoch, timeline, "normal", DeviceItems);
            }
        } else {
            if(timeline.name == "5 Electrode"){
                epoch.label = epoch.descent+epoch.hemisphere+epoch.craniotomy;
                epoch.text = epoch.descent+epoch.hemisphere+epoch.craniotomy;
            } else if(timeline.name == "6 Neuron"){
                epoch.type = epoch.name;
                epoch.text = epoch.notes;
            }
            epochs.put({id:epoch.id}, angular.toJson(epoch), function(){
                if(epoch.end != null){
                    epoch.epoch_height = ((new Date(epoch.end)/1e3|0) - (new Date(epoch.start)/1e3|0)) / $scope.scale_coef;
                    if(epoch.epoch_height < $scope.min_epoch_height){
                      epoch.epoch_height = $scope.min_epoch_height;
                    }
                }
                if(timeline.name == "5 Electrode"){
                  DeviceItem = {
                      type : "/stimulations/type/default",//obligatoire
                      label : epoch.descent+epoch.hemisphere+epoch.craniotomy,
                      descent : epoch.descent,
                      resistence : epoch.resistence,
                      zero : epoch.zero,
                      hemisphere : epoch.hemisphere,
                      craniotomy : epoch.craniotomy,
                  }
                  epoch.label = epoch.descent+epoch.hemisphere+epoch.craniotomy;
                  epoch.text = epoch.descent+epoch.hemisphere+epoch.craniotomy;
                  id_item_array = epoch.item.split('/');
                  id_item = id_item_array[3];
                  DeviceItems.put({id:id_item}, angular.toJson(DeviceItem), function(){
                    angular.forEach( $scope.TLExp.objects[timeline.key].epochs.objects, function(value, key) {
                      if($scope.TLExp.objects[timeline.key].epochs.objects[key].id == epoch.id){
                        $scope.TLExp.objects[timeline.key].epochs.objects[key].label = DeviceItem.label;
                        $scope.TLExp.objects[timeline.key].epochs.objects[key].descent = DeviceItem.descent;
                        $scope.TLExp.objects[timeline.key].epochs.objects[key].resistence = DeviceItem.resistence;
                        $scope.TLExp.objects[timeline.key].epochs.objects[key].zero = DeviceItem.zero;
                        $scope.TLExp.objects[timeline.key].epochs.objects[key].hemisphere = DeviceItem.hemisphere;
                        $scope.TLExp.objects[timeline.key].epochs.objects[key].craniotomy = DeviceItem.craniotomy;
                      }
                    });
                  });
                }
                if(timeline.name == "6 Neuron"){
                    RecordingBlock = {
                        experiment: "/experiment/"+$scope.experiment.id,
                        name : epoch.name,
                        start : epoch.start,
                        end : epoch.end,
                        notes : epoch.notes,
                    }                    
                    id_block_array = epoch.rec_blocks.split('/');
                    id_block = id_block_array[3];
                    RecordingBlocks.put({id:id_block}, angular.toJson(RecordingBlock), function(){
                        angular.forEach( $scope.TLExp.objects[timeline.key].epochs.objects, function(value, key) {
                            if($scope.TLExp.objects[timeline.key].epochs.objects[key].id == epoch.id){
                                $scope.TLExp.objects[timeline.key].epochs.objects[key].text = RecordingBlock.notes;
                                $scope.TLExp.objects[timeline.key].epochs.objects[key].type = RecordingBlock.name;
                                $scope.TLExp.objects[timeline.key].epochs.objects[key].start = RecordingBlock.start;
                                $scope.TLExp.objects[timeline.key].epochs.objects[key].end = RecordingBlock.end;
                                $scope.TLExp.objects[timeline.key].epochs.objects[key].notes = RecordingBlock.notes;

                                $scope.TLExp.objects[timeline.key].RecordingBlocks.objects[key].name = RecordingBlock.name;
                                $scope.TLExp.objects[timeline.key].RecordingBlocks.objects[key].start = RecordingBlock.start;
                                $scope.TLExp.objects[timeline.key].RecordingBlocks.objects[key].end = RecordingBlock.end;
                                $scope.TLExp.objects[timeline.key].RecordingBlocks.objects[key].notes = RecordingBlock.notes;
                            }
                        });
                    });
                }
                $scope.stopSpin();
            });
        }
    };

    $scope.postEpoch = function(epoch, timeline, specific_epoch, DeviceItems){
      epochs.post(epoch, function(data){
          epoch.id = data.id;
          $scope.TLExp.objects[timeline.key].epochs.objects.push(epoch);
          $scope.TLExp.objects[timeline.key].height = epoch.vPlacement + $scope.margin_bottom_timeline;
          angular.forEach($scope.TLExp.objects, function(value, key) {
            var current_timeline_height = $( "#timeline_"+value.id ).height();
            angular.forEach(value.epochs.objects, function(value2, key2) {
              if(value2.end == null){
                value2.epoch_height = current_timeline_height - value2.vPlacement;
              }
              if(specific_epoch == "electrode"){
                if(value2.item != null){
                  id_item_array = value2.item.split('/');
                  id_item = id_item_array[3];
                  var DeviceItem_r = DeviceItems.get({id: id_item},function(value3, key3){
                    value2.item = value3.resource_uri;
                    epochs.put({id:value2.id}, angular.toJson(value2));
                  });
                }
              }
            });
          });
          $scope.stopSpin();
      });
    };

    $scope.showConfirmRemoveEpoch = function(epoch, DeviceItems, RecordingBlocks) {
        ModalService.showModal({
            templateUrl: 'timeline/modal_confirm_remove_epoch.tpl.html',
            controller: "ModalController"
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                if (result=="Yes") {
                    $scope.removeEpoch(epoch, DeviceItems, RecordingBlocks);
                }
            });
        });
    };

    $scope.removeEpoch = function(epoch, DeviceItems, RecordingBlocks){
        angular.element('#epoch_' + epoch.id).remove();
        epochs.del({id:epoch.id});
        if((DeviceItems != "") && (epoch.item != null)){
          id_item_array = epoch.item.split('/');
          id_item = parseInt(id_item_array[3]);
          DeviceItems.del({id:id_item});
        }
        if((RecordingBlocks != "") && (epoch.rec_blocks != null)){
          id_rec_block_array = epoch.rec_blocks.split('/');
          id_rec_block = parseInt(id_rec_block_array[3]);
          RecordingBlocks.del({id:id_rec_block});
        }
    };

    $scope.displayZoomEvent = function(scale_coef){
        $scope.scale_coef = scale_coef;
        $scope.$route.reload();
    };

    $scope.stopExperiment = function() {
      ModalService.showModal({
          templateUrl: 'timeline/modal_confirm_stop_exp.tpl.html',
          controller: "ModalController"
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {
              if (result=="Yes") {
                $scope.experiment.end = new Date();
                $scope.jsonContentExp = angular.toJson($scope.experiment);
                Experiment.put({id:$scope.experiment.id}, $scope.jsonContentExp, function(){
                    angular.element(".btnAddEvtEpoch button").remove();
                    angular.element(".glyphicon-stop").remove();
                    angular.element(".resetstarthour").remove();
                });
              }
          });
      });
    };

    $scope.showConfirmResetStartHour = function() {
        ModalService.showModal({
            templateUrl: 'timeline/modal_confirm_reset_start.tpl.html',
            controller: "ModalController"
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                if (result=="Yes") {
                    $scope.resetStartHour();
                }
            });
        });
    };

    $scope.resetStartHour = function() {
        $scope.experiment.start = new Date();
        $scope.jsonContentExp = angular.toJson($scope.experiment);
        Experiment.put({id:$scope.experiment.id}, $scope.jsonContentExp, function(){});
        //renitialisation of the timer
        var clock = $('.clock').FlipClock({
            clockFace: 'DailyCounter',
            countdown: false
        });
    };
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

mod_tlv.directive('epochDir', function(){
  return {
    replace: false,
    templateUrl: 'timeline/epoch.tpl.html'
  };
});

mod_tlv.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    var global_height = $(document).height() - ($(".navbar-fixed-top").height() + $("#fixed_bar").height());
                    angular.element("#graduation").remove();
                    angular.element(".timeline-column").height(global_height);
                });
            }
        }
    }
});


mod_tlv.controller('ManageEventController_1', [
    '$scope', '$element', 'title', 'close', 'list_epoch', 'config_choices', 'timeline_name', 'edition', 'event',
    function($scope, $element, title, close, list_epoch, config_choices, timeline_name, edition, event) {

    $scope.event = event;
    $scope.event.date = new Date(event.date).format("yyyy/mm/dd HH:MM");
    $scope.title = title;
    $scope.list_selection = config_choices[timeline_name];
    $scope.depend_selection = list_epoch;
    $scope.edition = edition;
    $scope.del_evt = false;

    $scope.beforeClose = function() {
        event.date = new Date($scope.event.date);
        if($scope.event.text == ""){
            $scope.msgAlert = "Text field is required";
        } else if(($scope.event.type == "") || ($scope.event.type == null)){
            $scope.msgAlert = "Type field is required";
        } else {
            $scope.close();
        }
    };

    $scope.delete = function(){
        $scope.del_evt = true;
        $scope.close();
    };

    $scope.close = function() {
        close({
            event: $scope.event,
            del_evt: $scope.del_evt,
        }, 100); // close, but give 500ms for bootstrap to animate
    };

    //  This cancel function must use the bootstrap, 'modal' function because
    //  the doesn't have the 'data-dismiss' attribute.
    $scope.cancel = function() {
        //  Manually hide the modal.
        $element.modal('hide');
        //  Now call close, returning control to the caller.
        close({
            event: $scope.event,
        }, 100); // close, but give 500ms for bootstrap to animate
    };
}]);

mod_tlv.controller('ManageEventController_2', [
    '$scope', '$element', 'title', 'close', 'list_epoch', 'config_choices', 'timeline_name', 'edition', 'event',
    function($scope, $element, title, close, list_epoch, config_choices, timeline_name, edition, event) {

    $scope.event = event;
    $scope.event.date = new Date(event.date).format("yyyy/mm/dd HH:MM");
    $scope.title = title;
    $scope.list_selection = config_choices[timeline_name];
    $scope.depend_selection = list_epoch;
    $scope.edition = edition;
    $scope.del_evt = false;

    $scope.beforeClose = function() {
        event.date = new Date($scope.event.date);
        if($scope.event.text == ""){
            $scope.msgAlert = "Text field is required";
        } else if(($scope.event.type == "") || ($scope.event.type == null)){
            $scope.msgAlert = "Type field is required";
        } else {
            $scope.close();
        }
    };

    $scope.delete = function(){
        $scope.del_evt = true;
        $scope.close();
    };

    $scope.close = function() {
        close({
            event: $scope.event,
            del_evt: $scope.del_evt,
        }, 100); // close, but give 500ms for bootstrap to animate
    };

    //  This cancel function must use the bootstrap, 'modal' function because
    //  the doesn't have the 'data-dismiss' attribute.
    $scope.cancel = function() {
        //  Manually hide the modal.
        $element.modal('hide');
        //  Now call close, returning control to the caller.
        close({
            event: $scope.event,
        }, 100); // close, but give 500ms for bootstrap to animate
    };
}]);

mod_tlv.controller('ManageEventController_3', [
    '$scope', '$element', 'title', 'close', 'list_epoch', 'config_choices', 'timeline_name', 'edition', 'event',
    function($scope, $element, title, close, list_epoch, config_choices, timeline_name, edition, event) {

    $scope.event = event;
    $scope.event.date = new Date(event.date).format("yyyy/mm/dd HH:MM");
    $scope.title = title;
    $scope.list_selection = config_choices[timeline_name];
    $scope.depend_selection = list_epoch;
    $scope.edition = edition;
    $scope.del_evt = false;

    $scope.beforeClose = function() {
        event.date = new Date($scope.event.date);
        if($scope.event.text == ""){
            $scope.msgAlert = "Text field is required";
        } else if(($scope.event.type == "") || ($scope.event.type == null)){
            $scope.msgAlert = "Type field is required";
        } else {
            $scope.close();
        }
    };

    $scope.delete = function(){
        $scope.del_evt = true;
        $scope.close();
    };

    $scope.close = function() {
        close({
            event: $scope.event,
            del_evt: $scope.del_evt,
        }, 100); // close, but give 500ms for bootstrap to animate
    };

    //  This cancel function must use the bootstrap, 'modal' function because
    //  the doesn't have the 'data-dismiss' attribute.
    $scope.cancel = function() {
        //  Manually hide the modal.
        $element.modal('hide');
        //  Now call close, returning control to the caller.
        close({
            event: $scope.event,
        }, 100); // close, but give 500ms for bootstrap to animate
    };
}]);

mod_tlv.controller('ManageEventController_4', [
    '$scope', '$element', 'title', 'close', 'list_epoch', 'config_choices', 'timeline_name', 'edition', 'event',
    function($scope, $element, title, close, list_epoch, config_choices, timeline_name, edition, event) {

    $scope.event = event;
    $scope.event.date = new Date(event.date).format("yyyy/mm/dd HH:MM");
    $scope.title = title;
    $scope.list_selection = config_choices[timeline_name];
    $scope.depend_selection = list_epoch;
    $scope.edition = edition;
    $scope.del_evt = false;

    $scope.beforeClose = function() {
        event.date = new Date($scope.event.date);
        if($scope.event.text == ""){
            $scope.msgAlert = "Text field is required";
        } else if(($scope.event.type == "") || ($scope.event.type == null)){
            $scope.msgAlert = "Type field is required";
        } else {
            $scope.close();
        }
    };

    $scope.delete = function(){
        $scope.del_evt = true;
        $scope.close();
    };

    $scope.close = function() {
        close({
            event: $scope.event,
            del_evt: $scope.del_evt,
        }, 100); // close, but give 500ms for bootstrap to animate
    };

    //  This cancel function must use the bootstrap, 'modal' function because
    //  the doesn't have the 'data-dismiss' attribute.
    $scope.cancel = function() {
        //  Manually hide the modal.
        $element.modal('hide');
        //  Now call close, returning control to the caller.
        close({
            event: $scope.event,
        }, 100); // close, but give 500ms for bootstrap to animate
    };
}]);

mod_tlv.controller('ManageEventController_5', [
    '$scope', '$element', 'title', 'close', 'list_epoch', 'config_choices', 'timeline_name', 'edition', 'event',
    function($scope, $element, title, close, list_epoch, config_choices, timeline_name, edition, event) {

    $scope.event = event;
    $scope.event.date = new Date(event.date).format("yyyy/mm/dd HH:MM");
    $scope.title = title;
    $scope.list_selection = config_choices[timeline_name+" event"];
    $scope.depend_selection = list_epoch;
    $scope.edition = edition;
    $scope.del_evt = false;

    $scope.beforeClose = function() {
        event.date = new Date($scope.event.date);
        /*if($scope.event.text == ""){
            $scope.msgAlert = "Text field is required";
        } else */if(($scope.event.type == "") || ($scope.event.type == null)){
            $scope.msgAlert = "Type field is required";
        } /*else if((event.depend == "") || (event.depend == null)) {
            $scope.msgAlert = "Depend field is required";
        } */else {
            $scope.close();
        }
    };

    $scope.delete = function(){
        $scope.del_evt = true;
        $scope.close();
    };

    $scope.close = function() {
        close({
            event: $scope.event,
            del_evt: $scope.del_evt,
        }, 100); // close, but give 500ms for bootstrap to animate
    };

    //  This cancel function must use the bootstrap, 'modal' function because
    //  the doesn't have the 'data-dismiss' attribute.
    $scope.cancel = function() {
        //  Manually hide the modal.
        $element.modal('hide');
        //  Now call close, returning control to the caller.
        close({
            event: $scope.event,
        }, 100); // close, but give 500ms for bootstrap to animate
    };
}]);

mod_tlv.controller('ManageEventController_6', [
    '$scope', '$element', 'title', 'close', 'list_epoch', 'config_choices', 'timeline_name', 'edition', 'event',
    function($scope, $element, title, close, list_epoch, config_choices, timeline_name, edition, event) {

    $scope.event = event;
    $scope.event.date = new Date(event.date).format("yyyy/mm/dd HH:MM");
    $scope.title = title;
    $scope.list_selection = config_choices[timeline_name];
    $scope.depend_selection = list_epoch;
    $scope.edition = edition;
    $scope.del_evt = false;

    $scope.beforeClose = function() {
        event.date = new Date($scope.event.date);
        if($scope.event.text == ""){
            $scope.msgAlert = "Text field is required";
        } else if(($scope.event.type == "") || ($scope.event.type == null)){
            $scope.msgAlert = "Type field is required";
        } else {
            $scope.close();
        }
    };

    $scope.delete = function(){
        $scope.del_evt = true;
        $scope.close();
    };

    $scope.close = function() {
        close({
            event: $scope.event,
            del_evt: $scope.del_evt,
        }, 100); // close, but give 500ms for bootstrap to animate
    };

    //  This cancel function must use the bootstrap, 'modal' function because
    //  the doesn't have the 'data-dismiss' attribute.
    $scope.cancel = function() {
        //  Manually hide the modal.
        $element.modal('hide');
        //  Now call close, returning control to the caller.
        close({
            event: $scope.event,
        }, 100); // close, but give 500ms for bootstrap to animate
    };
}]);

mod_tlv.controller('ManageEventController_7', [
    '$scope', '$element', 'title', 'close', 'list_epoch', 'config_choices', 'timeline_name', 'edition', 'event',
    function($scope, $element, title, close, list_epoch, config_choices, timeline_name, edition, event) {

    $scope.event = event;
    $scope.event.date = new Date(event.date).format("yyyy/mm/dd HH:MM");
    $scope.title = title;
    $scope.list_blocks = config_choices[timeline_name];
    $scope.depend_selection = list_epoch;
    $scope.edition = edition;
    $scope.del_evt = false;

    $scope.beforeClose = function() {
        event.date = new Date($scope.event.date);
        if($scope.event.name == ""){
            $scope.msgAlert = "Name field is required";
        } else if(($scope.event.block == "") || ($scope.event.block == null)){
            $scope.msgAlert = "Depend block is required";
        } else {
            $scope.close();
        }
    };

    $scope.delete = function(){
        $scope.del_evt = true;
        $scope.close();
    };

    $scope.close = function() {
        close({
            event: $scope.event,
            del_evt: $scope.del_evt,
        }, 100); // close, but give 500ms for bootstrap to animate
    };

    //  This cancel function must use the bootstrap, 'modal' function because
    //  the doesn't have the 'data-dismiss' attribute.
    $scope.cancel = function() {
        //  Manually hide the modal.
        $element.modal('hide');
        //  Now call close, returning control to the caller.
        close({
            event: $scope.event,
        }, 100); // close, but give 500ms for bootstrap to animate
    };
}]);

mod_tlv.controller('ManageEpochController_1', [
    '$scope', '$element', 'title', 'close', 'depend_choices', 'config_choices', 'timeline_name', 'edition', 'epoch',
    function($scope, $element, title, close, depend_choices, config_choices, timeline_name, edition, epoch) {

    $scope.epoch = epoch;
    $scope.title = title;
    $scope.list_selection = config_choices[timeline_name];
    $scope.depend_selection = depend_choices[timeline_name];
    $scope.edition = edition;
    $scope.del_epoch = false;

    $scope.beforeClose = function() {
        if($scope.epoch.text == ""){
            $scope.msgAlert = "Text field is required";
        } else if(($scope.epoch.type == "") || ($scope.epoch.type == null)){
            $scope.msgAlert = "Type field is required";
        } else if(($scope.epoch.depend == null) && ((timeline_name == "6 Neuron") || (timeline_name == "7 Protocol"))) {
            $scope.msgAlert = "Parent field is required";
        } else {
            $scope.close();
        }
    };

    $scope.delete = function(){
        $scope.del_epoch = true;
        $scope.close();
    };

    $scope.close = function() {
        close({
            epoch: $scope.epoch,
            del_epoch: $scope.del_epoch,
        }, 100); // close, but give 500ms for bootstrap to animate
    };

    $scope.stop = function(){
      bootbox.confirm( "Do you really want to stop this epoch ?",
        function(result){
          if(result == true){
            $scope.epoch.end = new Date();
            $scope.close();
          }
        }
      );
    };

  //  This cancel function must use the bootstrap, 'modal' function because
  //  the doesn't have the 'data-dismiss' attribute.
    $scope.cancel = function() {
    //  Manually hide the modal.
    $element.modal('hide');
    //  Now call close, returning control to the caller.
        close({
            epoch: $scope.epoch,
        }, 100); // close, but give 500ms for bootstrap to animate
    };
}]);

mod_tlv.controller('ManageEpochController_2', [
    '$scope', '$element', 'title', 'close', 'depend_choices', 'config_choices', 'timeline_name', 'edition', 'epoch',
    function($scope, $element, title, close, depend_choices, config_choices, timeline_name, edition, epoch) {

    $scope.epoch = epoch;
    $scope.title = title;
    $scope.list_selection = config_choices[timeline_name];
    $scope.depend_selection = depend_choices[timeline_name];
    $scope.edition = edition;
    $scope.del_epoch = false;

    $scope.beforeClose = function() {
        if($scope.epoch.text == ""){
            $scope.msgAlert = "Text field is required";
        } else if(($scope.epoch.type == "") || ($scope.epoch.type == null)){
            $scope.msgAlert = "Type field is required";
        } else if(($scope.epoch.depend == null) && ((timeline_name == "6 Neuron") || (timeline_name == "7 Protocol"))) {
            $scope.msgAlert = "Parent field is required";
        } else {
            $scope.close();
        }
    };

    $scope.delete = function(){
        $scope.del_epoch = true;
        $scope.close();
    };

    $scope.close = function() {
        close({
            epoch: $scope.epoch,
            del_epoch: $scope.del_epoch,
        }, 100); // close, but give 500ms for bootstrap to animate
    };

    $scope.stop = function(){
      bootbox.confirm( "Do you really want to stop this epoch ?",
        function(result){
          if(result == true){
            $scope.epoch.end = new Date();
            $scope.close();
          }
        }
      );
    };

  //  This cancel function must use the bootstrap, 'modal' function because
  //  the doesn't have the 'data-dismiss' attribute.
    $scope.cancel = function() {
    //  Manually hide the modal.
    $element.modal('hide');
    //  Now call close, returning control to the caller.
        close({
            epoch: $scope.epoch,
        }, 100); // close, but give 500ms for bootstrap to animate
    };
}]);

mod_tlv.controller('ManageEpochController_3', [
    '$scope', '$element', 'title', 'close', 'depend_choices', 'config_choices', 'timeline_name', 'edition', 'epoch',
    function($scope, $element, title, close, depend_choices, config_choices, timeline_name, edition, epoch) {

    $scope.epoch = epoch;
    $scope.title = title;
    $scope.list_selection = config_choices[timeline_name];
    $scope.depend_selection = depend_choices[timeline_name];
    $scope.edition = edition;
    $scope.del_epoch = false;

    $scope.beforeClose = function() {
        if($scope.epoch.text == ""){
            $scope.msgAlert = "Text field is required";
        } else if(($scope.epoch.type == "") || ($scope.epoch.type == null)){
            $scope.msgAlert = "Type field is required";
        } else if(($scope.epoch.depend == null) && ((timeline_name == "6 Neuron") || (timeline_name == "7 Protocol"))) {
            $scope.msgAlert = "Parent field is required";
        } else {
            $scope.close();
        }
    };

    $scope.delete = function(){
        $scope.del_epoch = true;
        $scope.close();
    };

    $scope.close = function() {
        close({
            epoch: $scope.epoch,
            del_epoch: $scope.del_epoch,
        }, 100); // close, but give 500ms for bootstrap to animate
    };

    $scope.stop = function(){
      bootbox.confirm( "Do you really want to stop this epoch ?",
        function(result){
          if(result == true){
            $scope.epoch.end = new Date();
            $scope.close();
          }
        }
      );
    };

  //  This cancel function must use the bootstrap, 'modal' function because
  //  the doesn't have the 'data-dismiss' attribute.
    $scope.cancel = function() {
    //  Manually hide the modal.
    $element.modal('hide');
    //  Now call close, returning control to the caller.
        close({
            epoch: $scope.epoch,
        }, 100); // close, but give 500ms for bootstrap to animate
    };
}]);

mod_tlv.controller('ManageEpochController_4', [
    '$scope', '$element', 'title', 'close', 'depend_choices', 'config_choices', 'timeline_name', 'edition', 'epoch',
    function($scope, $element, title, close, depend_choices, config_choices, timeline_name, edition, epoch) {

    $scope.epoch = epoch;
    $scope.title = title;
    $scope.list_selection = config_choices[timeline_name];
    $scope.depend_selection = depend_choices[timeline_name];
    $scope.edition = edition;
    $scope.del_epoch = false;

    $scope.beforeClose = function() {
        if($scope.epoch.text == ""){
            $scope.msgAlert = "Text field is required";
        } else if(($scope.epoch.type == "") || ($scope.epoch.type == null)){
            $scope.msgAlert = "Type field is required";
        } else if(($scope.epoch.depend == null) && ((timeline_name == "6 Neuron") || (timeline_name == "7 Protocol"))) {
            $scope.msgAlert = "Parent field is required";
        } else {
            $scope.close();
        }
    };

    $scope.delete = function(){
        $scope.del_epoch = true;
        $scope.close();
    };

    $scope.close = function() {
        close({
            epoch: $scope.epoch,
            del_epoch: $scope.del_epoch,
        }, 100); // close, but give 500ms for bootstrap to animate
    };

    $scope.stop = function(){
      bootbox.confirm( "Do you really want to stop this epoch ?",
        function(result){
          if(result == true){
            $scope.epoch.end = new Date();
            $scope.close();
          }
        }
      );
    };

  //  This cancel function must use the bootstrap, 'modal' function because
  //  the doesn't have the 'data-dismiss' attribute.
    $scope.cancel = function() {
    //  Manually hide the modal.
    $element.modal('hide');
    //  Now call close, returning control to the caller.
        close({
            epoch: $scope.epoch,
        }, 100); // close, but give 500ms for bootstrap to animate
    };
}]);

mod_tlv.controller('ManageEpochController_5', [
    '$scope', '$element', 'title', 'close', 'depend_choices', 'config_choices', 'timeline_name', 'edition', 'epoch',
    function($scope, $element, title, close, depend_choices, config_choices, timeline_name, edition, epoch) {

    $scope.epoch = epoch;
    $scope.title = title;
    $scope.list_selection = config_choices[timeline_name+" epoch"];
    $scope.depend_selection = depend_choices[timeline_name];
    $scope.edition = edition;
    $scope.del_epoch = false;

    $scope.beforeClose = function() {
        if($scope.epoch.label == ""){
            $scope.msgAlert = "Label field is required";
        } else if(($scope.epoch.type == "") || ($scope.epoch.type == null)){
            $scope.msgAlert = "Type field is required";
        } else if(($scope.epoch.depend == null) && ((timeline_name == "6 Neuron") || (timeline_name == "7 Protocol"))) {
            $scope.msgAlert = "Parent field is required";
        } else {
            $scope.close();
        }
    };

    $scope.delete = function(){
        $scope.del_epoch = true;
        $scope.close();
    };

    $scope.close = function() {
        close({
            epoch: $scope.epoch,
            del_epoch: $scope.del_epoch,
        }, 100); // close, but give 500ms for bootstrap to animate
    };

    $scope.stop = function(){
      bootbox.confirm( "Do you really want to stop this epoch ?",
        function(result){
          if(result == true){
            $scope.epoch.end = new Date();
            $scope.close();
          }
        }
      );
    };

  //  This cancel function must use the bootstrap, 'modal' function because
  //  the doesn't have the 'data-dismiss' attribute.
    $scope.cancel = function() {
    //  Manually hide the modal.
    $element.modal('hide');
    //  Now call close, returning control to the caller.
        close({
            epoch: $scope.epoch,
        }, 100); // close, but give 500ms for bootstrap to animate
    };
}]);

mod_tlv.controller('ManageEpochController_6', [
    '$scope', '$element', 'title', 'close', 'depend_choices', 'config_choices', 'timeline_name', 'edition', 'epoch',
    function($scope, $element, title, close, depend_choices, config_choices, timeline_name, edition, epoch) {

    $scope.epoch = epoch;
    $scope.title = title;
    $scope.list_selection = config_choices[timeline_name];
    $scope.depend_selection = depend_choices[timeline_name];
    $scope.edition = edition;
    $scope.del_epoch = false;

    $scope.beforeClose = function() {
        if($scope.epoch.name == ""){
            $scope.msgAlert = "Name field is required";
        } else if($scope.epoch.notes == ""){
            $scope.msgAlert = "Notes field is required";
        } else if(($scope.epoch.depend == null) && ((timeline_name == "6 Neuron") || (timeline_name == "7 Protocol"))) {
            $scope.msgAlert = "Parent field is required";
        } else {
            $scope.close();
        }
    };

    $scope.delete = function(){
        $scope.del_epoch = true;
        $scope.close();
    };

    $scope.close = function() {
        close({
            epoch: $scope.epoch,
            del_epoch: $scope.del_epoch,
        }, 100); // close, but give 500ms for bootstrap to animate
    };

    $scope.stop = function(){
      bootbox.confirm( "Do you really want to stop this epoch ?",
        function(result){
          if(result == true){
            $scope.epoch.end = new Date();
            $scope.close();
          }
        }
      );
    };

  //  This cancel function must use the bootstrap, 'modal' function because
  //  the doesn't have the 'data-dismiss' attribute.
    $scope.cancel = function() {
    //  Manually hide the modal.
    $element.modal('hide');
    //  Now call close, returning control to the caller.
        close({
            epoch: $scope.epoch,
        }, 100); // close, but give 500ms for bootstrap to animate
    };
}]);

mod_tlv.controller('ManageEpochController_7', [
    '$scope', '$element', 'title', 'close', 'depend_choices', 'config_choices', 'timeline_name', 'edition', 'epoch',
    function($scope, $element, title, close, depend_choices, config_choices, timeline_name, edition, epoch) {

    $scope.epoch = epoch;
    $scope.title = title;
    $scope.list_selection = config_choices[timeline_name];
    $scope.depend_selection = depend_choices[timeline_name];
    $scope.edition = edition;
    $scope.del_epoch = false;

    $scope.beforeClose = function() {
        if($scope.epoch.text == ""){
            $scope.msgAlert = "Text field is required";
        } else if(($scope.epoch.type == "") || ($scope.epoch.type == null)){
            $scope.msgAlert = "Type field is required";
        } else if(($scope.epoch.depend == null) && ((timeline_name == "6 Neuron") || (timeline_name == "7 Protocol"))) {
            $scope.msgAlert = "Parent field is required";
        } else {
            $scope.close();
        }
    };

    $scope.delete = function(){
        $scope.del_epoch = true;
        $scope.close();
    };

    $scope.close = function() {
        close({
            epoch: $scope.epoch,
            del_epoch: $scope.del_epoch,
        }, 100); // close, but give 500ms for bootstrap to animate
    };

    $scope.stop = function(){
      bootbox.confirm( "Do you really want to stop this epoch ?",
        function(result){
          if(result == true){
            $scope.epoch.end = new Date();
            $scope.close();
          }
        }
      );
    };

  //  This cancel function must use the bootstrap, 'modal' function because
  //  the doesn't have the 'data-dismiss' attribute.
    $scope.cancel = function() {
    //  Manually hide the modal.
    $element.modal('hide');
    //  Now call close, returning control to the caller.
        close({
            epoch: $scope.epoch,
        }, 100); // close, but give 500ms for bootstrap to animate
    };
}]);


mod_tlv.controller('ModalController', function($scope, close) {
  $scope.close = function(result) {
    close(result, 100); // close, but give 500ms for bootstrap to animate
  };
});
