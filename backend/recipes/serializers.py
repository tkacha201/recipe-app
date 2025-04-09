from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Recipe, Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['display_name', 'bio']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'profile']
        read_only_fields = ['username']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile
        
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()
        
        return instance

class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ['id', 'title', 'description', 'prep_time', 'cook_time', 
                 'image_url', 'tags', 'ingredients', 'instructions', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        user = self.context['request'].user
        recipe = Recipe.objects.create(user=user, **validated_data)
        return recipe 