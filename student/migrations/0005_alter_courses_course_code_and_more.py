# Generated by Django 5.1.2 on 2024-10-28 14:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0004_alter_users_profile_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='courses',
            name='course_code',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='courses',
            name='course_credit',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='courses',
            name='course_department',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='courses',
            name='course_description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='courses',
            name='course_level',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
