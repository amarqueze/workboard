from drf_spectacular.utils import extend_schema_serializer
from rest_framework import serializers

from apps.taskmanager.models import TaskState


class TaskFilterRequestSerializer(serializers.Serializer):
    name_prefix = serializers.CharField(required=False)
    state = serializers.CharField(required=False)
    due_date = serializers.DateField(required=False)
    page = serializers.IntegerField(default=1, min_value=1, required=False)
    page_size = serializers.IntegerField(
        default=20,
        max_value=100,
        min_value=1,
        required=False,
    )


class CreateTaskRequestSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    description = serializers.CharField(
        allow_blank=True,
        default="",
        required=False,
    )
    due_date = serializers.DateTimeField()
    created_by_id = serializers.IntegerField(min_value=1)
    assigned_to_id = serializers.IntegerField(
        required=False,
        allow_null=True,
        min_value=1,
    )
    state = serializers.SlugRelatedField(
        queryset=TaskState.objects.all(),
        slug_field="name",
    )


class UpdateTaskRequestSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    description = serializers.CharField(
        allow_blank=True,
        default="",
        required=False,
    )
    due_date = serializers.DateTimeField()
    updated_by_id = serializers.IntegerField(min_value=1)


class AssignTaskRequestSerializer(serializers.Serializer):
    assigned_to_id = serializers.IntegerField(min_value=1)
    updated_by_id = serializers.IntegerField(min_value=1)


class ChangeTaskStateRequestSerializer(serializers.Serializer):
    state = serializers.CharField(max_length=50)
    updated_by_id = serializers.IntegerField(min_value=1)


class TaskResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    description = serializers.CharField()
    due_date = serializers.DateTimeField()
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()
    created_by_id = serializers.IntegerField()
    updated_by_id = serializers.IntegerField()
    assigned_to_id = serializers.IntegerField(allow_null=True)
    state = serializers.CharField(source="state.name")


class TaskResponseEnvelopeSerializer(serializers.Serializer):
    data = TaskResponseSerializer()


class TaskQueuedResponseSerializer(serializers.Serializer):
    status = serializers.CharField()


class TaskQueuedResponseEnvelopeSerializer(serializers.Serializer):
    data = TaskQueuedResponseSerializer()


class TaskPageMetaSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    page = serializers.IntegerField()
    page_size = serializers.IntegerField()


@extend_schema_serializer(many=False)
class TaskPageResponseSerializer(serializers.Serializer):
    data = TaskResponseSerializer(many=True)
    meta = TaskPageMetaSerializer()


class TaskStateResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()


@extend_schema_serializer(many=False)
class TaskStatesResponseEnvelopeSerializer(serializers.Serializer):
    data = TaskStateResponseSerializer(many=True)


class TaskManagerErrorDetailSerializer(serializers.Serializer):
    code = serializers.CharField()
    message = serializers.CharField()


class TaskManagerErrorResponseSerializer(serializers.Serializer):
    error = TaskManagerErrorDetailSerializer()
