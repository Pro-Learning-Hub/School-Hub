# Generated by Django 5.1.2 on 2024-10-30 20:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0008_alter_courses_lecturer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course_resources',
            name='resource_file',
            field=models.FileField(blank=True, null=True, upload_to='course_resources/'),
        ),
    ]
