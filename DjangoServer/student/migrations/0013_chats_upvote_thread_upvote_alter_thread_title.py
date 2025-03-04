# Generated by Django 5.1.2 on 2024-11-02 23:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0012_remove_lecturer_annoucement_announcement_comment'),
    ]

    operations = [
        migrations.AddField(
            model_name='chats',
            name='upvote',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='thread',
            name='upvote',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='thread',
            name='title',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
