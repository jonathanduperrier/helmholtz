#encoding:utf-8

from django.contrib import admin

from guardian.admin import GuardedModelAdmin

from helmholtz.notebooks.models import Timeline
from helmholtz.notebooks.models import Event
from helmholtz.notebooks.models import Epoch

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
        'depend',
        'text',
        'date',
        'type',
        'color',
        'measurement',
    ]

class EpochAdmin( GuardedModelAdmin ) :
    fields = [
        'timeline',
        'text',
        'start',
        'end',
        'type',
        'color',
        'depend',
        'item',
        'rec_blocks',
        'rec_recording',
    ]

# class ElectrodeAdmin(GuardedModelAdmin) :
#     fields = [
#         'timeline',
#     	'label',
#         'type',
#         'start',
#     	'end',
#         'color',
#     	'model',
#     	'version',
#     	'serial_or_id',
#     	'manufacturer',
#     	'notes',
#     	'impedance',
#     	'internal_diameter',
#     	'rows',
#     	'columns',
#     	'step',
#     ]

# class NeuronAdmin(GuardedModelAdmin) :
#     fields = [
#         'timeline',
#         'electrode',
#         'start',
#     	'end',
#         'color',
#     	'label',
#     	'type',
#     	'properties',
#     ]
# class ProtocolAdmin(GuardedModelAdmin) :
#     fields = [
#         'timeline',
#         'neuron',
#         'text',
#         'start',
#     	'end',
#         'type',
#         'color'
#     ]

# registration
admin.site.register( Timeline, TimelineAdmin )
admin.site.register( Event, EventAdmin )
admin.site.register( Epoch, EpochAdmin )
# admin.site.register( Electrode, ElectrodeAdmin )
# admin.site.register( Neuron, NeuronAdmin )
# admin.site.register( Protocol, ProtocolAdmin )

