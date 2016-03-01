from django.views.generic import ListView, DetailView, TemplateView
from django.contrib.contenttypes.models import ContentType
from helmholtz.experiments.models import Experiment
from helmholtz.recordings.models import Block
from helmholtz.analysis.models import Step, DataSource
from helmholtz.publications.models import Publication


class ExperimentList(ListView):
    model = Experiment
    template_name = "experiments.html"
    context_object_name = "experiments"


class ExperimentDetail(DetailView):
    model = Experiment
    template_name = "experiment.html"
    context_object_name = "experiment"

    def get_object(self):
        label = self.kwargs["label"]
        return Experiment.objects.get(label=label)


class CellList(ListView):
    model = Block
    template_name = "cells.html"
    context_object_name = "cells"


class CellDetail(TemplateView):
    #model = Block
    template_name = "cell.html"
    #context_object_name = "cell"

    #def get_object(self):
    #    name = self.kwargs["name"]
    #    return Block.objects.get(name=name)

    def get_context_data(self, **kwargs):
        context = super(CellDetail, self).get_context_data(**kwargs)
        block_name = self.kwargs["name"]
        cell = Block.objects.get(name=block_name)
        file_content_type = ContentType.objects.get(name='file')
        context['cell'] = cell
        #recordings = [{'recording': rec} for rec in cell.recording_set.all()]
        #for dct in recordings:
        #    dct['analyses'] = Step.objects.filter(inputs__content_type_id=file_content_type.pk,
        #                                                 inputs__object_id=rec.file.pk)
        recordings = []
        for rec in cell.recording_set.all():
            recordings.append({
                'recording': rec,
                'analyses': Step.objects.filter(inputs__content_type_id=file_content_type.pk,
                                                         inputs__object_id=rec.file.pk)
            })
        context['recordings'] = recordings
        return context


class AnalysisList(ListView):
    model = Step
    template_name = "analyses.html"
    context_object_name = "analyses"


class AnalysisDetail(DetailView):
    model = Step
    template_name = "analysis.html"
    context_object_name = "analysis"


class PublicationList(ListView):
    model = Publication
    template_name = "publications.html"
    context_object_name = "publications"

    def get_context_data(self, **kwargs):
        context = super(PublicationList, self).get_context_data(**kwargs)
        publication_content_type = ContentType.objects.get(name='publication')
        file_content_type = ContentType.objects.get(name='file')
        publications = []
        for pub in Publication.objects.all():
            acts_of_publication = Step.objects.filter(outputs__content_type_id=publication_content_type.pk,
                                                      outputs__object_id=pub.pk)
            analyses = []
            if acts_of_publication.count():
                analyses = Step.objects.filter(outputs__content_type_id=file_content_type.pk,
                                               outputs__in=acts_of_publication[0].inputs.all())
            publications.append({
                'info': pub,
                'analyses': analyses
            })
        context['publications'] = publications
        return context