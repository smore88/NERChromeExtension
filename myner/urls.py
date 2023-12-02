from django.contrib import admin
from django.urls import path, include, re_path
from . import views  # Import your views module

urlpatterns = [
    path('', views.index, name='index'),
    re_path(r'^receive_webpage_contents/?$', views.receive_webpage_contents, name='receive_webpage_contents'),
    path('admin/', admin.site.urls)
]