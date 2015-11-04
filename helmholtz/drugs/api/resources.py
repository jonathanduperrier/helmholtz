# chemistry/api/resources.py

from tastypie.authentication import Authentication, BasicAuthentication
from tastypie.authorization import Authorization, DjangoAuthorization
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from tastypie import fields

from helmholtz.drugs.models import DrugApplication

# Allowed resources
from helmholtz.experiments.api.resources import ExperimentResource
from helmholtz.chemistry.api.resources import SolutionResource


# Resources

class DrugApplicationResource( ModelResource ) :
    experiment = fields.ForeignKey( ExperimentResource, 'experiment' )
    solution = fields.ForeignKey( SolutionResource, 'solution' )
    class Meta:
        queryset = DrugApplication.objects.all()
        resource_name = 'drugapplication'
        allowed_methods = [ 'get', 'post', 'put', 'delete', 'patch' ]
        authentication = BasicAuthentication()
        authorization = DjangoAuthorization()
