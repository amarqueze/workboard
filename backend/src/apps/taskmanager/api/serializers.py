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

    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()
    assigned_to = serializers.SerializerMethodField()

    state = serializers.CharField(source="state.name")

    def get_created_by(self, obj):
        return {
            "id": obj.created_by.id,
            "name": f"{obj.created_by.name} {obj.created_by.last_name}"
        }

    def get_updated_by(self, obj):
        if obj.updated_by is None:
            return None

        return {
            "id": obj.updated_by.id,
            "name": f"{obj.updated_by.name} {obj.updated_by.last_name}"
        }

    def get_assigned_to(self, obj):
        if obj.assigned_to is None:
            return None

        return {
            "id": obj.assigned_to.id,
            "name": f"{obj.assigned_to.name} {obj.assigned_to.last_name}"
        }


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
