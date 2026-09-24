import logging
import time
from datetime import datetime
from typing import TypedDict

from django.db import transaction
from django.tasks import task

from apps.accounts.exceptions import AccountNotFoundError
from apps.accounts.infrastructure.repositories import DjangoAccountRepository
from apps.taskmanager.exceptions import TaskStateNotFoundError
from apps.taskmanager.infrastructure.repositories import DjangoTaskRepository
from apps.taskmanager.models import Task

logger = logging.getLogger(__name__)


class CreateTaskPayload(TypedDict):
    name: str
    description: str
    due_date: str
    created_by_id: int
    assigned_to_id: int | None
    state_id: int


@task
@transaction.atomic
def create_task_background(
    payload: CreateTaskPayload,
) -> None:
    logger.info("Starting background task creation")

    # Simulates a slow background operation.
    time.sleep(3)

    account_repository = DjangoAccountRepository()
    task_repository = DjangoTaskRepository()

    created_by = account_repository.find_account_info_by_id(
        payload["created_by_id"]
    )

    if created_by is None:
        raise AccountNotFoundError()

    assigned_to = None

    if payload["assigned_to_id"] is not None:
        assigned_to = account_repository.find_account_info_by_id(
            payload["assigned_to_id"]
        )

        if assigned_to is None:
            raise AccountNotFoundError()

    state = task_repository.find_task_state_by_id(
        payload["state_id"]
    )

    if state is None:
        raise TaskStateNotFoundError()

    task_instance = Task(
        name=payload["name"],
        description=payload["description"],
        due_date=datetime.fromisoformat(payload["due_date"]),
        created_by=created_by,
        updated_by=created_by,
        assigned_to=assigned_to,
        state=state,
    )

    created_task = task_repository.create_task(task_instance)

    logger.info(
        "Task %s created successfully in background",
        created_task.id,
    )
