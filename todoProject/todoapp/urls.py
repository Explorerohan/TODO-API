from django.urls import path,include
from rest_framework import routers
from .views import homeView

router = routers.DefaultRouter()
router.register('todoinfo', homeView, basename='todo')


urlpatterns = [
    path('api/', include(router.urls)),
]
