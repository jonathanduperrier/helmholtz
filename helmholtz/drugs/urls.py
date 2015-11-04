from django.conf.urls import patterns
from django.conf.urls import include
from django.conf.urls import url

# tastypie resource exposition
from helmholtz.drugs.api.resources import DrugApplicationResource
# instance
DrugApplication_resource = DrugApplicationResource()

urlpatterns = patterns('',

    url( r'^', include( DrugApplication_resource.urls ) ),

)
