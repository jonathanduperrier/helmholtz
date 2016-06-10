#encoding:utf-8
from django.db import models
from datetime import datetime
from helmholtz.experiments.models import Experiment
from helmholtz.devices.models import Item
from helmholtz.neuralstructures.models import Cell
from helmholtz.measurements.models import Measurement

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

class Epoch(models.Model):
    """."""
    timeline = models.ForeignKey( Timeline, null=False, blank=False )
    text = models.TextField( )
    start = models.DateTimeField( auto_now=False, auto_now_add=False )
    end = models.DateTimeField( auto_now=False, null=True, blank=True, auto_now_add=False )
    type = models.CharField( max_length=50, null=True, blank=True )
    color = models.CharField( max_length=7, null=True, blank=True )
    depend = models.ForeignKey('self', on_delete=models.SET_DEFAULT, default=None, null=True, blank=True )
    item = models.ForeignKey(Item, null=True, blank=True)

    def __unicode__(self):
        return unicode(self.start)

class Event(models.Model):
    """."""
    timeline = models.ForeignKey( Timeline, null=False, blank=False )
    depend = models.ForeignKey( Epoch, null=True, blank=True )
    text = models.TextField( )
    date = models.DateTimeField( auto_now=False, auto_now_add=False )
    type = models.CharField( max_length=50, null=False, blank=False )
    color = models.CharField( max_length=7, null=False, blank=False )
    measurement = models.ForeignKey(Measurement, null=True, blank=True)

    def __unicode__(self):
        return unicode(self.date)



# class Electrode(Epoch, Item):
#     """."""
#     idElectrode = models.AutoField( primary_key=True )

# class Neuron(Epoch, Cell):
#     """."""
#     idNeuron = models.AutoField( primary_key=True )
#     electrode = models.ForeignKey( Electrode, null=True )

# class Protocol(Epoch):
#     """."""
#     idProtocol = models.AutoField( primary_key=True )
#     neuron = models.ForeignKey( Neuron, null=True, blank=True )
#     text = models.TextField( null=True, blank=True )
#     type = models.CharField( max_length=50, null=True, blank=True )

