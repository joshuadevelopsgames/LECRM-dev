/**
 * Merge data from both LMN CSV exports
 * Combines Contacts Export (IDs, Tags, Archived) with Leads List (Position, Do Not fields)
 * Also integrates Estimates List and Jobsite Export to calculate revenue and scores
 */

/**
 * Merge contact data from all CSVs
 */
export function mergeContactData(contactsExportData, leadsListData, estimatesData, jobsitesData) {
  const { accounts, contacts: baseContacts } = contactsExportData;
  const { contactsData: supplementalData } = leadsListData;
  const estimates = estimatesData?.estimates || [];
  const jobsites = jobsitesData?.jobsites || [];
  
  // Create lookup map for supplemental data (from Leads List)
  const supplementalMap = new Map();
  
  supplementalData.forEach(supp => {
    const key = supp.match_key;
    if (key) {
      supplementalMap.set(key, supp);
    }
    
    // Also try email-only match
    if (supp.email_1) {
      supplementalMap.set(supp.email_1.toLowerCase(), supp);
    }
  });

  // Merge data into contacts
  const mergedContacts = baseContacts.map(contact => {
    // Try to find matching supplemental data
    const matchKey = createMatchKey(
      contact.first_name, 
      contact.last_name, 
      contact.email_1, 
      contact.email_2
    );
    
    let supplemental = supplementalMap.get(matchKey);
    
    // Try email-only match if not found
    if (!supplemental && contact.email_1) {
      supplemental = supplementalMap.get(contact.email_1.toLowerCase());
    }
    if (!supplemental && contact.email) {
      supplemental = supplementalMap.get(contact.email.toLowerCase());
    }

    // Merge supplemental data if found
    if (supplemental) {
      const position = supplemental.position || contact.position || '';
      
      return {
        ...contact,
        position: position,
        title: position, // Use position as title
        role: contact.role || determineRoleFromPosition(position),
        do_not_email: supplemental.do_not_email !== null ? supplemental.do_not_email : false,
        do_not_mail: supplemental.do_not_mail !== null ? supplemental.do_not_mail : false,
        do_not_call: supplemental.do_not_call !== null ? supplemental.do_not_call : false,
        referral_source: supplemental.referral_source || '',
        // Merge notes
        notes: mergeNotes(contact.notes, supplemental.notes_supplement),
        data_source: 'merged',
        matched: true
      };
    }

    // No match found - use base data only
    return {
      ...contact,
      position: '',
      title: contact.title || '',
      role: contact.role || 'user',
      do_not_email: false,
      do_not_mail: false,
      do_not_call: false,
      data_source: 'contacts_export_only',
      matched: false
    };
  });

  // Calculate stats
  const matchedCount = mergedContacts.filter(c => c.matched).length;
  const unmatchedCount = mergedContacts.filter(c => !c.matched).length;

  // Create contact ID to account ID mapping
  const contactToAccountMap = new Map();
  mergedContacts.forEach(contact => {
    if (contact.lmn_contact_id && contact.account_id) {
      contactToAccountMap.set(contact.lmn_contact_id, contact.account_id);
    }
  });

  // Create account name to account ID mapping (for fallback matching)
  const accountNameToIdMap = new Map();
  accounts.forEach((account, crmId) => {
    if (account.name) {
      accountNameToIdMap.set(account.name.toLowerCase().trim(), account.id);
    }
  });

  // Create account ID to account object mapping for easy updates
  const accountsArray = Array.from(accounts.values());
  const accountMap = new Map();
  accountsArray.forEach(account => {
    accountMap.set(account.id, account);
  });

  // Calculate revenue and scores for each account
  accountsArray.forEach(account => {
    // Find all estimates for this account (via contacts)
    const accountContactIds = mergedContacts
      .filter(c => c.account_id === account.id)
      .map(c => c.lmn_contact_id)
      .filter(Boolean);

    // Match estimates by contact ID (primary method)
    let accountEstimates = estimates.filter(est => 
      est.lmn_contact_id && accountContactIds.includes(est.lmn_contact_id)
    );

    // Fallback: Match estimates by contact name matching account name
    if (accountEstimates.length === 0 && account.name) {
      const accountNameLower = account.name.toLowerCase().trim();
      accountEstimates = estimates.filter(est => {
        const estContactName = est.contact_name?.toLowerCase().trim();
        return estContactName === accountNameLower;
      });
    }

    // Also try matching via CRM tags if available
    if (accountEstimates.length === 0 && account.lmn_crm_id) {
      accountEstimates = estimates.filter(est => {
        const crmTags = est.crm_tags?.toLowerCase() || '';
        return crmTags.includes(account.lmn_crm_id.toLowerCase());
      });
    }

    // Calculate revenue from won estimates
    const wonEstimates = accountEstimates.filter(est => est.status === 'won');
    const totalRevenue = wonEstimates.reduce((sum, est) => {
      // Use total_price_with_tax if available, otherwise total_price
      const revenue = est.total_price_with_tax || est.total_price || 0;
      return sum + revenue;
    }, 0);

    // Count jobsites for this account
    // Match jobsites by contact ID (primary method)
    let accountJobsites = jobsites.filter(jobsite => 
      jobsite.lmn_contact_id && accountContactIds.includes(jobsite.lmn_contact_id)
    );

    // Fallback: Match jobsites by contact name matching account name
    if (accountJobsites.length === 0 && account.name) {
      const accountNameLower = account.name.toLowerCase().trim();
      accountJobsites = jobsites.filter(jobsite => {
        const jobsiteContactName = jobsite.contact_name?.toLowerCase().trim();
        return jobsiteContactName === accountNameLower;
      });
    }

    // Calculate account score based on revenue, estimates, and jobsites
    const score = calculateAccountScore({
      revenue: totalRevenue,
      totalEstimates: accountEstimates.length,
      wonEstimates: wonEstimates.length,
      lostEstimates: accountEstimates.filter(est => est.status === 'lost').length,
      jobsitesCount: accountJobsites.length
    });

    // Update account with calculated values
    account.annual_revenue = totalRevenue > 0 ? totalRevenue : null;
    account.organization_score = score;
  });

  return {
    accounts: accountsArray,
    contacts: mergedContacts,
    estimates: estimates,
    jobsites: jobsites,
    stats: {
      totalAccounts: accounts.size,
      totalContacts: mergedContacts.length,
      matchedContacts: matchedCount,
      unmatchedContacts: unmatchedCount,
      matchRate: mergedContacts.length > 0 
        ? Math.round((matchedCount / mergedContacts.length) * 100) 
        : 0
    }
  };
}

