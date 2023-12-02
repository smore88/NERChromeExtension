from django.shortcuts import render

# In django this file here is usually used to contain functions that handle HTTP requests and return reponses,
# so in this wiki example here our views will handle GET requests and respond with JSON data

# Create your views here.

import json
from django.contrib.auth.models import User #####
from django.http import JsonResponse , HttpResponse ####

import wikipedia

# /wiki/ will go here
def index(request):
    return HttpResponse("Hello, world. You're at the wiki index.")

# /wiki/get_wiki_summary
# https://pypi.org/project/wikipedia/#description
def get_wiki_summary(request):
    topic = request.GET.get('topic', None)

    print('topic:', topic)

    data = {
        'summary': wikipedia.summary(topic, sentences=1),
        'raw': 'Successful',
    }

    print('json-data to be sent: ', data)

    return JsonResponse(data)
