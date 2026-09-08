import os
import sys
import django

# Ensure GlitchTip application path is in Python path
sys.path.insert(0, "/code")

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "glitchtip.settings")
django.setup()

from django.apps import apps
from django.contrib.auth import get_user_model

all_models = {m.__name__: m for m in apps.get_models()}

Organization = all_models["Organization"]
OrganizationUser = all_models["OrganizationUser"]
Team = all_models["Team"]
Project = all_models["Project"]
ProjectKey = all_models["ProjectKey"]
User = get_user_model()

superuser_email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@admin.com")
org_slug = os.environ.get("GLITCHTIP_SEED_ORG", "org")
team_slug = os.environ.get("GLITCHTIP_SEED_TEAM", "backend-team")
project_slug = os.environ.get("GLITCHTIP_SEED_PROJECT", "backend")

user = User.objects.get(email=superuser_email)

org, _ = Organization.objects.get_or_create(slug=org_slug, defaults={"name": org_slug})
OrganizationUser.objects.get_or_create(organization=org, user=user, defaults={"role": 1})

team, _ = Team.objects.get_or_create(slug=team_slug, organization=org)

project, _ = Project.objects.get_or_create(
    slug=project_slug, organization=org, defaults={"name": project_slug}
)
project.teams.add(team)

key, _ = ProjectKey.objects.get_or_create(project=project)

print("\n==================================================")
print("GLITCHTIP INITIALIZATION COMPLETE")
print(f"Organization : {org.slug}")
print(f"Team         : {team.slug}")
print(f"Project      : {project.slug}")
print(f"DSN Key      : {key.get_dsn()}")
print("==================================================\n")