from django.db import migrations


TASK_STATES = (
    "OPEN",
    "PROGRESS",
    "REVIEW",
    "DONE",
)


def create_task_states(apps, schema_editor):
    TaskState = apps.get_model("taskmanager", "TaskState")

    for state_name in TASK_STATES:
        TaskState.objects.get_or_create(name=state_name)


def delete_task_states(apps, schema_editor):
    TaskState = apps.get_model("taskmanager", "TaskState")

    TaskState.objects.filter(
        name__in=TASK_STATES,
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("taskmanager", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(
            create_task_states,
            delete_task_states,
        ),
    ]