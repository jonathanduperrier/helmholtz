#encoding:utf-8
from django.db import models
from helmholtz.core.models import Cast
from helmholtz.people.models import ScientificStructure
from helmholtz.people.models import Supplier
from helmholtz.location.models import Position
from helmholtz.chemistry.models import Solution
from helmholtz.chemistry.models import Product

"""
This module provides facilities to store
the set of devices used during experiments or 
useful to deploy a setup. 
"""

class DeviceType( models.Model ):
    """
    Type of :class:`Device` :
    
    ``name`` : the identifier of the type of device.
    """
    name = models.CharField( primary_key=True, max_length=20 )
    
    def __unicode__(self):
        return self.name
    
    class Meta :
        ordering = ['name']

    # Types:
    # Stereotaxis
    # Software
    # Amplifier
    # DiscElectrode
    # SolidElectrode
    # SharpElectrode - Hollow
    # PatchElectrode - Hollow
    # MultiElectrode
    # EEG
    # EKG



class Device( models.Model ):
    """
    Device that could be deployed in a :class:`Setup` :
    
    ``type`` : reference to a :class:`DeviceType`.
    ``label`` : the label for a specific device.
    ``model`` : the identifier of the device (from the manufacturer).
    ``version`` : version of the model/software.
    ``serial_or_id`` : specific for the model, provided by the manufacturer or institution.
    ``manufacturer`` : the manufacturer or supplier providing the device.
    ``notes`` : notes concerning the device.
    ``impedance`` : impedance in M&Omega; for solid electrode.
    ``internal_diameter`` : internal diameter in &mu;m for hollow electrode.
    ``rows`` : rows of Multielectrode array.
    ``columns`` : columns of Multielectrode array.
    ``step`` : step in mm of Multielectrode array.
    
    """
    type = models.ForeignKey( DeviceType )
    label = models.CharField( max_length=100 )
    model = models.CharField( max_length=20 )
    version = models.CharField( max_length=100 )
    serial_or_id = models.CharField( max_length=50, null=True, blank=True )
    manufacturer = models.ForeignKey( Supplier, null=True, blank=True )
    notes = models.TextField( null=True, blank=True )
    # electrode specific
    impedance = models.FloatField( null=True, blank=True, verbose_name="impedance in M&Omega; for solid electrode" ) 
    internal_diameter = models.FloatField( null=True, blank=True, verbose_name="internal diameter in &mu;m for hollow electrode" ) 
    rows = models.PositiveSmallIntegerField( null=True, blank=True, verbose_name="rows of Multielectrode array" )
    columns = models.PositiveSmallIntegerField( null=True, blank=True, verbose_name="columns of Multielectrode array" )
    step = models.PositiveSmallIntegerField( null=True, blank=True, verbose_name="step in mm of Multielectrode array" )

    def __unicode__(self):
        st = self.model
        if self.manufacturer :
            st += " from %s" % (self.manufacturer)
        return st
    
    class Meta :
        verbose_name_plural = 'devices'


