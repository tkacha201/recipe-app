from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from recipes.models import Profile

class Command(BaseCommand):
    help = 'Creates Profile objects for all users that do not have one'

    def handle(self, *args, **options):
        users = User.objects.all()
        created_count = 0
        
        for user in users:
            try:
                # Try to access the profile to see if it exists
                user.profile
            except User.profile.RelatedObjectDoesNotExist:
                # If it doesn't exist, create it
                Profile.objects.create(user=user)
                created_count += 1
                self.stdout.write(f'Created profile for user {user.username}')
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created {created_count} profiles')) 