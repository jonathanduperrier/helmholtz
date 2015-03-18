# notebooks/api.py

from tastypie.authentication import Authentication, BasicAuthentication
from tastypie.authorization import Authorization, DjangoAuthorization
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from tastypie import fields

from helmholtz.notebooks.models import Timeline
from helmholtz.notebooks.models import Event


# Resources

class TimelineResource( ModelResource ) :
    class Meta:
        queryset = Timeline.objects.all()
        resource_name = 'timeline' # optional, if not present it will be generated from classname
        excludes = ['id']
        filtering = {
            'date': ALL,
            'color': ALL,
            'name': ALL,
            'height': ALL,
        }
        allowed_methods = [ 'get', 'post', 'put', 'delete', 'patch' ]
        always_return_data = True
        authentication = BasicAuthentication()
        authorization = DjangoAuthorization()


class EventResource( ModelResource ) :
    timeline = fields.ForeignKey(TimelineResource, 'timeline' ) #resource_name of TimelineRessource
    class Meta:
        queryset = Event.objects.all()
        resource_name = 'event'
        excludes = ['idEvent']
        filtering = {
            'timeline': ALL_WITH_RELATIONS,
            'text': ALL,
            'date': ALL,
            'type': ['Type 1', 'Type 2', 'Type 3', 'Type 4', 'Type 5'],
            'color': ALL,
            'vPlacement': ALL,
        }
        allowed_methods = [ 'get', 'post', 'put', 'delete', 'patch' ]
        always_return_data = True
        authentication = BasicAuthentication()
        authorization = DjangoAuthorization()
