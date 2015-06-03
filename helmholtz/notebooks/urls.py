from django.conf.urls.defaults import patterns
from django.conf.urls.defaults import include
from django.conf.urls.defaults import url

# tastypie resource exposition
from helmholtz.notebooks.api.resources import TimelineResource
from helmholtz.notebooks.api.resources import EventResource
from helmholtz.notebooks.api.resources import EpochResource
from helmholtz.notebooks.api.resources import ElectrodeResource
from helmholtz.notebooks.api.resources import NeuronResource
from helmholtz.notebooks.api.resources import ProtocolResource

# instance
timeline_resource = TimelineResource()
event_resource = EventResource()
epoch_resource = EpochResource()
electrode_resource = ElectrodeResource()
neuron_resource = NeuronResource()
protocol_resource = ProtocolResource()

urlpatterns = patterns('',
    url( r'^', include( timeline_resource.urls ) ),
    url( r'^', include( event_resource.urls ) ),
    url( r'^', include( epoch_resource.urls ) ),
    url( r'^', include( electrode_resource.urls ) ),
    url( r'^', include( neuron_resource.urls ) ),
    url( r'^', include( protocol_resource.urls ) ),
)
