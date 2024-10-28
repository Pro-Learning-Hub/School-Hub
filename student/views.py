from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.db.models import Q

# from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.hashers import make_password, check_password
from django.utils.crypto import get_random_string
from .models import Chats, Students, Courses, Users
from authentication.models import Auth
# from .models import Student
# from .forms import StudentForm

# Create your views here.

# class StudentListView(LoginRequiredMixin, ListView):
#     model = Student
# Create your views here.


def resources(request, course_id):
    pass


def resources_upload(request, course_id):
    pass


def students(request):
    pass


def courses(request):
    pass


def chat(request):
    all_users = Users.objects.all()
    current_user = request.session.get('user_id')
    return render(request, 'student/chat_display.html', {'all_users': all_users, 'current_user': current_user})


def message(request, user_id):
    receiver = get_object_or_404(Users, user_id=user_id)
    session = request.session.get('user_id')
    sender = Users.objects.filter(user_id=session).first()
    if request.method == 'POST':
        content = request.POST['message']
        if content:
            Chats.objects.create(
                sender=sender, receiver=receiver, message=content)
            messages = Chats.objects.filter((Q(sender=sender) & Q(receiver=receiver))
                                            | (Q(sender=receiver) & Q(receiver=sender))).order_by('timestamp')
            return render(request, 'student/chat.html', {'messages': messages, 'receiver': receiver})
            # return redirect('chat', user_id=user_id)
    return render(request, 'student/chat.html', {'receiver': receiver})


# def chat_details(request, user_id):
#     if request.method == 'POST':
#         receiver = get_object_or_404(Users, id=user_id)
#         session = request.session.get('user_id')
#         sender = Users.objects.filter(user_id=session).first()
#         messages = Chats.objects.filter((Q(sender=sender) & Q(receiver=receiver))
#                                         | (Q(sender=receiver) & Q(receiver=sender))).order_by('timestamp')
#         return render(request, 'student/chat.html', {'messages': messages, 'receiver': receiver})
#     return render(request, 'student/chat_details.html')

# def chat(request, user_id):
#     current_user_id = request.session.get('user_id')
#     if current_user_id:
#         receiver = Users.objects.get(id=user_id)
#         messages = Chats.objects.filter(
#             (Q(sender=request.user) & Q(receiver=receiver)) | (
#                 Q(sender=receiver) & Q(receiver=request.user))
#         ).order_by('timestamp')

#         if request.method == 'POST':
#             content = request.POST['message']
#             if content:
#                 Chats.objects.create(
#                     sender=request.user, receiver=receiver, content=content)
#                 # message.save()
#             return redirect('chat', user_id=user_id)

#         return render(request, 'student/chat.html', {'messages': messages, 'receiver': receiver})

#     return redirect(request, 'student/chat.html')
