from django.conf.urls.defaults import patterns
from django.conf.urls.defaults import include
from django.conf.urls.defaults import url

# tastypie resource exposition
from helmholtz.notebooks.api.resources import TimelineResource
from helmholtz.notebooks.api.resources import EventResource
# instance
timeline_resource = TimelineResource()
event_resource = EventResource()

urlpatterns = patterns('',

    url( r'^', include( timeline_resource.urls ) ),
    url( r'^', include( event_resource.urls ) ),
)
