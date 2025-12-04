import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { parseLmnCsv, validateImportData, previewLmnCsv } from '@/utils/lmnCsvParser';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Upload,
  FileText,
  Users,
  Building2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  X
} from 'lucide-react';

export default function ImportLeadsDialog({ open, onClose }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [validation, setValidation] = useState(null);
  const [importStatus, setImportStatus] = useState('idle'); // idle, parsing, validating, importing, success, error
  const [importResults, setImportResults] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const queryClient = useQueryClient();

  // Process file (used by both file input and drag-drop)
  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    // Check file extension
    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a CSV file (.csv extension required)');
      return;
    }

    // Check file type
    if (selectedFile.type && !selectedFile.type.includes('csv') && !selectedFile.type.includes('text')) {
      setError('Please select a valid CSV file');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setImportStatus('parsing');

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const previewData = previewLmnCsv(text, 5);
        setPreview(previewData);
        
        const parsed = parseLmnCsv(text);
        
        if (parsed.stats.error) {
          setError(parsed.stats.error);
          setImportStatus('error');
          return;
        }
        
        setParsedData(parsed);
        const validationResults = validateImportData(parsed.accounts, parsed.contacts);
        setValidation(validationResults);
        setImportStatus('validating');
      } catch (err) {
        setError(`Error parsing CSV: ${err.message}`);
        setImportStatus('error');
      }
    };
    
    reader.onerror = () => {
      setError('Error reading file');
      setImportStatus('error');
    };
    
    reader.readAsText(selectedFile);
  };

  // Handle file selection from input
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    processFile(selectedFile);
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  // Import data
  const handleImport = async () => {
    if (!parsedData || !validation?.isValid) return;

    setImportStatus('importing');
    setError(null);

    try {
      const results = {
        accountsCreated: 0,
        contactsCreated: 0,
        accountsFailed: 0,
        contactsFailed: 0,
        errors: []
      };

      for (const account of parsedData.accounts) {
        try {
          await base44.entities.Account.create(account);
          results.accountsCreated++;
        } catch (err) {
          results.accountsFailed++;
          results.errors.push(`Failed to create account "${account.name}": ${err.message}`);
        }
      }

      for (const contact of parsedData.contacts) {
        try {
          await base44.entities.Contact.create(contact);
          results.contactsCreated++;
        } catch (err) {
          results.contactsFailed++;
          results.errors.push(`Failed to create contact "${contact.first_name} ${contact.last_name}": ${err.message}`);
        }
      }

      setImportResults(results);
      setImportStatus('success');

      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });

    } catch (err) {
      setError(`Import failed: ${err.message}`);
      setImportStatus('error');
    }
  };

  // Reset form
  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setParsedData(null);
    setValidation(null);
    setImportStatus('idle');
    setImportResults(null);
    setError(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Import Leads from LMN</DialogTitle>
          <p className="text-slate-600 text-sm mt-1">
            Upload a CSV file from golmn.com to create accounts and contacts
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Upload Section */}
          {importStatus === 'idle' && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center text-center space-y-4 py-8 px-6 border-2 border-dashed rounded-lg transition-colors ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-300 bg-slate-50'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                isDragging ? 'bg-blue-200' : 'bg-blue-100'
              }`}>
                <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-700' : 'text-blue-600'}`} />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {isDragging ? 'Drop your CSV file here' : 'Upload LMN Leads CSV'}
                </h3>
                <p className="text-slate-600 text-sm">
                  {isDragging 
                    ? 'Release to upload' 
                    : 'Drag and drop a CSV file or click to browse'}
                </p>
              </div>

              <input
                type="file"
                accept=".csv,text/csv,application/csv,text/comma-separated-values"
                onChange={handleFileChange}
                className="hidden"
                id="csv-file-dialog-input"
              />
              
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <label htmlFor="csv-file-dialog-input" className="cursor-pointer">
                  <FileText className="w-4 h-4 mr-2" />
                  Choose CSV File
                </label>
              </Button>

              <div className="text-xs text-slate-500 bg-white p-3 rounded border border-slate-200 w-full">
                <p className="font-semibold mb-1">Expected columns:</p>
                <p>Lead Name, First Name, Last Name, Position, Email 1, Email 2, Phone 1, Phone 2, etc.</p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-900">Error</p>
                  <p className="text-red-800 text-sm mt-1">{error}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          )}

          {/* Preview & Validation */}
          {(importStatus === 'parsing' || importStatus === 'validating') && preview && parsedData && (
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-slate-600">Total Rows</p>
                      <p className="text-xl font-bold text-slate-900">{parsedData.stats.totalRows}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-xs text-slate-600">Accounts</p>
                      <p className="text-xl font-bold text-slate-900">{parsedData.stats.accountsCreated}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-slate-600">Contacts</p>
                      <p className="text-xl font-bold text-slate-900">{parsedData.stats.contactsCreated}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Validation */}
              {validation && (
                <Card className="p-4">
                  {validation.isValid ? (
                    <div className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium text-sm">Data is valid and ready to import!</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium text-sm">Please fix errors:</span>
                      </div>
                      {validation.errors && (
                        <ul className="list-disc list-inside space-y-1 text-red-800 text-xs ml-7">
                          {validation.errors.map((err, idx) => (
                            <li key={idx}>{err}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {validation.warnings && validation.warnings.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="font-medium text-amber-800 text-sm mb-1">Warnings:</p>
                      <ul className="list-disc list-inside space-y-1 text-amber-700 text-xs ml-7">
                        {validation.warnings.slice(0, 5).map((warn, idx) => (
                          <li key={idx}>{warn}</li>
                        ))}
                        {validation.warnings.length > 5 && (
                          <li className="text-amber-600">...and {validation.warnings.length - 5} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={handleReset}>
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={!validation?.isValid || importStatus === 'importing'}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {importStatus === 'importing' ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Import {parsedData.stats.accountsCreated} Accounts & {parsedData.stats.contactsCreated} Contacts
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Success */}
          {importStatus === 'success' && importResults && (
            <div className="flex flex-col items-center text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  Import Successful!
                </h3>
                <p className="text-slate-600 text-sm">
                  Your leads have been imported into LECRM
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <p className="text-2xl font-bold text-emerald-600">{importResults.accountsCreated}</p>
                  <p className="text-xs text-slate-600 mt-1">Accounts Created</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{importResults.contactsCreated}</p>
                  <p className="text-xs text-slate-600 mt-1">Contacts Created</p>
                </div>
              </div>

              <Button onClick={handleClose} className="bg-slate-900 mt-4">
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
