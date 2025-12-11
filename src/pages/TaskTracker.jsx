import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Clock, 
  CheckSquare,
  User,
  Code,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';

// Task data structure
const initialClientTasks = [
  {
    id: 'client-1',
    title: '"do-not-use" Flag Format Specification',
    priority: 'P0',
    status: 'pending',
    category: 'blocking',
    question: 'What exact text/format will you use to flag inactive contacts in LMN?',
    notes: 'Need: Sample CSV row, exact string format, which columns contain flag'
  },
  {
    id: 'client-2',
    title: 'Meeting Notes Template Structure',
    priority: 'P0',
    status: 'pending',
    category: 'blocking',
    question: 'Can you share a sample of your ChatGPT meeting notes template?',
    notes: 'Need: Sample template to design MeetingNotes entity structure'
  },
  {
    id: 'client-3',
    title: 'ICP Category Thresholds',
    priority: 'P0',
    status: 'pending',
    category: 'blocking',
    question: 'What score ranges define each ICP category?',
    notes: 'Example: 81-100 = "Ideal", 61-80 = "Good", etc.'
  },
  {
    id: 'client-4',
    title: '"Tea" Notes Placement Preference',
    priority: 'P0',
    status: 'pending',
    category: 'ux',
    question: 'Where should "Tea" notes appear in AccountDetail?',
    notes: 'Options: Separate tab, collapsible section, or sidebar panel'
  },
  {
    id: 'client-5',
    title: 'Need vs Want Board Access Control',
    priority: 'P1',
    status: 'pending',
    category: 'ux',
    question: 'Who should have access to the Need vs Want board?',
    notes: 'Just you, or you + specific team members?'
  },
  {
    id: 'client-6',
    title: 'Multi-User Gmail Sync Confirmation',
    priority: 'P1',
    status: 'pending',
    category: 'planning',
    question: 'Will multiple LECM staff members need to connect their Gmail accounts?',
    notes: 'Confirm multi-user requirements and approach'
  },
  {
    id: 'client-7',
    title: 'Staging Environment Data Source',
    priority: 'P1',
    status: 'pending',
    category: 'planning',
    question: 'For staging environment, what data source should we use?',
    notes: 'Sanitized/test data, separate Google Sheet, or same source with flag?'
  },
  {
    id: 'client-8',
    title: 'Colliers International Test Account Setup',
    priority: 'P0',
    status: 'pending',
    category: 'blocking',
    question: 'Do you have Colliers International data ready to import?',
    notes: 'Coordinate Colliers import timing with development progress'
  }
];

