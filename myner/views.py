from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
import spacy

def index(request):
    return HttpResponse("Hello, world. Just testing basic endpoint")

@csrf_exempt
def receive_webpage_contents(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        rawTagText = data.get('extractedTagText', '')

        '''
        Process the rawTagText
            1. So each {tag, text}, run the text through a spacyNER model 
            2. push_back the [{tag, [{text, label, start, end}, ....]}]
        '''

        custom_ner_model_path = "/Users/shubham/ForwardDataLabTask1/custom_ner_model"
        nlp = spacy.load(custom_ner_model_path)
        entities = []
        for entry in rawTagText:
            currTag = entry['tag']
            currText = entry['text']

            doc = nlp(currText)

            currTextEntities = []
            for ent in doc.ents:
                ent_info = {'text' : ent.text, 'label' : ent.label_, 'start' : ent.start_char, 'end' : ent.end_char}
                currTextEntities.append(ent_info)

            if len(currTextEntities) != 0 and currTag not in ['MAIN', 'BODY', 'HTML']:
                entities.append({'tag': currTag, 'textEntities': currTextEntities})

        response_data = {'entities': entities}
        return JsonResponse({'success': True, 'data': response_data})
    
    return JsonResponse({'success': False, 'error': 'Invalid request method'})