configurations = (
    ( 'CA', 'cell attached' ),
    ( 'WC', 'whole cell' ),
    ( 'PP', 'perforated patch' ),
    ( 'IO', 'inside out' ),
    ( 'LO', 'loose' )
)
class DeviceProperties( models.Model ):
    """
    Class for all kind of configurations making an
    :class:`Device` ready for an :class:`Experiment` :
    
    ``device`` : reference to a specific device.
    ``label`` : the label identifying the device configuration.
    ``notes`` : notes concerning the device configuration.
    ``amplification`` : amplification setting.
    ``filtering`` : type of filtering used.
    ``position`` : position of the electrode.
    ``resistance`` : resistance of the electrode.
    ``contact_gel`` : product used for disc electrode.
    ``solution`` : solution for hollow electrode.
    ``seal_resistance`` : seal resistance in M%Omega; for patch electrode.
    ``contact_configuration`` : contact configurations for patch electrode.
    ``channel_type`` : type of electrical channel.
    
    """
    device = models.ForeignKey( Device )
    label = models.CharField( max_length=50, null=True, blank=True )
    notes = models.TextField( null=True, blank=True )
    # device specific
    amplification = models.FloatField( null=True, blank=True )
    filtering = models.CharField( max_length=50, null=True, blank=True )
    # electrode specific
    position = models.ForeignKey( Position, null=True, blank=True, verbose_name="absolute position" )
    resistance = models.FloatField( null=True, blank=True, verbose_name="electrode resistance in M&Omega;" )
    contact_gel = models.ForeignKey( Product, null=True, blank=True, verbose_name="contact gel for disc electrode" )
    solution = models.ForeignKey( Solution, null=True, blank=True, verbose_name="solution for hollow electrode" )
    seal_resistance = models.FloatField( null=True, blank=True, verbose_name="seal resistance in M&Omega; for patch electrode" )
    contact_configuration = models.CharField( max_length=2, choices=configurations, null=True, blank=True, verbose_name="contact configurations for patch electrode" )
    channel_type = models.CharField( max_length=100, null=True, blank=True, verbose_name="electrical channel type for amplifier" )

    def __unicode__(self):
        st = "%s %s" % (self.__class__._meta.verbose_name, self.pk)
        if self.label :
            st += " called '%s'" % self.label 
        if self.amplification :
            st += ", amplification:%s" % self.amplification
        if self.filtering :
            st += ", filtering:'%s'" % self.filtering 
        if self.position :
            st += ", position:(%s)" % self.position 
        if self.resistance :
            st += ", resistance:%s M&Omega;" % self.resistance 
        if self.contact_gel :
            st += ", contact gel:'%s'" % self.contact_gel 
        if self.solution :
            st += ", solution:'%s'" % self.solution 
        if self.seal_resistance :
            st += ", seal resistance:%s M&Omega;" % self.seal_resistance 
        if self.contact_configuration :
            st += ", contact configuration:'%s'" % self.contact_configuration 
        if self.channel_type :
            st += ", channel_type:'%s'" % self.channel_type
        return  st


class RecordingPoint( models.Model ):
    """
    Part of the device useful to acquire data :
    
    ``device`` : the device having this recording point.
    ``number`` : the index of the recording point.
    ``label`` : the label identifying the recording point.
    
    """
    device = models.ForeignKey( Device )
    number = models.PositiveSmallIntegerField( default=1 )
    label = models.CharField( max_length=50, null=True, blank=True )
    
    def __unicode__(self):
        st = "%s" % self.number
        if self.label :
            st += " called %s" % (self.label)
        return "%s %s of %s" % (self.__class__._meta.verbose_name, st, self.device.__unicode__())


class SubSystem( models.Model ):
    """
    Structure :class:`Device` used in a
    :class:`Setup` in a hierarchical manner.
    """
    parent = models.ForeignKey( 'self', null=True, blank=True )
    label = models.CharField( max_length=256 )
    devices = models.ManyToManyField( Device, blank=True )
    
    def __unicode__(self):
        return self.label
    
    def get_components(self):
        """
        Return all :class:`SubSystem` instances
        living in the :class:`System` instance.
        """
        result = list()
        subsystems = self.subsystem_set.all()
        for subsystem in subsystems :
            result.append( subsystem )
            result.extend( subsystem.get_components() )
        return result
    
    def get_devices(self):
        """
        Return all :class:`Devices` instances
        living in the :class:`System` instance.
        """
        devices = list( self.devices.all() )
        subsystems = self.subsystem_set.all()
        for subsystem in subsystems :
            devices.extend( subsystem.get_devices() )
        return devices
    
    class Meta :
        ordering = ['label']


class Setup( models.Model ):
    """
    Setup used to launch protocols during an :class:`Experiment` :
    
    ``label`` : the label identifying the setup.
    ``room`` : the identifier of the room containing the setup.
    ``place`` : the :class:`ScientificStructure` which is the owner of the setup.
    
    """
    label = models.CharField( max_length=30, null=True, blank=True )
    place = models.ForeignKey( ScientificStructure )
    room = models.CharField( max_length=16, null=True, blank=True )
    subsystems = models.ManyToManyField( SubSystem, null=True, blank=True )
    
    def __unicode__(self):
        return u"%s \u2192 %s" % (self.place, self.room)
    
    def get_components(self):
        """
        Return all :class:`SubSystem` instances
        living in the :class:`Setup` instance.
        """
        result = list()
        subsystems = self.subsystems.all()
        for subsystem in subsystems :
            result.append( subsystem )
            result.extend( subsystem.get_components() )
        return result
    
    def get_device(self):
        """
        Return all :class:`Device` instances
        living in the :class:`Setup` instance.
        """
        device = list()
        subsystems = self.subsystems.all()
        for subsystem in subsystems :
            device.extend( subsystem.get_device() )
        return device
