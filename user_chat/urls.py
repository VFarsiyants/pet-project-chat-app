from django.urls import path
from .views import RegisterView, UserViewSet


urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('user/', UserViewSet.as_view({'get': 'list'})),
    path('user/<int:pk>/', UserViewSet.as_view({'get': 'retrieve'}))
]