/**
 * Calculate account score based on revenue, estimates, and jobsites
 * Returns a score from 0-100
 */
function calculateAccountScore({ revenue, totalEstimates, wonEstimates, lostEstimates, jobsitesCount }) {
  let score = 0;

  // Revenue component (0-50 points)
  // Scale: $0 = 0, $100k = 25, $500k+ = 50
  if (revenue > 0) {
    if (revenue >= 500000) {
      score += 50;
    } else if (revenue >= 100000) {
      score += 25 + ((revenue - 100000) / 400000) * 25; // 25-50 range
    } else {
      score += (revenue / 100000) * 25; // 0-25 range
    }
  }

  // Win rate component (0-30 points)
  // Higher win rate = more points
  const decidedEstimates = wonEstimates + lostEstimates;
  if (decidedEstimates > 0) {
    const winRate = wonEstimates / decidedEstimates;
    score += winRate * 30; // 0-30 points based on win rate
  }

  // Activity component (0-20 points)
  // More estimates and jobsites = more activity = higher score
  const activityScore = Math.min(
    (totalEstimates * 2) + (jobsitesCount * 3),
    20
  );
  score += activityScore;

  // Round to nearest integer and cap at 100
  return Math.min(Math.round(score), 100);
}

/**
 * Create match key for contact matching
 */
function createMatchKey(firstName, lastName, email1, email2) {
  const parts = [];
  
  if (firstName) parts.push(firstName.toLowerCase().trim());
  if (lastName) parts.push(lastName.toLowerCase().trim());
  if (email1) parts.push(email1.toLowerCase().trim());
  
  return parts.join('|');
}

/**
 * Merge notes from both sources
 */
function mergeNotes(notes1, notes2) {
  const parts = [];
  
  if (notes1) parts.push(notes1);
  if (notes2 && notes2 !== notes1) parts.push(notes2);
  
  return parts.join('\n\n');
}

/**
 * Determine role from position/title
 */
function determineRoleFromPosition(position) {
  if (!position) return 'user';
  
  const normalized = position.toLowerCase();
  
  // Decision makers
  if (normalized.includes('owner') || normalized.includes('ceo') || 
      normalized.includes('president') || normalized.includes('cfo') ||
      normalized.includes('coo') || normalized.includes('founder')) {
    return 'decision_maker';
  }
  
  // Influencers
  if (normalized.includes('manager') || normalized.includes('director') || 
      normalized.includes('head of') || normalized.includes('vp') ||
      normalized.includes('vice president')) {
    return 'influencer';
  }
  
  // Default
  return 'user';
}



