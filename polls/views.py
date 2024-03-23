from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.core import serializers

from .models import Question

def index(request):
    latest_question_list = Question.objects.order_by("-pub_date")[:5]

    if request.accepts("text/html"):
        context = {
            "latest_question_list": latest_question_list,
        }
        return HttpResponse(render(request, "polls/index.html", context))

    return HttpResponse(serializers.serialize("json", latest_question_list), content_type="application_json")

def detail(request, question_id):
    question = get_object_or_404(Question, pk=question_id)

    if request.accepts("text/html"):
        return render(request, "polls/detail.html", { "question": question })
    
    return HttpResponse(serializers.serialize("json", question), content_type="application_json")

def results(request, question_id):
    question = get_object_or_404(Question, pk=question_id)

    return HttpResponse("You're looking at the results of question %s." % question)

def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)

    return HttpResponse("You're voting on question %s." % question)
