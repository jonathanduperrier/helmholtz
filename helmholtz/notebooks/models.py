#encoding:utf-8
from django.db import models
from datetime import datetime
from helmholtz.experiments.models import Experiment

class Timeline(models.Model):
    """.""" 
    id = models.AutoField( primary_key=True )
    experiment = models.ForeignKey( Experiment, null=False, blank=False )
    date = models.DateTimeField( auto_now=False, auto_now_add=False )
    color = models.CharField( max_length=7, null=False, blank=False )
    name = models.CharField( max_length=100, null=False, blank=False )
    height = models.IntegerField(  )

    def __unicode__(self):
        return unicode(self.date)

    class Meta:
        verbose_name_plural = "timeline"


class Event(models.Model):
    """."""
    idEvent = models.AutoField( primary_key=True )
    timeline = models.ForeignKey( Timeline, null=False, blank=False )
    text = models.TextField( )
    date = models.DateTimeField( auto_now=False, auto_now_add=False )
    type = models.CharField( max_length=50, null=False, blank=False )
    color = models.CharField( max_length=7, null=False, blank=False )
    
    def __unicode__(self):
        return unicode(self.date)

class Epoch(models.Model):
    """."""
    idEpoch = models.AutoField( primary_key=True )
    timeline = models.ForeignKey( Timeline, null=False, blank=False )
    #epoch = models.IntegerField( null=True, blank=True )
    id_epoch = models.ForeignKey( 'self', null=True, blank=True )
    text = models.TextField( null=True, blank=True )
    start = models.DateTimeField( auto_now=False, auto_now_add=False )
    end = models.DateTimeField( auto_now=False, null=True, blank=True, auto_now_add=False )
    type = models.CharField( max_length=50, null=True, blank=True )
    color = models.CharField( max_length=7, null=True, blank=True )
    
    def __unicode__(self):
        return unicode(self.start)
