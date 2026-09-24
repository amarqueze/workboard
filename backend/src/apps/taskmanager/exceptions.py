class TaskManagerError(Exception):
    code = "TASK_MANAGER_ERROR"
    message = "A task manager error occurred."

    def __init__(self) -> None:
        super().__init__(self.message)


class TaskNotFoundError(TaskManagerError):
    code = "TASK_NOT_FOUND"
    message = "The task was not found."


class InvalidTaskIdError(TaskManagerError):
    code = "INVALID_TASK_ID"
    message = "Task id must be a positive integer."


class TaskStateNotFoundError(TaskManagerError):
    code = "TASK_STATE_NOT_FOUND"
    message = "The task state was not found."
