#encoding:utf-8

from django.contrib import admin

from guardian.admin import GuardedModelAdmin

from helmholtz.notebooks.models import Timeline
from helmholtz.notebooks.models import Event

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

# registration
admin.site.register( Timeline, TimelineAdmin )
admin.site.register( Event, EventAdmin )

