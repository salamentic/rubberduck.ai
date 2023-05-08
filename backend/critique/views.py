from django.shortcuts import render

import requests
import openai
import numpy as np
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os

import whisper

# Replace with your AI model's API URL and API key
from langchain.chat_models import ChatOpenAI
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    AIMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.schema import (
    AIMessage,
    HumanMessage,
    SystemMessage
)

openai.api_key = os.environ["OPENAI_API_KEY"]

def chatgpt_questioning(agent, transcription):

    with open('prompt.txt', 'r') as file:
        sys_msg = file.read()

    with open('angry_prompt.txt', 'r') as file:
        angry_sys_msg = file.read()

    hmn_msg = f"Lecturer:\n {transcription}."
    messages = [SystemMessage(content=sys_msg), HumanMessage(content=hmn_msg)]
    angry_messages = [SystemMessage(content=angry_sys_msg), HumanMessage(content=hmn_msg)]
    out = agent(messages)
    out2 = agent(angry_messages)
    return [out, out2]

@csrf_exempt
@api_view(['POST'])
def critique(request):
    game_agent = ChatOpenAI(temperature=0, max_tokens=214) # Agent that will reason over current game

    print("request.FILES keys:", request.FILES.keys())  # Add this line to print the keys in request.FILES
    audio_file = request.FILES.get('audio')
    response_data = {}
    if audio_file:
        model = whisper.load_model("base")
        temp = '/tmp/audio2.ogg'
        #ogg_bytes = b'OggS\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
        with open(temp, 'wb') as f:
            #f.write(ogg_bytes)
            f.write(audio_file.file.read())
            print()
        audio_file = np.frombuffer(audio_file.file.read(), np.int16).astype(np.float32) / 32768.0
        transcript = model.transcribe(audio_file)
        out = chatgpt_questioning(game_agent, transcript)
        response_data['data1'] = out[0].content
        response_data['data2'] = out[1].content
        print(response_data)
        return JsonResponse(response_data, status=200, content_type=None)
    else:
        return Response(status=400)
