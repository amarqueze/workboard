from apps.taskmanager.application.dto import TaskFilterDTO, TaskPageDTO
from apps.taskmanager.application.interfaces import TaskRepository
from apps.taskmanager.models import TaskState


def get_tasks_by_filter(
    *,
    filters: TaskFilterDTO,
    repository: TaskRepository,
) -> TaskPageDTO:
    return repository.find_tasks_by_filter(filters)


def get_all_task_states(
    *,
    repository: TaskRepository,
) -> list[TaskState]:
    return repository.find_all_task_states()