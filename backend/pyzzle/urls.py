from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('puzzle/', include('puzzle.urls')),
	path('connect4/', include('connect4.urls')),
]