import { base44 } from '@/api/base44Client';
import { differenceInDays, isToday, isPast, startOfDay, addDays } from 'date-fns';

/**
 * Create notifications for task reminders
 * This service automatically creates notifications when tasks are created or updated
 */
export async function createTaskNotifications(task) {
  if (!task.due_date || task.status === 'completed') {
    return; // No notifications for tasks without due dates or completed tasks
  }

  const dueDate = new Date(task.due_date);
  const today = startOfDay(new Date());
  const taskDate = startOfDay(dueDate);
  
  // Get the user assigned to the task (or default to current user)
  const currentUser = await base44.auth.me();
  const assignedUser = task.assigned_to || currentUser.email;
  
  // Find user by email
  const users = await base44.entities.User.list();
  let user = users.find(u => u.email === assignedUser);
  
  // If user not found by email, use current user or first user as fallback
  if (!user) {
    user = currentUser.id ? users.find(u => u.id === currentUser.id) : users[0];
  }
  
  if (!user || !user.id) {
    console.warn('Could not find user for notification:', assignedUser);
    return;
  }

  const daysUntilDue = differenceInDays(taskDate, today);
  const isOverdue = isPast(taskDate) && !isToday(taskDate);
  const isDueToday = isToday(taskDate);

  // Check if notification already exists
  const existingNotifications = await base44.entities.Notification.filter({
    user_id: user.id,
    related_task_id: task.id,
    is_read: false
  });

  // Remove existing notifications for this task
  for (const notif of existingNotifications) {
    await base44.entities.Notification.update(notif.id, { is_read: true });
  }

  // Create notification based on task status
  if (isOverdue) {
    // Task is overdue
    await base44.entities.Notification.create({
      user_id: user.id,
      type: 'task_overdue',
      title: 'Task Overdue',
      message: `"${task.title}" is overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? 's' : ''}`,
      related_task_id: task.id,
      related_account_id: task.related_account_id || null,
      scheduled_for: new Date().toISOString()
    });
  } else if (isDueToday) {
    // Task is due today
    await base44.entities.Notification.create({
      user_id: user.id,
      type: 'task_due_today',
      title: 'Task Due Today',
      message: `"${task.title}" is due today`,
      related_task_id: task.id,
      related_account_id: task.related_account_id || null,
      scheduled_for: new Date().toISOString()
    });
  } else if (daysUntilDue === 1) {
    // Task is due tomorrow
    await base44.entities.Notification.create({
      user_id: user.id,
      type: 'task_reminder',
      title: 'Task Due Tomorrow',
      message: `"${task.title}" is due tomorrow`,
      related_task_id: task.id,
      related_account_id: task.related_account_id || null,
      scheduled_for: addDays(today, 1).toISOString()
    });
  } else if (daysUntilDue <= 7) {
    // Task is due within a week
    await base44.entities.Notification.create({
      user_id: user.id,
      type: 'task_reminder',
      title: 'Task Due Soon',
      message: `"${task.title}" is due in ${daysUntilDue} days`,
      related_task_id: task.id,
      related_account_id: task.related_account_id || null,
      scheduled_for: taskDate.toISOString()
    });
  }
}

/**
 * Clean up notifications for completed tasks
 */
export async function cleanupTaskNotifications(taskId) {
  const notifications = await base44.entities.Notification.filter({
    related_task_id: taskId,
    is_read: false
  });
  
  for (const notification of notifications) {
    await base44.entities.Notification.update(notification.id, { is_read: true });
  }
}

