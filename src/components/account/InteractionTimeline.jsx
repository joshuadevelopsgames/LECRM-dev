import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MessageSquare, Calendar, FileText, Linkedin, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export default function InteractionTimeline({ interactions, contacts }) {
  const getInteractionIcon = (type) => {
    const icons = {
      email_sent: Mail,
      email_received: Mail,
      call: Phone,
      meeting: Calendar,
      note: FileText,
      linkedin_message: Linkedin
    };
    return icons[type] || MessageSquare;
  };

  const getTypeColor = (type) => {
    const colors = {
      email_sent: 'bg-blue-100 text-blue-800 border-blue-200',
      email_received: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      call: 'bg-purple-100 text-purple-800 border-purple-200',
      meeting: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      note: 'bg-slate-100 text-slate-800 border-slate-200',
      linkedin_message: 'bg-sky-100 text-sky-800 border-sky-200'
    };
    return colors[type] || 'bg-slate-100 text-slate-800';
  };

  const getSentimentColor = (sentiment) => {
    const colors = {
      positive: 'bg-emerald-100 text-emerald-800',
      neutral: 'bg-slate-100 text-slate-600',
      negative: 'bg-red-100 text-red-800'
    };
    return colors[sentiment] || colors.neutral;
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? `${contact.first_name} ${contact.last_name}` : null;
  };

  if (interactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">No interactions yet</h3>
          <p className="text-slate-600">Log your first interaction to start tracking engagement</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {interactions.map((interaction, index) => {
        const Icon = getInteractionIcon(interaction.type);
        const contactName = getContactName(interaction.contact_id);
        
        return (
          <Card key={interaction.id} className="relative">
            {index < interactions.length - 1 && (
              <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-slate-200 -mb-4" />
            )}
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  interaction.type.includes('email') ? 'bg-blue-50' :
                  interaction.type === 'call' ? 'bg-purple-50' :
                  interaction.type === 'meeting' ? 'bg-indigo-50' : 'bg-slate-50'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    interaction.type.includes('email') ? 'text-blue-600' :
                    interaction.type === 'call' ? 'text-purple-600' :
                    interaction.type === 'meeting' ? 'text-indigo-600' : 'text-slate-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={getTypeColor(interaction.type)}>
                          {interaction.type.replace(/_/g, ' ')}
                        </Badge>
                        {interaction.direction && (
                          <Badge variant="outline" className="text-slate-600">
                            {interaction.direction}
                          </Badge>
                        )}
                        {interaction.sentiment && (
                          <Badge className={getSentimentColor(interaction.sentiment)}>
                            {interaction.sentiment}
                          </Badge>
                        )}
                      </div>
                      {interaction.subject && (
                        <h3 className="font-semibold text-slate-900">{interaction.subject}</h3>
                      )}
                      <div className="flex items-center gap-3 text-sm text-slate-600 mt-1">
                        <span>{format(new Date(interaction.interaction_date), 'MMM d, yyyy • h:mm a')}</span>
                        {contactName && (
                          <>
                            <span>•</span>
                            <span>{contactName}</span>
                          </>
                        )}
                        {interaction.logged_by && (
                          <>
                            <span>•</span>
                            <span>Logged by {interaction.logged_by}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {interaction.content && (
                    <div className="bg-slate-50 rounded-lg p-4 mt-3">
                      <p className="text-slate-700 whitespace-pre-wrap">{interaction.content}</p>
                    </div>
                  )}
                  {interaction.gmail_link && (
                    <div className="mt-3">
                      <a
                        href={interaction.gmail_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View in Gmail
                      </a>
                    </div>
                  )}
                  {interaction.tags && interaction.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {interaction.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


