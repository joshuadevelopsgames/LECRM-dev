import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import {
  Plus,
  Search,
  Users,
  Mail,
  Phone,
  Linkedin,
  Building2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TutorialTooltip from '../components/TutorialTooltip';

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => base44.entities.Contact.list()
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => base44.entities.Account.list()
  });

  const createContactMutation = useMutation({
    mutationFn: (data) => base44.entities.Contact.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setIsDialogOpen(false);
    }
  });

  const [newContact, setNewContact] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    title: '',
    account_id: '',
    account_name: '',
    role: 'user',
    preferences: '',
    linkedin_url: '',
    status: 'active'
  });

  const handleCreateContact = () => {
    const selectedAccount = accounts.find(a => a.id === newContact.account_id);
    createContactMutation.mutate({
      ...newContact,
      account_name: selectedAccount?.name || ''
    });
  };

  // Filter contacts
  let filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.account_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || contact.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    const colors = {
      decision_maker: 'bg-purple-100 text-purple-800 border-purple-200',
      influencer: 'bg-blue-100 text-blue-800 border-blue-200',
      champion: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      user: 'bg-slate-100 text-slate-800 border-slate-200'
    };
    return colors[role] || colors.user;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <TutorialTooltip
        tip="This is your Contacts page. View all contacts across all accounts, search by name, and filter by role. Each contact belongs to an account and includes contact information and preferences."
        step={2}
        position="bottom"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Contacts</h1>
            <p className="text-slate-600 mt-1">{filteredContacts.length} total contacts</p>
          </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 hover:bg-slate-800">
              <Plus className="w-4 h-4 mr-2" />
              New Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Contact</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name *</Label>
                  <Input
                    value={newContact.first_name}
                    onChange={(e) => setNewContact({ ...newContact, first_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Last Name *</Label>
                  <Input
                    value={newContact.last_name}
                    onChange={(e) => setNewContact({ ...newContact, last_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Job Title</Label>
                  <Input
                    value={newContact.title}
                    onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select
                    value={newContact.role}
                    onValueChange={(value) => setNewContact({ ...newContact, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="decision_maker">Decision Maker</SelectItem>
                      <SelectItem value="influencer">Influencer</SelectItem>
                      <SelectItem value="champion">Champion</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Account *</Label>
                  <Select
                    value={newContact.account_id}
                    onValueChange={(value) => setNewContact({ ...newContact, account_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map(account => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>LinkedIn URL</Label>
                  <Input
                    value={newContact.linkedin_url}
                    onChange={(e) => setNewContact({ ...newContact, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div className="col-span-2">
                  <Label>Preferences & Notes</Label>
                  <Textarea
                    value={newContact.preferences}
                    onChange={(e) => setNewContact({ ...newContact, preferences: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateContact}
                  disabled={!newContact.first_name || !newContact.last_name || !newContact.email || !newContact.account_id}
                >
                  Create Contact
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      </TutorialTooltip>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="decision_maker">Decision Maker</SelectItem>
              <SelectItem value="influencer">Influencer</SelectItem>
              <SelectItem value="champion">Champion</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="space-y-4">
                {/* Header */}
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">
                    {contact.first_name} {contact.last_name}
                  </h3>
                  {contact.title && (
                    <p className="text-sm text-slate-600 mt-1">{contact.title}</p>
                  )}
                </div>

                {/* Account Link */}
                {contact.account_id && (
                  <Link 
                    to={createPageUrl(`AccountDetail?id=${contact.account_id}`)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Building2 className="w-4 h-4" />
                    {contact.account_name || 'View Account'}
                  </Link>
                )}

                {/* Role Badge */}
                <Badge variant="outline" className={getRoleColor(contact.role)}>
                  {contact.role.replace('_', ' ')}
                </Badge>

                {/* Contact Info */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <a href={`mailto:${contact.email}`} className="hover:text-blue-600 truncate">
                      {contact.email}
                    </a>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <a href={`tel:${contact.phone}`} className="hover:text-blue-600">
                        {contact.phone}
                      </a>
                    </div>
                  )}
                  {contact.linkedin_url && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Linkedin className="w-4 h-4 flex-shrink-0" />
                      <a 
                        href={contact.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 truncate"
                      >
                        LinkedIn
                      </a>
                    </div>
                  )}
                </div>

                {/* Preferences */}
                {contact.preferences && (
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Notes:</p>
                    <p className="text-sm text-slate-700 line-clamp-2">{contact.preferences}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">No contacts found</h3>
          <p className="text-slate-600 mb-4">
            {searchTerm || filterRole !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first contact to get started'}
          </p>
        </Card>
      )}
    </div>
  );
}

