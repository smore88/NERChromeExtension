from django.contrib import admin
from django.urls import path, include, re_path
from . import views  # Import your views module

urlpatterns = [
    path('', views.index, name='index'),
    re_path(r'^get_wiki_summary/$', views.get_wiki_summary, name='get_wiki_summary'),
    path('admin/', admin.site.urls),
]