const initialDevTasks = [
  {
    id: 'dev-A1',
    title: 'Implement "do-not-use" Contact Filtering',
    priority: 'P0',
    status: 'pending',
    category: 'data',
    files: 'lmnContactsExportParser.js, lmnLeadsListParser.js, lmnMergeData.js',
    dependsOn: 'client-1',
    notes: 'Add filter logic to skip contacts flagged as inactive'
  },
  {
    id: 'dev-A2',
    title: 'Enhance Inactive Contact Detection',
    priority: 'P0',
    status: 'pending',
    category: 'data',
    files: 'lmnContactsExportParser.js, ImportLeadsDialog.jsx',
    notes: 'Add validation feedback in import dialog'
  },
  {
    id: 'dev-A3',
    title: 'Verify Unique ID Mapping for Estimates',
    priority: 'P1',
    status: 'pending',
    category: 'data',
    files: 'lmnEstimatesListParser.js, lmnMergeData.js',
    notes: 'Review estimate-to-account linking logic'
  },
  {
    id: 'dev-B1',
    title: 'Create MeetingNotes Entity',
    priority: 'P0',
    status: 'pending',
    category: 'backend',
    files: 'base44Client.js, MeetingNotes.jsx (new)',
    dependsOn: 'client-2',
    notes: 'Start with flexible structure, can enhance later'
  },
  {
    id: 'dev-B2',
    title: 'Create TeaNotes/PersonalNotes Entity',
    priority: 'P0',
    status: 'pending',
    category: 'backend',
    files: 'base44Client.js, TeaNotes.jsx (new)',
    dependsOn: 'client-4',
    notes: 'Free-form text notes, simple structure'
  },
  {
    id: 'dev-B3',
    title: 'Add ICP Fields to Account Entity',
    priority: 'P0',
    status: 'pending',
    category: 'backend',
    files: 'base44Client.js, AccountDetail.jsx',
    dependsOn: 'client-3',
    notes: 'Add icp_score, icp_category, icp_attributes fields'
  },
  {
    id: 'dev-B4',
    title: 'Create NeedVsWant/FeatureRequest Entity',
    priority: 'P1',
    status: 'pending',
    category: 'backend',
    files: 'base44Client.js, NeedVsWant.jsx (new)',
    dependsOn: 'client-5',
    notes: 'Start with email whitelist for admin access'
  },
  {
    id: 'dev-E1',
    title: 'Add Meeting Notes Tab to Account Detail',
    priority: 'P0',
    status: 'pending',
    category: 'frontend',
    files: 'AccountDetail.jsx, MeetingNotes.jsx',
    dependsOn: 'dev-B1',
    notes: 'Tab placement after Communication History'
  },
  {
    id: 'dev-E2',
    title: 'Add Tea Notes Section to Account Detail',
    priority: 'P0',
    status: 'pending',
    category: 'frontend',
    files: 'AccountDetail.jsx, TeaNotes.jsx',
    dependsOn: 'dev-B2',
    notes: 'Placement TBD per client preference'
  },
  {
    id: 'dev-D1',
    title: 'Add ICP Fields UI to Account Detail',
    priority: 'P0',
    status: 'pending',
    category: 'frontend',
    files: 'AccountDetail.jsx, ICPFields.jsx (new)',
    dependsOn: 'dev-B3',
    notes: 'Display in Info tab with score, category badge, attributes'
  },
  {
    id: 'dev-D2',
    title: 'Implement ICP Segmentation/Filtering',
    priority: 'P0',
    status: 'pending',
    category: 'frontend',
    files: 'Accounts.jsx',
    dependsOn: 'dev-B3',
    notes: 'Add filter controls for ICP score ranges and categories'
  },
  {
    id: 'dev-D4',
    title: 'Link Scorecards to Account ICP Fields',
    priority: 'P1',
    status: 'pending',
    category: 'frontend',
    files: 'TakeScorecard.jsx, base44Client.js',
    notes: 'Auto-update account ICP when scorecard completed'
  },
  {
    id: 'dev-F1',
    title: 'Implement Environment Configuration System',
    priority: 'P0',
    status: 'pending',
    category: 'infra',
    files: 'config/environment.js (new), base44Client.js',
    notes: 'Use VITE_ENVIRONMENT env var for staging/production'
  },
  {
    id: 'dev-F3',
    title: 'Add Environment Indicator to UI',
    priority: 'P1',
    status: 'pending',
    category: 'infra',
    files: 'Layout.jsx',
    dependsOn: 'dev-F1',
    notes: 'Banner at top showing STAGING/PRODUCTION'
  },
  {
    id: 'dev-C1',
    title: 'Verify Multi-User Gmail Support',
    priority: 'P1',
    status: 'pending',
    category: 'integration',
    files: 'gmailService.js, gmailSyncService.js',
    dependsOn: 'client-6',
    notes: 'Review implementation for multi-user support'
  },
  {
    id: 'dev-C2',
    title: 'Enhance Email Matching Logic',
    priority: 'P1',
    status: 'pending',
    category: 'integration',
    files: 'emailMatchingService.js',
    notes: 'Improve matching for edge cases'
  },
  {
    id: 'dev-E3',
    title: 'Enhance Contact Dossier View',
    priority: 'P1',
    status: 'pending',
    category: 'frontend',
    files: 'ContactsList.jsx, Contacts.jsx',
    notes: 'Redesign contact card with all key info'
  },
  {
    id: 'dev-E4',
    title: 'Add Email History View to Contact/Account',
    priority: 'P1',
    status: 'pending',
    category: 'frontend',
    files: 'InteractionTimeline.jsx',
    notes: 'Add contact filter dropdown'
  },
  {
    id: 'dev-E5',
    title: 'Create Need vs Want Admin Board Page',
    priority: 'P1',
    status: 'pending',
    category: 'frontend',
    files: 'NeedVsWant.jsx, Layout.jsx',
    dependsOn: 'dev-B4',
    notes: 'Board-style UI with columns, admin-only access'
  },
  {
    id: 'dev-E6',
    title: 'Update Estimates Display to Prioritize Close Date',
    priority: 'P1',
    status: 'pending',
    category: 'frontend',
    files: 'WinLossTest.jsx, EstimatesTab.jsx',
    notes: 'Sort by estimate_close_date, not creation date'
  }
];

