from django.urls import path

from apps.taskmanager.api.views import TaskViewSet

task_list = TaskViewSet.as_view(
    {
        "get": "list",
        "post": "create",
    }
)
task_detail = TaskViewSet.as_view(
    {
        "put": "update",
        "delete": "destroy",
    }
)
task_assign = TaskViewSet.as_view(
    {
        "post": "assign",
    }
)
task_change_state = TaskViewSet.as_view(
    {
        "post": "change_state",
    }
)
task_states = TaskViewSet.as_view(
    {
        "get": "states",
    }
)

urlpatterns = [
    path(
        "tasks/",
        task_list,
        name="tasks-list",
    ),
    path(
        "tasks/states/",
        task_states,
        name="tasks-states",
    ),
    path(
        "tasks/<int:id>/",
        task_detail,
        name="tasks-detail",
    ),
    path(
        "tasks/<int:id>/assign/",
        task_assign,
        name="tasks-assign",
    ),
    path(
        "tasks/<int:id>/state/",
        task_change_state,
        name="tasks-change-state",
    ),
]
