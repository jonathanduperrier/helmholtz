#encoding:utf-8

from django.contrib import admin

from guardian.admin import GuardedModelAdmin

from helmholtz.notebooks.models import Event
from helmholtz.notebooks.models import Timeline

# overriding
class EventAdmin( GuardedModelAdmin ) :
    fields = [
    	'text',
    	'date',
    	'type',
    	'color',
    	'vPlacement'
    ]

class TimelineAdmin( GuardedModelAdmin ) :
    fields = [
    	'date',
    	'color',
    	'name',
    	'events',
    	'height'
    ]

# registration
admin.site.register( Event, EventAdmin )
admin.site.register( Timeline, TimelineAdmin )

