var timeLineServices = angular.module('timeLineServices', ['ngResource']);

timeLineServices.factory('timeLine', ['$resource',
  function($resource){
    return $resource( base_url + 'notebooks/timeline/:id', {id:'@eId'}, {
      get: {method:'GET', params:{format:'json'}, isArray:false},
      put: {method:'PUT', params:{format:'json'}, headers:{ 'Content-Type':'application/json' }},
      post: { method: 'POST', params:{ format:'json' }, headers:{ 'Content-Type':'application/json' } }
    });
  }]);

var eventServices = angular.module('eventServices', ['ngResource']);

eventServices.factory('events', ['$resource',
  function($resource){
    return $resource( base_url + 'notebooks/event/:id', {id:'@eId'}, {
      get: {method:'GET', params:{format:'json'}, isArray:false},
      put: {method:'PUT', params:{format:'json'}, headers:{ 'Content-Type':'application/json' }},
      post: { method: 'POST', params:{ format:'json' }, headers:{ 'Content-Type':'application/json' } },
      del: { method: 'DELETE', params:{ format:'json' }, headers:{ 'Content-Type':'application/json' } }
    });
  }]);

var epochServices = angular.module('epochServices', ['ngResource']);

epochServices.factory('epochs', ['$resource',
  function($resource){
    return $resource( base_url + 'notebooks/epoch/:id', {id:'@eId'}, {
      get: {method:'GET', params:{format:'json'}, isArray:false},
      put: {method:'PUT', params:{format:'json'}, headers:{ 'Content-Type':'application/json' }},
      post: { method: 'POST', params:{ format:'json' }, headers:{ 'Content-Type':'application/json' } },
      del: { method: 'DELETE', params:{ format:'json' }, headers:{ 'Content-Type':'application/json' } }
    });
  }]);

var CellTypeService = angular.module('CellTypeService', ['ngResource']);

CellTypeService.factory('CellType', ['$resource',
  function($resource){
    return $resource( base_url + 'neuralstructures/celltype/', {}, {
      get: {method:'GET', params:{format:'json'}, isArray:false}
    });
  }]);

var DeviceTypeService = angular.module('DeviceTypeService', ['ngResource']);

DeviceTypeService.factory('DeviceType', ['$resource',
  function($resource){
    return $resource( base_url + 'devices/type/', {}, {
      get: {method:'GET', params:{format:'json'}, isArray:false}
    });
  }]);

var DeviceItemService = angular.module('DeviceItemService', ['ngResource']);

DeviceItemService.factory('DeviceItems', ['$resource',
  function($resource){
    return $resource( base_url + 'devices/item/:id', {}, {
      get: {method:'GET', params:{format:'json'}, isArray:false},
      put: {method:'PUT', params:{format:'json'}, headers:{ 'Content-Type':'application/json' }},
      post: { method: 'POST', params:{ format:'json' }, headers:{ 'Content-Type':'application/json' } },
      del: { method: 'DELETE', params:{ format:'json' }, headers:{ 'Content-Type':'application/json' } }
    });
  }]);

var RecordingBlockService = angular.module('RecordingBlockService', ['ngResource']);

RecordingBlockService.factory('RecordingBlocks', ['$resource',
  function($resource){
    return $resource( base_url + 'recordings/block/:id', {}, {
      get: {method:'GET', params:{format:'json'}, isArray:false},
      put: {method:'PUT', params:{format:'json'}, headers:{ 'Content-Type':'application/json' }},
      post: { method: 'POST', params:{ format:'json' }, headers:{ 'Content-Type':'application/json' } },
      del: { method: 'DELETE', params:{ format:'json' }, headers:{ 'Content-Type':'application/json' } }
    });
  }]);

var RecordingRecordingService = angular.module('RecordingRecordingService', ['ngResource']);

RecordingRecordingService.factory('RecordingRecordings', ['$resource',
  function($resource){
    return $resource( base_url + 'recordings/recording/:id', {}, {
      get: {method:'GET', params:{format:'json'}, isArray:false},
      put: {method:'PUT', params:{format:'json'}, headers:{ 'Content-Type':'application/json' }},
      post: { method: 'POST', params:{ format:'json' }, headers:{ 'Content-Type':'application/json' } },
      del: { method: 'DELETE', params:{ format:'json' }, headers:{ 'Content-Type':'application/json' } }
    });
  }]);

var measurementService = angular.module('measurementService', ['ngResource']);

measurementService.factory('measurements', ['$resource',
  function($resource){
    return $resource( base_url + 'measurements/measurement/:id', {}, {
      get: {method:'GET', params:{format:'json'}, isArray:false},
      put: {method:'PUT', params:{format:'json'}, headers:{ 'Content-Type':'application/json' }},
      post: { method: 'POST', params:{ format:'json' }, headers:{ 'Content-Type':'application/json' } },
      del: { method: 'DELETE', params:{ format:'json' }, headers:{ 'Content-Type':'application/json' } }
    });
  }]);

var measurementParametersService = angular.module('measurementParameterService', ['ngResource']);

measurementParametersService.factory('measurementsParameters', ['$resource',
  function($resource){
    return $resource( base_url + 'measurements/parameter/:id', {}, {
      get: {method:'GET', params:{format:'json'}, isArray:false},
      put: {method:'PUT', params:{format:'json'}, headers:{ 'Content-Type':'application/json' }},
      post: { method: 'POST', params:{ format:'json' }, headers:{ 'Content-Type':'application/json' } },
      del: { method: 'DELETE', params:{ format:'json' }, headers:{ 'Content-Type':'application/json' } }
    });
  }]);

var SupplierService = angular.module('SupplierService', ['ngResource']);

SupplierService.factory('SupplierService', ['$resource',
  function($resource){
    return $resource( base_url + 'people/supplier/', {}, {
      get: {method:'GET', params:{format:'json'}, isArray:false}
    });
  }]);
