from django.db import models

from apps.accounts.models import AccountInfo

class TaskState(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)

    def __str__(self) -> str:
        return self.name

class Task(models.Model):
    id = models.BigAutoField(primary_key=True)

    name = models.CharField(max_length=200)
    description = models.TextField(
        blank=True,
        default="",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        AccountInfo,
        on_delete=models.PROTECT,
        related_name="created_tasks",
    )

    updated_by = models.ForeignKey(
        AccountInfo,
        on_delete=models.PROTECT,
        related_name="updated_tasks",
    )

    assigned_to = models.ForeignKey(
        AccountInfo,
        on_delete=models.PROTECT,
        related_name="assigned_tasks",
        null=True,
        blank=True,
    )
    
    state = models.ForeignKey(
        TaskState,
        on_delete=models.PROTECT,
        related_name="tasks",
    )

    due_date = models.DateTimeField()

    def __str__(self) -> str:
        return self.name