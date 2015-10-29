#encoding:utf-8
from django.db import models

from helmholtz.chemistry.models import Solution
from helmholtz.experiments.models import Experiment


routes = (
    ( 'IV', 'intravenous' ),
    ( 'PF', 'perfusion' )
)
class DrugApplication( models.Model ):
    """
    Store drug applications that could be done on a
    :class:`Preparation` during an :class:`Experiment` :
    
    ``experiment`` : the experiment during which the drug application is done.
    
    ``solution`` : the solution used by the drug application.

    ``route`` : the route of application of the drug application.
    
    ``start`` : start timestamp of the drug application.
    
    ``end`` : end timestamp of the drug application.
    
    ``rate`` : the rate of the drug application in mL/h by default.

    ``volume`` : volume of the drug application in ml by default.

    ``notes`` : notes concerning the drug application.
    """
    experiment = models.ForeignKey(Experiment)
    solution = models.ForeignKey(Solution)
    route = models.CharField( max_length=2, choices=routes, null=True, blank=True )
    start = models.DateTimeField(null=True, blank=True) 
    end = models.DateTimeField(null=True, blank=True) 
    rate = models.PositiveIntegerField( null=True, blank=True, verbose_name="rate in mL/h" )
    volume = models.PositiveIntegerField( null=True, blank=True, verbose_name="mL" )
    notes = models.TextField(null=True, blank=True)
    
    def __unicode__(self):
        return self._meta.verbose_name + ' ' + str(self.id)
    

