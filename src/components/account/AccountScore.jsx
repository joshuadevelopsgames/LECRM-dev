import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Award, Plus, Check, X, Download } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { exportAndDownloadScorecard } from '../../utils/exportToCSV';

export default function AccountScore({ accountId, scorecards, currentScore, accountName }) {
  const { data: templates = [] } = useQuery({
    queryKey: ['scorecard-templates'],
    queryFn: () => base44.entities.ScorecardTemplate.list()
  });
  const activeTemplates = templates.filter(t => t.is_active);

  return (
    <div className="space-y-6">
      {/* Current Score */}
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Current Organization Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-6xl font-bold text-emerald-600">
              {currentScore !== null && currentScore !== undefined ? currentScore : '—'}
            </div>
            <div className="text-slate-600">
              <p className="text-sm">Out of 100</p>
              <p className="text-xs mt-1">
                {scorecards.length > 0 
                  ? `Last updated ${format(new Date(scorecards[0].completed_date), 'MMM d, yyyy')}`
                  : 'No scorecards completed yet'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Available Templates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Available Scorecards</h3>
          <Link to={createPageUrl('Scoring')}>
            <Button variant="outline" size="sm">
              Manage Templates
            </Button>
          </Link>
        </div>
        
        {activeTemplates.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Award className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900 mb-1">No scoring templates</h3>
              <p className="text-slate-600 mb-4">Create a scorecard template to start scoring accounts</p>
              <Link to={createPageUrl('Scoring')}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTemplates.map(template => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">{template.name}</h4>
                      <p className="text-sm text-slate-600 mt-1">{template.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      {template.questions?.length || 0} questions
                    </span>
                    <Link to={createPageUrl(`TakeScorecard?accountId=${accountId}&templateId=${template.id}`)}>
                      <Button size="sm">
                        Complete Scorecard
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Scorecard History */}
      {scorecards.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Scorecard History</h3>
          <div className="space-y-3">
            {scorecards.map(scorecard => {
              const isPass = scorecard.is_pass || (scorecard.normalized_score >= 70); // Default threshold
              const scorecardDate = scorecard.scorecard_date 
                ? format(new Date(scorecard.scorecard_date), 'MMM d, yyyy')
                : format(new Date(scorecard.completed_date), 'MMM d, yyyy');
              
              const handleExport = () => {
                // Find the template
                const template = templates.find(t => t.name === scorecard.template_name);
                if (template) {
                  exportAndDownloadScorecard(scorecard, template, { name: accountName || 'Account' });
                }
              };
              
              return (
                <Card key={scorecard.id} className={isPass ? 'border-emerald-200' : 'border-red-200'}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-slate-900">{scorecard.template_name}</h4>
                          <Badge 
                            className={isPass 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                              : 'bg-red-100 text-red-800 border-red-200'
                            }
                          >
                            {isPass ? (
                              <>
                                <Check className="w-3 h-3 mr-1 inline" />
                                PASS
                              </>
                            ) : (
                              <>
                                <X className="w-3 h-3 mr-1 inline" />
                                FAIL
                              </>
                            )}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                          Date: {scorecardDate} • Completed by {scorecard.completed_by}
                        </p>
                        {scorecard.section_scores && Object.keys(scorecard.section_scores).length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {Object.entries(scorecard.section_scores).map(([section, score]) => (
                              <Badge key={section} variant="outline" className="text-xs">
                                {section}: {score}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${isPass ? 'text-emerald-600' : 'text-red-600'}`}>
                            {scorecard.normalized_score}
                          </div>
                          <div className="text-xs text-slate-500">out of 100</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleExport}
                          title="Export to CSV"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

