from apps.accounts.models import AccountInfo
from apps.taskmanager.application.dto import TaskFilterDTO, TaskPageDTO
from apps.taskmanager.models import Task, TaskState


class DjangoTaskRepository:
    def create_task(self, task: Task) -> Task:
        task.save()
        return task

    def update_task(self, task: Task) -> Task:
        task.save()
        return task

    def assign_task(
        self,
        task: Task,
        account_info: AccountInfo,
    ) -> Task:
        task.assigned_to = account_info
        task.save(update_fields=["assigned_to", "updated_by", "updated_at"])

        return task

    def delete_task(self, task: Task) -> None:
        task.delete()

    def change_task_state(
        self,
        task: Task,
        state: TaskState,
    ) -> Task:
        task.state = state
        task.save(update_fields=["state", "updated_by", "updated_at"])

        return task
    
    def find_tasks_by_filter(
        self,
        filters: TaskFilterDTO,
    ) -> TaskPageDTO:
        queryset = Task.objects.select_related(
            "state",
            "created_by",
            "updated_by",
            "assigned_to",
        )

        if filters.name_prefix:
            queryset = queryset.filter(
                name__istartswith=filters.name_prefix,
            )

        if filters.state:
            queryset = queryset.filter(
                state__name=filters.state,
            )

        if filters.due_date:
            queryset = queryset.filter(
                due_date__date=filters.due_date,
            )

        total = queryset.count()

        offset = (filters.page - 1) * filters.page_size
        limit = offset + filters.page_size

        tasks = list(
            queryset
            .order_by("-created_at")
            [offset:limit]
        )

        return TaskPageDTO(
            items=tasks,
            total=total,
            page=filters.page,
            page_size=filters.page_size,
        )

    def find_all_task_states(self) -> list[TaskState]:
        return list(
            TaskState.objects.order_by("id")
        )
        
    def find_task_by_id(
        self,
        task_id: int,
    ) -> Task | None:
        try:
            return Task.objects.select_related(
                "state",
                "created_by",
                "updated_by",
                "assigned_to",
            ).get(id=task_id)
        except Task.DoesNotExist:
            return None

    def find_task_state_by_name(
        self,
        state: str,
    ) -> TaskState | None:
        try:
            return TaskState.objects.get(name=state)
        except TaskState.DoesNotExist:
            return None    

    def find_task_state_by_id(
        self,
        state_id: int,
    ) -> TaskState | None:
        try:
            return TaskState.objects.get(id=state_id)
        except TaskState.DoesNotExist:
            return None
