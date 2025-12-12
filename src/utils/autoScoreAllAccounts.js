/**
 * Automatically score all accounts using the primary scorecard template
 * This is called when the primary template is updated or changed
 */

import { autoScoreAccount } from './autoScoreAccount';
import { base44 } from '@/api/base44Client';

/**
 * Auto-score all accounts using the primary scorecard template
 * @param {Object} primaryTemplate - The primary/default scorecard template
 * @param {Function} onProgress - Optional callback for progress updates
 * @returns {Promise<Object>} Results with counts of scored accounts
 */
export async function autoScoreAllAccounts(primaryTemplate, onProgress = null) {
  if (!primaryTemplate || !primaryTemplate.questions || primaryTemplate.questions.length === 0) {
    console.warn('⚠️ No primary template provided or template has no questions');
    return { scored: 0, failed: 0, errors: [] };
  }

  try {
    // Fetch all accounts
    if (onProgress) onProgress('Fetching accounts...');
    const accounts = await base44.entities.Account.list();
    console.log(`📊 Auto-scoring ${accounts.length} accounts...`);

    // Fetch all estimates and jobsites
    if (onProgress) onProgress('Fetching estimates and jobsites...');
    
    // Fetch estimates and jobsites from API
    let estimates = [];
    let jobsites = [];
    
    try {
      const [estimatesResponse, jobsitesResponse] = await Promise.all([
        fetch('/api/data/estimates'),
        fetch('/api/data/jobsites')
      ]);
      
      if (estimatesResponse.ok) {
        const estimatesResult = await estimatesResponse.json();
        if (estimatesResult.success) {
          estimates = estimatesResult.data || [];
        }
      }
      
      if (jobsitesResponse.ok) {
        const jobsitesResult = await jobsitesResponse.json();
        if (jobsitesResult.success) {
          jobsites = jobsitesResult.data || [];
        }
      }
    } catch (error) {
      console.error('Error fetching estimates/jobsites:', error);
    }

    const results = {
      scored: 0,
      failed: 0,
      errors: []
    };

    // Score each account
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      
      if (onProgress) {
        onProgress(`Scoring account ${i + 1} of ${accounts.length}: ${account.name || account.id}`);
      }

      try {
        // Get estimates and jobsites for this account
        const accountEstimates = estimates.filter(est => est.account_id === account.id);
        const accountJobsites = jobsites.filter(jobsite => jobsite.account_id === account.id);

        // Auto-score the account
        const scoreData = autoScoreAccount(account, accountEstimates, accountJobsites, primaryTemplate);
        
        if (scoreData) {
          // Create or update scorecard response (marked as auto-scored primary)
          const scorecardResponse = {
            account_id: account.id,
            template_id: primaryTemplate.id,
            template_name: primaryTemplate.name,
            responses: scoreData.responses,
            section_scores: scoreData.section_scores,
            total_score: scoreData.total_score,
            normalized_score: scoreData.normalized_score,
            is_pass: scoreData.is_pass,
            scorecard_date: new Date().toISOString().split('T')[0],
            completed_by: 'system-auto',
            completed_date: new Date().toISOString(),
            scorecard_type: 'auto', // Mark as auto-scored primary ICP
            is_primary: true // Mark as primary scorecard
          };

          // Check if scorecard response already exists for this account and template
          const existingResponses = await base44.entities.ScorecardResponse.filter({
            account_id: account.id,
            template_id: primaryTemplate.id
          });

          if (existingResponses && existingResponses.length > 0) {
            // Update the most recent one (if update method exists)
            const mostRecent = existingResponses.sort((a, b) => {
              const dateA = new Date(a.completed_date || a.scorecard_date || 0);
              const dateB = new Date(b.completed_date || b.scorecard_date || 0);
              return dateB - dateA;
            })[0];
            
            // Try to update, otherwise create new
            if (base44.entities.ScorecardResponse.update) {
              await base44.entities.ScorecardResponse.update(mostRecent.id, scorecardResponse);
            } else {
              // If no update method, create new response
              await base44.entities.ScorecardResponse.create(scorecardResponse);
            }
          } else {
            // Create new response
            await base44.entities.ScorecardResponse.create(scorecardResponse);
          }

          // Update account with new score
          await base44.entities.Account.update(account.id, {
            organization_score: scoreData.normalized_score
          });

          results.scored++;
        } else {
          results.failed++;
          results.errors.push(`Failed to score account ${account.name || account.id}: No score data generated`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to score account ${account.name || account.id}: ${error.message}`);
        console.error(`❌ Error scoring account ${account.id}:`, error);
      }
    }

    console.log(`✅ Auto-scoring complete: ${results.scored} scored, ${results.failed} failed`);
    return results;
  } catch (error) {
    console.error('❌ Error in autoScoreAllAccounts:', error);
    throw error;
  }
}

