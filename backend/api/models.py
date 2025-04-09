from django.db import models
from django.contrib.auth.models import User


class Recipe(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    prep_time = models.IntegerField()  # in minutes
    cook_time = models.IntegerField()  # in minutes
    image_url = models.URLField()
    tags = models.JSONField(default=list)  # Store tags as a JSON array
    ingredients = models.JSONField()  # Store ingredients as a JSON array of objects
    instructions = models.JSONField()  # Store instructions as a JSON array of objects
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recipes")

    def __str__(self):
        return self.title