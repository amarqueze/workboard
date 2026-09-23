from django.contrib.auth.models import AbstractUser
from django.db import models


class Account(AbstractUser):
    id = models.BigAutoField(primary_key=True)
    login_attempts = models.PositiveSmallIntegerField(default=0)

    def __str__(self) -> str:
        return self.username
    
class AccountInfo(models.Model):
    id = models.BigAutoField(primary_key=True)

    account = models.OneToOneField(
        Account,
        on_delete=models.CASCADE,
        related_name="info",
    )

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    role = models.CharField(max_length=50)

    def __str__(self) -> str:
        return f"{self.name} {self.last_name}"  