#encoding:utf-8

from django.contrib import admin

from guardian.admin import GuardedModelAdmin

from helmholtz.notebooks.models import Timeline
from helmholtz.notebooks.models import Event
from helmholtz.notebooks.models import Electrode
from helmholtz.notebooks.models import Neuron
from helmholtz.notebooks.models import Protocol

# overriding

class TimelineAdmin( GuardedModelAdmin ) :
    fields = [
        'date',
        'color',
        'name',
        'height',
        'experiment'
    ]

class EventAdmin( GuardedModelAdmin ) :
    fields = [
        'timeline',
    	'text',
    	'date',
    	'type',
    	'color'
    ]


class ElectrodeAdmin(GuardedModelAdmin) :
    fields = [
        'timeline',
    	#'text',
	'label',
    	'type',
    	'start',
	'end',
    	'color',
	'model',
	'version',
	'serial_or_id',
	'manufacturer',
	'notes',
	'impedance',
	'internal_diameter',
	'rows',
	'columns',
	'step',
    ]

class NeuronAdmin(GuardedModelAdmin) :
    fields = [
        'timeline',
	#'idcell',
        'electrode',
    	#'text',
    	'start',
	'end',
    	#'type',
    	'color',
	'label',
	'type',
	'properties',
    ]
class ProtocolAdmin(GuardedModelAdmin) :
    fields = [
        'timeline',
        'neuron',
    	'text',
    	'start',
	'end',
    	'type',
    	'color'
    ]

# registration
admin.site.register( Timeline, TimelineAdmin )
admin.site.register( Event, EventAdmin )
admin.site.register( Electrode, ElectrodeAdmin )
admin.site.register( Neuron, NeuronAdmin )
admin.site.register( Protocol, ProtocolAdmin )

