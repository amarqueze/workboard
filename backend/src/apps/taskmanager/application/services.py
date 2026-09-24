from django.db import transaction

from apps.accounts.application.interfaces import AccountRepository
from apps.accounts.exceptions import AccountNotFoundError
from apps.taskmanager.application.dto import (
    AssignTaskDTO,
    ChangeTaskStateDTO,
    CreateTaskDTO,
    UpdateTaskDTO,
)
from apps.taskmanager.application.interfaces import TaskRepository
from apps.taskmanager.application.services_background import (
    CreateTaskPayload,
    create_task_background,
)
from apps.taskmanager.exceptions import (
    InvalidTaskIdError,
    TaskNotFoundError,
    TaskStateNotFoundError,
)
from apps.taskmanager.models import Task


def _validate_task_id(task_id: int) -> None:
    if task_id < 1:
        raise InvalidTaskIdError()


def create_task(
    *,
    data: CreateTaskDTO,
) -> None:
    payload: CreateTaskPayload = {
        "name": data.name,
        "description": data.description,
        "due_date": data.due_date.isoformat(),
        "created_by_id": data.created_by_id,
        "assigned_to_id": data.assigned_to_id,
        "state_id": data.state.id,
    }

    create_task_background.enqueue(payload)


@transaction.atomic
def update_task(
    *,
    data: UpdateTaskDTO,
    repository: TaskRepository,
    account_repository: AccountRepository,
) -> Task:
    _validate_task_id(data.task_id)

    task = repository.find_task_by_id(data.task_id)

    if task is None:
        raise TaskNotFoundError()

    updated_by = account_repository.find_account_info_by_id(
        data.updated_by_id,
    )

    if updated_by is None:
        raise AccountNotFoundError()

    task.name = data.name
    task.description = data.description
    task.due_date = data.due_date
    task.updated_by = updated_by

    return repository.update_task(task)


@transaction.atomic
def assign_task(
    *,
    data: AssignTaskDTO,
    task_repository: TaskRepository,
    account_repository: AccountRepository,
) -> Task:
    _validate_task_id(data.task_id)

    task = task_repository.find_task_by_id(data.task_id)

    if task is None:
        raise TaskNotFoundError()

    updated_by = account_repository.find_account_info_by_id(
        data.updated_by_id,
    )

    if updated_by is None:
        raise AccountNotFoundError()

    assigned_to = account_repository.find_account_info_by_id(
        data.assigned_to_id,
    )

    if assigned_to is None:
        raise AccountNotFoundError()

    task.updated_by = updated_by

    return task_repository.assign_task(
        task,
        assigned_to,
    )


@transaction.atomic
def delete_task(
    *,
    task_id: int,
    repository: TaskRepository,
) -> None:
    _validate_task_id(task_id)

    task = repository.find_task_by_id(task_id)

    if task is None:
        raise TaskNotFoundError()

    repository.delete_task(task)


@transaction.atomic
def change_task_state(
    *,
    data: ChangeTaskStateDTO,
    repository: TaskRepository,
    account_repository: AccountRepository,
) -> Task:
    _validate_task_id(data.task_id)

    task = repository.find_task_by_id(data.task_id)

    if task is None:
        raise TaskNotFoundError()

    state = repository.find_task_state_by_name(data.state)

    if state is None:
        raise TaskStateNotFoundError()

    updated_by = account_repository.find_account_info_by_id(
        data.updated_by_id,
    )

    if updated_by is None:
        raise AccountNotFoundError()

    task.updated_by = updated_by

    return repository.change_task_state(
        task,
        state,
    )
