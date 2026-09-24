from dataclasses import dataclass
from datetime import date, datetime

from apps.taskmanager.models import TaskState


@dataclass(frozen=True, slots=True, kw_only=True)
class TaskFilterDTO:
    name_prefix: str | None = None
    state: str | None = None
    due_date: date | None = None
    page: int = 1
    page_size: int = 20
    
@dataclass(frozen=True, slots=True, kw_only=True)
class TaskPageDTO:
    items: list
    total: int
    page: int
    page_size: int    

@dataclass(frozen=True, slots=True, kw_only=True)
class CreateTaskDTO:
    name: str
    due_date: datetime
    created_by_id: int
    state: TaskState

    description: str = ""
    assigned_to_id: int | None = None    

@dataclass(frozen=True, slots=True, kw_only=True)
class UpdateTaskDTO:
    task_id: int
    name: str
    due_date: datetime
    updated_by_id: int
    description: str = ""    
    
@dataclass(frozen=True, slots=True, kw_only=True)
class AssignTaskDTO:
    task_id: int
    updated_by_id: int
    assigned_to_id: int


@dataclass(frozen=True, slots=True, kw_only=True)
class ChangeTaskStateDTO:
    task_id: int
    state: str
    updated_by_id: int
