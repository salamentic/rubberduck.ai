from django.urls import path
from .views import critique

urlpatterns = [
    path('critique', critique, name='critique'),
]
