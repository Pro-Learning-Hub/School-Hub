# Generated by Django 5.1.2 on 2024-10-23 19:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='reset_token',
            field=models.CharField(blank=True, max_length=32, null=True),
        ),
    ]
