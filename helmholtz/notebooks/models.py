#encoding:utf-8
from django.db import models

class Event(models.Model):
    """."""
    # nomenclature = models.CharField( primary_key=True, max_length=100 )
    # label = models.CharField( max_length=50, null=True, blank=True )
    # species = models.ForeignKey( Species )
    # url = models.URLField( null=True, blank=True, help_text="web page describing the strain" )
    # notes = models.TextField( null=True, blank=True ) 
    
    idEvent = models.IntegerField( )
    #idTimeline = models.ForeignKey( Timeline )
    text = models.TextField( )
    date = models.DateTimeField( auto_now=False, auto_now_add=False )
    #dateFormat 
    type = models.CharField( max_length=50, null=False, blank=False )
    color = models.CharField( max_length=7, null=False, blank=False )
    vPlacement = models.IntegerField( )
    
    def __unicode__(self):
        return self.date


class Timeline(models.Model):
    """.""" 
    # scientific_name = models.CharField( max_length=300, unique=True )
    # english_name = models.CharField( max_length=300, null=True, blank=True )
    # codename = models.CharField( max_length=30, null=True, blank=True )
    # lsid = models.TextField( unique=True, null=True, blank=True, help_text="life science identifier" )
    # url = models.URLField( null=True, blank=True )
    id = models.AutoField( primary_key=True )
    date = models.DateTimeField( auto_now=False, auto_now_add=False )
    color = models.CharField( max_length=7, null=False, blank=False )
    name = models.CharField( max_length=100, null=False, blank=False )
    events = models.ForeignKey( Event )
    height = models.IntegerField(  )

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name_plural = "timeline"
 