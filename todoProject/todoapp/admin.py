from django.contrib import admin
from .models import Todo
# Register your models here.
@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin): 
    list_display = ('id', 'title', 'completed', 'created_at', 'updated_at')
    search_fields = ('title',)
    list_filter = ('completed', 'created_at')