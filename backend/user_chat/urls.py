from django.urls import path
from .views import RegisterView, UserContactViewSet, CurrentUserViewSet


urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('user/', UserContactViewSet.as_view({'get': 'list'})),
    path('user/<int:pk>/', UserContactViewSet.as_view({'get': 'retrieve'})),
    path('current_user/', 
         CurrentUserViewSet.as_view({'put': 'update'})),
    path('current_user/', 
         CurrentUserViewSet.as_view({'get': 'retrieve'}))
]
