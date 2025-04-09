from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Recipe


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user


class RecipeSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = Recipe
        fields = [
            "id", 
            "title", 
            "description", 
            "prep_time", 
            "cook_time", 
            "image_url", 
            "tags", 
            "ingredients", 
            "instructions", 
            "created_at", 
            "author", 
            "author_username"
        ]
        extra_kwargs = {"author": {"read_only": True}}