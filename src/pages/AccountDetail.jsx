import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Plus,
  Mail,
  Phone,
  Calendar,
  Edit,
  FileText,
  Lightbulb,
  BookOpen
} from 'lucide-react';
import { format } from 'date-fns';
import InteractionTimeline from '../components/account/InteractionTimeline';
import ContactsList from '../components/account/ContactsList';
import AccountScore from '../components/account/AccountScore';
import SalesInsights from '../components/account/SalesInsights';
import ResearchNotes from '../components/account/ResearchNotes';
import AddInteractionDialog from '../components/account/AddInteractionDialog';
import EditAccountDialog from '../components/account/EditAccountDialog';
import TutorialTooltip from '../components/TutorialTooltip';
import GmailConnection from '../components/GmailConnection';

export default function AccountDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('id');
  const [showAddInteraction, setShowAddInteraction] = useState(false);
  const [showEditAccount, setShowEditAccount] = useState(false);

  const queryClient = useQueryClient();

  const { data: account, isLoading } = useQuery({
    queryKey: ['account', accountId],
    queryFn: async () => {
      const accounts = await base44.entities.Account.list();
      return accounts.find(a => a.id === accountId);
    },
    enabled: !!accountId
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts', accountId],
    queryFn: () => base44.entities.Contact.filter({ account_id: accountId })
  });

  const { data: interactions = [] } = useQuery({
    queryKey: ['interactions', accountId],
    queryFn: () => base44.entities.Interaction.filter({ account_id: accountId }, '-interaction_date')
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', accountId],
    queryFn: () => base44.entities.Task.filter({ related_account_id: accountId })
  });

  const { data: scorecards = [] } = useQuery({
    queryKey: ['scorecards', accountId],
    queryFn: () => base44.entities.ScorecardResponse.filter({ account_id: accountId }, '-completed_date')
  });

  const { data: salesInsights = [] } = useQuery({
    queryKey: ['sales-insights', accountId],
    queryFn: () => base44.entities.SalesInsight.filter({ account_id: accountId }, '-recorded_date')
  });

  const { data: researchNotes = [] } = useQuery({
    queryKey: ['research-notes', accountId],
    queryFn: () => base44.entities.ResearchNote.filter({ account_id: accountId }, '-recorded_date')
  });

  if (isLoading || !account) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-emerald-100 text-emerald-800',
      at_risk: 'bg-red-100 text-red-800',
      negotiating: 'bg-blue-100 text-blue-800',
      onboarding: 'bg-purple-100 text-purple-800',
      churned: 'bg-slate-100 text-slate-600'
    };
    return colors[status] || colors.active;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <TutorialTooltip
        tip="This is the Account Detail page. View complete information about an account including interactions, contacts, organization scores, sales insights, and research notes. Use the tabs to navigate between different sections."
        step={3}
        position="bottom"
      >
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
            <Building2 className="w-8 h-8 text-slate-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{account.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge className={getStatusColor(account.status)}>
                {account.status}
              </Badge>
              <Badge variant="outline" className="text-slate-700">
                {account.account_type}
              </Badge>
              {account.revenue_segment && (
                <Badge variant="outline" className="text-slate-700">
                  {account.revenue_segment.replace('_', ' ')}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowEditAccount(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button onClick={() => setShowAddInteraction(true)} className="bg-slate-900 hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-2" />
            Log Interaction
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Organization Score</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {account.organization_score || '—'}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Contacts</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{contacts.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Interactions</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{interactions.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Open Tasks</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {tasks.filter(t => t.status !== 'completed').length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Details */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {account.industry && (
              <div>
                <p className="text-sm text-slate-600">Industry</p>
                <p className="font-medium text-slate-900 mt-1">{account.industry}</p>
              </div>
            )}
            {account.annual_revenue && (
              <div>
                <p className="text-sm text-slate-600">Annual Revenue</p>
                <p className="font-medium text-slate-900 mt-1">
                  ${account.annual_revenue.toLocaleString()}
                </p>
              </div>
            )}
            {account.assigned_to && (
              <div>
                <p className="text-sm text-slate-600">Account Owner</p>
                <p className="font-medium text-slate-900 mt-1">{account.assigned_to}</p>
              </div>
            )}
            {account.last_interaction_date && (
              <div>
                <p className="text-sm text-slate-600">Last Contact</p>
                <p className="font-medium text-slate-900 mt-1">
                  {format(new Date(account.last_interaction_date), 'MMM d, yyyy')}
                </p>
              </div>
            )}
            {account.renewal_date && (
              <div>
                <p className="text-sm text-slate-600">Renewal Date</p>
                <p className="font-medium text-slate-900 mt-1">
                  {format(new Date(account.renewal_date), 'MMM d, yyyy')}
                </p>
              </div>
            )}
            {account.phone && (
              <div>
                <p className="text-sm text-slate-600">Phone</p>
                <p className="font-medium text-slate-900 mt-1">{account.phone}</p>
              </div>
            )}
            {account.website && (
              <div>
                <p className="text-sm text-slate-600">Website</p>
                <a 
                  href={account.website.startsWith('http') ? account.website : `https://${account.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:text-blue-800 mt-1 inline-block"
                >
                  {account.website}
                </a>
              </div>
            )}
            {account.address && (
              <div className="md:col-span-2">
                <p className="text-sm text-slate-600">Address</p>
                <p className="font-medium text-slate-900 mt-1">{account.address}</p>
              </div>
            )}
          </div>
          {account.notes && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Notes</p>
              <p className="text-slate-900">{account.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="interactions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="interactions">
            <MessageSquare className="w-4 h-4 mr-2" />
            Interactions ({interactions.length})
          </TabsTrigger>
          <TabsTrigger value="contacts">
            <Users className="w-4 h-4 mr-2" />
            Contacts ({contacts.length})
          </TabsTrigger>
          <TabsTrigger value="scoring">
            <TrendingUp className="w-4 h-4 mr-2" />
            Scoring
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Lightbulb className="w-4 h-4 mr-2" />
            Sales Insights ({salesInsights.length})
          </TabsTrigger>
          <TabsTrigger value="research">
            <BookOpen className="w-4 h-4 mr-2" />
            Research Notes ({researchNotes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="interactions" className="space-y-6">
          <GmailConnection 
            onSyncComplete={(result) => {
              queryClient.invalidateQueries({ queryKey: ['interactions', accountId] });
              queryClient.invalidateQueries({ queryKey: ['account', accountId] });
            }}
          />
          <InteractionTimeline 
            interactions={interactions} 
            accountId={accountId}
            contacts={contacts}
          />
        </TabsContent>

        <TabsContent value="contacts">
          <ContactsList 
            contacts={contacts} 
            accountId={accountId}
            accountName={account.name}
          />
        </TabsContent>

        <TabsContent value="scoring">
          <AccountScore 
            accountId={accountId}
            scorecards={scorecards}
            currentScore={account.organization_score}
            accountName={account.name}
          />
        </TabsContent>

        <TabsContent value="insights">
          <SalesInsights 
            accountId={accountId}
            interactions={interactions}
          />
        </TabsContent>

        <TabsContent value="research">
          <ResearchNotes 
            accountId={accountId}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddInteractionDialog
        open={showAddInteraction}
        onClose={() => setShowAddInteraction(false)}
        accountId={accountId}
        contacts={contacts}
      />

      <EditAccountDialog
        open={showEditAccount}
        onClose={() => setShowEditAccount(false)}
        account={account}
      />
      </TutorialTooltip>
    </div>
  );
}

