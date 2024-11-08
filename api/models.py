from django.db import models

# Create your models here.
from rest_framework import serializers
from student.models import *


class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False)

    class Meta:
        model = Users
        exclude = ['password_hash', 'reset_token']


class UserPostSerializer(serializers.ModelSerializer):
    # profile_image = serializers.ImageField(required=False)

    class Meta:
        model = Users
        exclude = ['reset_token']


class UserLoginSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False)

    class Meta:
        model = Users
        fields = ['email', 'password_hash', 'profile_image']


class UserResetPasswordSerializer(serializers.ModelSerializer):
    # profile_image = serializers.ImageField(required=False)

    class Meta:
        model = Users
        fields = ['email']


class UserResetTokenSerializer(serializers.ModelSerializer):
    # profile_image = serializers.ImageField(required=False)

    class Meta:
        model = Users
        fields = ['reset_token']


class StudentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Students
        fields = '__all__'


class LecturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecturer
        fields = '__all__'


class CoursesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = '__all__'


class CoursesResourcesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course_Resources
        fields = '__all__'
        read_only_fields = ['lecture']


class LectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = '__all__'
        read_only_fields = ['course']


class FacialRecognitionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facial_Recognition
        fields = '__all__'


class ChatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chats
        fields = '__all__'
        read_only_fields = ['sender', 'thread']


class EnrollmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollments
        fields = '__all__'


class ForumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Forum
        fields = '__all__'
        read_only_fields = ['course', 'creator']


class ThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = '__all__'
        read_only_fields = ['forum', 'user']


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'
        read_only_fields = ['course', 'lecturer']


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['announcement', 'user']