export default function TaskTracker() {
  const [clientTasks, setClientTasks] = useState(() => {
    const saved = localStorage.getItem('taskTracker_clientTasks');
    return saved ? JSON.parse(saved) : initialClientTasks;
  });

  const [devTasks, setDevTasks] = useState(() => {
    const saved = localStorage.getItem('taskTracker_devTasks');
    return saved ? JSON.parse(saved) : initialDevTasks;
  });

  const [filter, setFilter] = useState('all'); // all, pending, in-progress, completed, blocked
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskTracker_clientTasks', JSON.stringify(clientTasks));
  }, [clientTasks]);

  useEffect(() => {
    localStorage.setItem('taskTracker_devTasks', JSON.stringify(devTasks));
  }, [devTasks]);

  const toggleTaskStatus = (taskId, taskType) => {
    if (taskType === 'client') {
      setClientTasks(tasks => 
        tasks.map(task => {
          if (task.id === taskId) {
            const statusOrder = ['pending', 'in-progress', 'completed'];
            const currentIndex = statusOrder.indexOf(task.status);
            const nextIndex = (currentIndex + 1) % statusOrder.length;
            return { ...task, status: statusOrder[nextIndex] };
          }
          return task;
        })
      );
    } else {
      setDevTasks(tasks => 
        tasks.map(task => {
          if (task.id === taskId) {
            const statusOrder = ['pending', 'in-progress', 'completed'];
            const currentIndex = statusOrder.indexOf(task.status);
            const nextIndex = (currentIndex + 1) % statusOrder.length;
            return { ...task, status: statusOrder[nextIndex] };
          }
          return task;
        })
      );
    }
  };

  const resetAllTasks = () => {
    if (window.confirm('Reset all tasks to initial state? This cannot be undone.')) {
      setClientTasks(initialClientTasks);
      setDevTasks(initialDevTasks);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'blocked':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      default:
        return <Circle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'blocked':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'P0':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'P1':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const filterTasks = (tasks) => {
    return tasks.filter(task => {
      // Status filter
      if (filter !== 'all' && task.status !== filter) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && task.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          task.title.toLowerCase().includes(searchLower) ||
          task.notes?.toLowerCase().includes(searchLower) ||
          task.files?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  };

  const filteredClientTasks = filterTasks(clientTasks);
  const filteredDevTasks = filterTasks(devTasks);

  const getTaskStats = (tasks) => {
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      blocked: tasks.filter(t => t.status === 'blocked').length
    };
  };

  const clientStats = getTaskStats(clientTasks);
  const devStats = getTaskStats(devTasks);

  const renderTaskCard = (task, taskType) => {
    const isBlocked = task.dependsOn && 
      (taskType === 'client' 
        ? clientTasks.find(t => t.id === task.dependsOn)?.status !== 'completed'
        : (clientTasks.find(t => t.id === task.dependsOn)?.status !== 'completed' ||
           devTasks.find(t => t.id === task.dependsOn)?.status !== 'completed'));

    return (
      <Card 
        key={task.id} 
        className={`hover:shadow-md transition-shadow ${
          isBlocked ? 'opacity-60 border-amber-300' : ''
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => toggleTaskStatus(task.id, taskType)}
              className="mt-1 flex-shrink-0 hover:opacity-80 transition-opacity"
              title={`Click to cycle: ${task.status} → ${task.status === 'pending' ? 'in-progress' : task.status === 'in-progress' ? 'completed' : 'pending'}`}
            >
              {getStatusIcon(task.status)}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-slate-900">{task.title}</h3>
                <div className="flex gap-2 flex-shrink-0">
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(task.status)}>
                    {task.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
              
              {task.question && (
                <p className="text-sm text-slate-700 mb-2 italic">
                  <strong>Question:</strong> {task.question}
                </p>
              )}
              
              {task.notes && (
                <p className="text-sm text-slate-600 mb-2">
                  {task.notes}
                </p>
              )}
              
              {task.files && (
                <p className="text-xs text-slate-500 mb-2">
                  <strong>Files:</strong> {task.files}
                </p>
              )}
              
              {isBlocked && task.dependsOn && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                  <strong>Blocked:</strong> Waiting on {task.dependsOn}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Task Tracker</h1>
          <p className="text-slate-600 mt-1">Track client decisions and development progress</p>
        </div>
        <Button variant="outline" onClick={resetAllTasks} size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset All
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-slate-600" />
              <h3 className="font-semibold text-slate-900">Client Tasks</h3>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-2xl font-bold text-slate-900">{clientStats.total}</div>
                <div className="text-xs text-slate-600">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-600">{clientStats.pending}</div>
                <div className="text-xs text-slate-600">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{clientStats.inProgress}</div>
                <div className="text-xs text-slate-600">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">{clientStats.completed}</div>
                <div className="text-xs text-slate-600">Done</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-5 h-5 text-slate-600" />
              <h3 className="font-semibold text-slate-900">Development Tasks</h3>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-2xl font-bold text-slate-900">{devStats.total}</div>
                <div className="text-xs text-slate-600">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-600">{devStats.pending}</div>
                <div className="text-xs text-slate-600">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{devStats.inProgress}</div>
                <div className="text-xs text-slate-600">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">{devStats.completed}</div>
                <div className="text-xs text-slate-600">Done</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Filters:</span>
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'in-progress', 'completed'].map(status => (
                <Button
                  key={status}
                  variant={filter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </Button>
              ))}
            </div>
            <div className="flex gap-2 ml-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Tasks Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-slate-600" />
          <h2 className="text-2xl font-bold text-slate-900">Client Tasks</h2>
          <Badge variant="outline">{filteredClientTasks.length} shown</Badge>
        </div>
        <div className="space-y-3">
          {filteredClientTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-slate-500">
                No client tasks match the current filters.
              </CardContent>
            </Card>
          ) : (
            filteredClientTasks.map(task => renderTaskCard(task, 'client'))
          )}
        </div>
      </div>

      {/* Development Tasks Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-slate-600" />
          <h2 className="text-2xl font-bold text-slate-900">Development Tasks</h2>
          <Badge variant="outline">{filteredDevTasks.length} shown</Badge>
        </div>
        <div className="space-y-3">
          {filteredDevTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-slate-500">
                No development tasks match the current filters.
              </CardContent>
            </Card>
          ) : (
            filteredDevTasks.map(task => renderTaskCard(task, 'dev'))
          )}
        </div>
      </div>
    </div>
  );
}
