from typing import Protocol

from apps.accounts.models import AccountInfo
from apps.taskmanager.application.dto import TaskFilterDTO, TaskPageDTO
from apps.taskmanager.models import Task, TaskState


class TaskRepository(Protocol):
    def create_task(self, task: Task) -> Task:
        ...

    def update_task(self, task: Task) -> Task:
        ...

    def assign_task(
        self,
        task: Task,
        account_info: AccountInfo,
    ) -> Task:
        ...

    def delete_task(self, task: Task) -> None:
        ...

    def change_task_state(
        self,
        task: Task,
        state: TaskState,
    ) -> Task:
        ...

    def find_tasks_by_filter(
        self,
        filters: TaskFilterDTO,
    ) -> TaskPageDTO:
        ...

    def find_all_task_states(self) -> list[TaskState]:
        ...
        
    def find_task_by_id(
        self,
        task_id: int,
    ) -> Task | None:
        ...

    def find_task_state_by_name(
        self,
        state: str,
    ) -> TaskState | None:
        ...    

    def find_task_state_by_id(
        self,
        state_id: int,
    ) -> TaskState | None:
        ...
