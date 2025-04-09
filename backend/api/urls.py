from django.urls import path
from . import views

urlpatterns = [
    path("recipes/", views.RecipeListCreate.as_view(), name="recipe-list"),
    path("recipes/delete/<int:pk>/", views.RecipeDelete.as_view(), name="delete-recipe"),
    path("recipes/update/<int:pk>/", views.RecipeUpdate.as_view(), name="update-recipe"),
    path("recipes/<int:pk>/", views.RecipeDetail.as_view(), name="recipe-detail"),
    path("register/", views.CreateUserView.as_view(), name="register"),
    path("user/<int:pk>/", views.UserDetail.as_view(), name="user-detail"),
]