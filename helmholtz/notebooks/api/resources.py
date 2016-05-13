# notebooks/api.py

from tastypie.authentication import Authentication, BasicAuthentication
from tastypie.authorization import Authorization, DjangoAuthorization
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from tastypie import fields
from helmholtz.core.api.authorization import GuardianAuthorization

from helmholtz.notebooks.models import Timeline
from helmholtz.notebooks.models import Event
from helmholtz.notebooks.models import Epoch
# from helmholtz.notebooks.models import Electrode
from helmholtz.devices.models import Item
# from helmholtz.notebooks.models import Neuron
from helmholtz.neuralstructures.models import Cell
# from helmholtz.notebooks.models import Protocol

#from helmholtz.experiments.models import Experiment
from helmholtz.experiments.api.resources import ExperimentResource
from helmholtz.devices.api.resources import ItemResource
from helmholtz.neuralstructures.api.resources import CellResource

# Resources

class TimelineResource( ModelResource ) :
    experiment = fields.ForeignKey(ExperimentResource, attribute='experiment') #resource_name of ExperimentResource
    class Meta:
        queryset = Timeline.objects.all()
        resource_name = 'timeline' # optional, if not present it will be generated from classname
	#excludes = ['id']
        filtering = {
            'id': ALL,
            'experiment': ALL_WITH_RELATIONS,
            'date': ALL,
            'color': ALL,
            'name': ALL,
            'height': ALL,
        }
        allowed_methods = [ 'get', 'post', 'put', 'delete', 'patch' ]
        always_return_data = True
	limit = 0
	max_limit = 0
        authentication = BasicAuthentication()
        authorization = DjangoAuthorization()


class EpochResource( ModelResource ) : 
    timeline = fields.ForeignKey( TimelineResource, attribute='timeline' )
    depend = fields.ForeignKey( 'self', attribute='depend', null=True )

    class Meta:
        queryset = Epoch.objects.all()
        resource_name = 'epoch'
        filtering = {
                'id': ALL,
                'timeline': ALL_WITH_RELATIONS,
                'depend': ALL_WITH_RELATIONS,
                'start': ALL,
                'text': ALL,
                'end': ALL,
                'type': ALL,
                'color': ALL
            }
        allowed_methods = [ 'get', 'post', 'put', 'delete', 'patch' ]
        always_return_data = True
        limit = 0
        max_limit = 0
        authentication = BasicAuthentication()
        authorization = DjangoAuthorization()

class EventResource( ModelResource ) :
    timeline = fields.ForeignKey(TimelineResource, attribute='timeline' ) #resource_name of TimelineRessource
    depend = fields.ForeignKey( EpochResource, attribute='depend', null=True )
    class Meta:
        queryset = Event.objects.all()
        resource_name = 'event'
        filtering = {
            #'id': ALL,
            'timeline': ALL_WITH_RELATIONS,
            'depend': ALL_WITH_RELATIONS,
            'text': ALL,
            'date': ALL,
            'type': ALL,
            'color': ALL
        }
        allowed_methods = [ 'get', 'post', 'put', 'delete', 'patch' ]
        always_return_data = True
        limit = 0
        max_limit = 0
        authentication = BasicAuthentication()
        authorization = DjangoAuthorization()



# class ElectrodeResource( EpochResource, ItemResource ) :
#     class Meta:
# 	queryset = Electrode.objects.all()
# 	resource_name = 'electrode'
# 	excludes = ['idElectrode']
# 	filtering = {
#             'id': ALL,
#         }
#         allowed_methods = [ 'get', 'post', 'put', 'delete', 'patch' ]
#         always_return_data = True
# 	limit = 0
# 	max_limit = 0
#         authentication = BasicAuthentication()
#         authorization = DjangoAuthorization()

# class NeuronResource( EpochResource, CellResource ) :
#     electrode = fields.ForeignKey(ElectrodeResource, attribute='electrode' ) #resource_name of ElectrodeResource
#     class Meta:
# 	queryset = Neuron.objects.all()
# 	resource_name = 'neuron'
# 	excludes = ['idNeuron']
# 	filtering = {
#             'id': ALL,
# 	    'electrode': ALL_WITH_RELATIONS,
#         }
#         allowed_methods = [ 'get', 'post', 'put', 'delete', 'patch' ]
#         always_return_data = True
# 	limit = 0
# 	max_limit = 0
#         authentication = BasicAuthentication()
#         authorization = DjangoAuthorization()

# class ProtocolResource( EpochResource ) :
#     neuron = fields.ForeignKey(NeuronResource, attribute='neuron' ) #resource_name of NeuronResource
#     class Meta:
# 	queryset = Protocol.objects.all()
# 	resource_name = 'protocol'
# 	excludes = ['idProtocol']
# 	filtering = {
#             'id': ALL,
# 	    'neuron': ALL_WITH_RELATIONS,
#         }
#         allowed_methods = [ 'get', 'post', 'put', 'delete', 'patch' ]
#         always_return_data = True
# 	limit = 0
# 	max_limit = 0
#         authentication = BasicAuthentication()
#         authorization = DjangoAuthorization()

