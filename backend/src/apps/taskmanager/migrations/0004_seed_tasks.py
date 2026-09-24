from datetime import timedelta

from django.db import migrations
from django.utils import timezone

TASKS = [
    {
        "name": "Review quarterly financial statements",
        "description": "Review the quarterly financial statements and validate the reported balances.",
        "state": "OPEN",
        "days": 3,
    },
    {
        "name": "Prepare revenue disclosure",
        "description": "Prepare the revenue disclosure and verify the required financial information.",
        "state": "PROGRESS",
        "days": 5,
    },
    {
        "name": "Validate expense classifications",
        "description": "Review expense classifications and confirm they are reported in the correct financial categories.",
        "state": "OPEN",
        "days": 7,
    },
    {
        "name": "Review cash flow disclosure",
        "description": "Review cash flow information and prepare the supporting disclosure documentation.",
        "state": "REVIEW",
        "days": 9,
    },
    {
        "name": "Prepare debt disclosure",
        "description": "Prepare disclosure information related to outstanding debt and financing obligations.",
        "state": "PROGRESS",
        "days": 11,
    },
    {
        "name": "Reconcile balance sheet accounts",
        "description": "Reconcile key balance sheet accounts and investigate outstanding differences.",
        "state": "OPEN",
        "days": 13,
    },
    {
        "name": "Review operating expenses",
        "description": "Analyze operating expenses and validate significant period-over-period changes.",
        "state": "DONE",
        "days": 15,
    },
    {
        "name": "Prepare liquidity disclosure",
        "description": "Prepare liquidity information and supporting data for financial disclosure.",
        "state": "PROGRESS",
        "days": 17,
    },
    {
        "name": "Validate accounts receivable",
        "description": "Review accounts receivable balances and validate the related financial information.",
        "state": "OPEN",
        "days": 19,
    },
    {
        "name": "Review accounts payable",
        "description": "Review accounts payable balances and investigate material outstanding items.",
        "state": "REVIEW",
        "days": 21,
    },
    {
        "name": "Prepare capital expenditure analysis",
        "description": "Analyze capital expenditures and prepare supporting financial information.",
        "state": "OPEN",
        "days": 23,
    },
    {
        "name": "Review financial risk disclosure",
        "description": "Review financial risk information and confirm required disclosure details.",
        "state": "PROGRESS",
        "days": 25,
    },
    {
        "name": "Validate interest expense",
        "description": "Validate interest expense calculations and reconcile them with financing records.",
        "state": "DONE",
        "days": 27,
    },
    {
        "name": "Prepare asset impairment disclosure",
        "description": "Prepare supporting information for asset impairment disclosures.",
        "state": "REVIEW",
        "days": 29,
    },
    {
        "name": "Review financial commitments",
        "description": "Review contractual financial commitments and prepare the required disclosure information.",
        "state": "OPEN",
        "days": 31,
    },
    {
        "name": "Analyze revenue variance",
        "description": "Analyze significant revenue variances and document the main financial drivers.",
        "state": "PROGRESS",
        "days": 33,
    },
    {
        "name": "Prepare tax disclosure",
        "description": "Prepare financial information required for the tax disclosure section.",
        "state": "REVIEW",
        "days": 35,
    },
    {
        "name": "Validate fixed asset balances",
        "description": "Validate fixed asset balances and reconcile additions and disposals.",
        "state": "OPEN",
        "days": 37,
    },
    {
        "name": "Review equity disclosure",
        "description": "Review equity movements and prepare supporting disclosure information.",
        "state": "DONE",
        "days": 39,
    },
    {
        "name": "Prepare financial highlights",
        "description": "Prepare key financial highlights for the reporting and disclosure package.",
        "state": "PROGRESS",
        "days": 41,
    },
    {
        "name": "Review lease obligations",
        "description": "Review lease obligations and validate amounts included in financial disclosures.",
        "state": "OPEN",
        "days": 43,
    },
    {
        "name": "Validate financial ratios",
        "description": "Calculate and validate key financial ratios used in reporting and disclosures.",
        "state": "REVIEW",
        "days": 45,
    },
    {
        "name": "Prepare related party disclosure",
        "description": "Prepare financial information for related party transactions and disclosures.",
        "state": "PROGRESS",
        "days": 47,
    },
    {
        "name": "Review contingent liabilities",
        "description": "Review contingent liabilities and confirm items requiring financial disclosure.",
        "state": "OPEN",
        "days": 49,
    },
    {
        "name": "Complete disclosure package review",
        "description": "Perform the final review of the financial disclosure package before completion.",
        "state": "DONE",
        "days": 51,
    },
]


def create_tasks(apps, schema_editor):
    Task = apps.get_model("taskmanager", "Task")
    TaskState = apps.get_model("taskmanager", "TaskState")
    AccountInfo = apps.get_model("accounts", "AccountInfo")

    account = AccountInfo.objects.filter(id=1).first()

    if account is None:
        raise RuntimeError(
            "AccountInfo with id=1 is required to seed tasks."
        )

    states = {
        state.name: state
        for state in TaskState.objects.filter(
            name__in=["OPEN", "PROGRESS", "REVIEW", "DONE"]
        )
    }

    required_states = {"OPEN", "PROGRESS", "REVIEW", "DONE"}
    missing_states = required_states - states.keys()

    if missing_states:
        raise RuntimeError(
            f"Missing TaskState records: {sorted(missing_states)}"
        )

    now = timezone.now()

    for task_data in TASKS:
        Task.objects.get_or_create(
            name=task_data["name"],
            defaults={
                "description": task_data["description"],
                "due_date": now + timedelta(days=task_data["days"]),
                "created_by_id": 1,
                "updated_by_id": 1,
                "assigned_to": None,
                "state": states[task_data["state"]],
            },
        )


def delete_tasks(apps, schema_editor):
    Task = apps.get_model("taskmanager", "Task")

    task_names = [task["name"] for task in TASKS]

    Task.objects.filter(
        name__in=task_names,
        created_by_id=1,
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('taskmanager', '0003_alter_task_assigned_to_alter_task_description'),
    ]

    operations = [
        migrations.RunPython(
            create_tasks,
            delete_tasks,
        ),
    ]