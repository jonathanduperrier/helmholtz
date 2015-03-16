# notebooks/api.py

from tastypie.authentication import Authentication, BasicAuthentication
from tastypie.authorization import Authorization, DjangoAuthorization
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from tastypie import fields

from helmholtz.notebooks.models import Event
from helmholtz.notebooks.models import Timeline


# Resources

class EventResource( ModelResource ) :

    class Meta:
        queryset = Event.objects.all()
        resource_name = 'event'
        # excludes = ['id']
        # filtering = {
        #     'nomenclature' : ALL,
        #     'label' : ALL,
        #     'species' : ALL_WITH_RELATIONS,
        # }
        excludes = ['id']
        filtering = {
            'date': ALL,
            'color': ALL,
            'name': ALL,
            'events': ALL,
            'height': ALL,
        }
        allowed_methods = [ 'get', 'post', 'put', 'delete', 'patch' ]
        always_return_data = True
        authentication = BasicAuthentication()
        authorization = DjangoAuthorization()


class TimelineResource( ModelResource ) :
    events = fields.ToManyField( EventResource, 'event_set' )
    class Meta:
        queryset = Timeline.objects.all()
        resource_name = 'timeline' # optional, if not present it will be generated from classname
        events = fields.ForeignKey( EventResource, 'events' )
        #excludes = ['id']
        # filtering = {
        #     'scientific_name': ALL,
        #     'english_name': ALL,
        # }
        excludes = ['idEvent']
        filtering = {
            'text': ALL,
            'date': ALL,
            'type': ['type1', 'type2', 'type3', 'type4', 'type5'],
            'color': ALL,
            'vPlacement': ALL,
        }
        allowed_methods = [ 'get', 'post', 'put', 'delete', 'patch' ]
        always_return_data = True
        authentication = BasicAuthentication()
        authorization = DjangoAuthorization()

