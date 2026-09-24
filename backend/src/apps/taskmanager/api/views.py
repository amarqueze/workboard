from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from apps.accounts.infrastructure.repositories import DjangoAccountRepository
from apps.taskmanager.application.dto import (
    AssignTaskDTO,
    ChangeTaskStateDTO,
    CreateTaskDTO,
    TaskFilterDTO,
    UpdateTaskDTO,
)
from apps.taskmanager.application.selectors import (
    get_all_task_states,
    get_tasks_by_filter,
)
from apps.taskmanager.application.services import (
    assign_task,
    change_task_state,
    create_task,
    delete_task,
    update_task,
)
from apps.taskmanager.infrastructure.repositories import DjangoTaskRepository

from .serializers import (
    AssignTaskRequestSerializer,
    ChangeTaskStateRequestSerializer,
    CreateTaskRequestSerializer,
    TaskFilterRequestSerializer,
    TaskManagerErrorResponseSerializer,
    TaskPageResponseSerializer,
    TaskQueuedResponseEnvelopeSerializer,
    TaskResponseEnvelopeSerializer,
    TaskResponseSerializer,
    TaskStateResponseSerializer,
    TaskStatesResponseEnvelopeSerializer,
    UpdateTaskRequestSerializer,
)


class TaskViewSet(GenericViewSet):
    serializer_class = TaskResponseSerializer

    @extend_schema(
        tags=["Tasks"],
        summary="List tasks",
        request=TaskFilterRequestSerializer,
        responses={
            200: TaskPageResponseSerializer,
        },
    )
    def filter_tasks(self, request):
        request_serializer = TaskFilterRequestSerializer(
            data=request.data,
        )
        request_serializer.is_valid(raise_exception=True)

        data = request_serializer.validated_data

        result = get_tasks_by_filter(
            filters=TaskFilterDTO(
                name_prefix=data.get("name_prefix"),
                state=data.get("state"),
                due_date=data.get("due_date"),
                page=data.get("page", 1),
                page_size=data.get("page_size", 20),
            ),
            repository=DjangoTaskRepository(),
        )

        response_serializer = TaskResponseSerializer(
            result.items,
            many=True,
        )

        return Response(
            {
                "data": response_serializer.data,
                "meta": {
                    "total": result.total,
                    "page": result.page,
                    "page_size": result.page_size,
                },
            },
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        tags=["Tasks"],
        summary="Create task",
        request=CreateTaskRequestSerializer,
        responses={
            202: TaskQueuedResponseEnvelopeSerializer,
        },
    )
    def create(self, request):
        request_serializer = CreateTaskRequestSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)

        data = request_serializer.validated_data

        create_task(
            data=CreateTaskDTO(
                name=data["name"],
                description=data.get("description", ""),
                due_date=data["due_date"],
                created_by_id=data["created_by_id"],
                assigned_to_id=data.get("assigned_to_id"),
                state=data["state"],
            )
        )

        return Response(
            {
                "data": {
                    "status": "queued",
                },
            },
            status=status.HTTP_202_ACCEPTED,
        )

    @extend_schema(
        tags=["Tasks"],
        summary="Update task",
        request=UpdateTaskRequestSerializer,
        responses={
            200: TaskResponseEnvelopeSerializer,
            404: OpenApiResponse(
                response=TaskManagerErrorResponseSerializer,
                description="The task was not found.",
            ),
        },
    )
    def update(self, request, id: int):
        request_serializer = UpdateTaskRequestSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)

        data = request_serializer.validated_data

        result = update_task(
            data=UpdateTaskDTO(
                task_id=id,
                name=data["name"],
                description=data.get("description", ""),
                due_date=data["due_date"],
                updated_by_id=data["updated_by_id"],
            ),
            repository=DjangoTaskRepository(),
            account_repository=DjangoAccountRepository(),
        )

        response_serializer = TaskResponseSerializer(result)

        return Response(
            {
                "data": response_serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        tags=["Tasks"],
        summary="Delete task",
        responses={
            204: OpenApiResponse(description="Task deleted."),
            404: OpenApiResponse(
                response=TaskManagerErrorResponseSerializer,
                description="The task was not found.",
            ),
        },
    )
    def destroy(self, request, id: int):
        delete_task(
            task_id=id,
            repository=DjangoTaskRepository(),
        )

        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(
        tags=["Tasks"],
        summary="Assign task",
        request=AssignTaskRequestSerializer,
        responses={
            200: TaskResponseEnvelopeSerializer,
            404: OpenApiResponse(
                response=TaskManagerErrorResponseSerializer,
                description="The task was not found.",
            ),
        },
    )
    def assign(self, request, id: int):
        request_serializer = AssignTaskRequestSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)

        data = request_serializer.validated_data

        result = assign_task(
            data=AssignTaskDTO(
                task_id=id,
                assigned_to_id=data["assigned_to_id"],
                updated_by_id=data["updated_by_id"],
            ),
            task_repository=DjangoTaskRepository(),
            account_repository=DjangoAccountRepository(),
        )

        response_serializer = TaskResponseSerializer(result)

        return Response(
            {
                "data": response_serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        tags=["Tasks"],
        summary="Change task state",
        request=ChangeTaskStateRequestSerializer,
        responses={
            200: TaskResponseEnvelopeSerializer,
            404: OpenApiResponse(
                response=TaskManagerErrorResponseSerializer,
                description="The task or task state was not found.",
            ),
        },
    )
    def change_state(self, request, id: int):
        request_serializer = ChangeTaskStateRequestSerializer(
            data=request.data,
        )
        request_serializer.is_valid(raise_exception=True)

        data = request_serializer.validated_data

        result = change_task_state(
            data=ChangeTaskStateDTO(
                task_id=id,
                state=data["state"],
                updated_by_id=data["updated_by_id"],
            ),
            repository=DjangoTaskRepository(),
            account_repository=DjangoAccountRepository(),
        )

        response_serializer = TaskResponseSerializer(result)

        return Response(
            {
                "data": response_serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        tags=["Tasks"],
        summary="List task states",
        responses={
            200: TaskStatesResponseEnvelopeSerializer,
        },
    )
    def states(self, request):
        result = get_all_task_states(
            repository=DjangoTaskRepository(),
        )

        response_serializer = TaskStateResponseSerializer(result, many=True)

        return Response(
            {
                "data": response_serializer.data,
            },
            status=status.HTTP_200_OK,
        )
