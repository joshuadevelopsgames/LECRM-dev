# Scorecard Data Mapping Guide

## Overview

The scorecard system automatically maps account data to scorecard questions. This guide explains how to add mappings for new scorecards.

## How It Works

1. **Mapping Rules**: Defined in `/src/utils/scorecardMappings.js`
2. **Auto-Scoring**: Uses these rules to automatically answer questions based on account data
3. **Extensible**: Add new rules for new scorecards without modifying core logic

## Adding Mappings for New Scorecards

### Step 1: Understand the Question

Identify what data you need to answer the question:
- **Account fields**: `account.city`, `account.state`, `account.tags`, `account.account_type`, etc.
- **Estimates**: `estimates` array with `status`, `project_name`, `total_price`, etc.
- **Jobsites**: `jobsites` array with location, size, etc.

### Step 2: Create a Mapping Rule

Add a new entry to the `mappingRules` array in `/src/utils/scorecardMappings.js`:

```javascript
{
  question_keywords: ['keyword1', 'keyword2'], // Keywords that appear in question text
  data_field: 'account', // Which data source: 'account', 'estimates', 'jobsites', 'contacts'
  mapping_function: (account, estimates, jobsites) => {
    // Your logic here
    // Return: { answer: number, answerText: string }
    
    // Example: Check if account has a specific tag
    const tags = Array.isArray(account.tags) 
      ? account.tags.join(' ').toLowerCase()
      : (account.tags || '').toLowerCase();
    
    if (tags.includes('enterprise')) {
      return { answer: 1, answerText: 'Yes' };
    }
    return { answer: 0, answerText: 'No' };
  }
}
```

### Step 3: Test Your Mapping

1. Create/update a scorecard template with the new question
2. Run auto-scoring on an account
3. Verify the answer is calculated correctly

## Mapping Rule Structure

### Required Fields

- **`question_keywords`** (array): Keywords that must appear in the question text (case-insensitive)
- **`data_field`** (string): Which data source the rule uses ('account', 'estimates', 'jobsites', 'contacts')
- **`mapping_function`** (function): Function that calculates the answer

### Optional Fields

- **`question_text`** (string): Exact question text match (alternative to keywords)

### Mapping Function Parameters

```javascript
mapping_function(account, estimates, jobsites)
```

- **`account`**: The account object with all account fields
- **`estimates`**: Array of estimates for this account
- **`jobsites`**: Array of jobsites for this account

### Return Value

The mapping function must return:
```javascript
{
  answer: number,        // Numeric answer (0-5 for scale_1_5, 0-1 for yes_no, etc.)
  answerText: string    // Human-readable answer text
}
```

## Common Mapping Patterns

### 1. Yes/No Based on Account Field

```javascript
{
  question_keywords: ['has feature x'],
  data_field: 'account',
  mapping_function: (account) => {
    const hasFeature = account.some_field === 'value';
    return {
      answer: hasFeature ? 1 : 0,
      answerText: hasFeature ? 'Yes' : 'No'
    };
  }
}
```

### 2. Scale (1-5) Based on Revenue

```javascript
{
  question_keywords: ['revenue tier'],
  data_field: 'revenue',
  mapping_function: (account, estimates) => {
    const totalRevenue = estimates
      .filter(est => est.status === 'won')
      .reduce((sum, est) => sum + (parseFloat(est.total_price_with_tax || est.total_price) || 0), 0);
    
    if (totalRevenue >= 500000) return { answer: 5, answerText: 'Enterprise' };
    if (totalRevenue >= 200000) return { answer: 4, answerText: 'Mid-Market' };
    if (totalRevenue >= 100000) return { answer: 3, answerText: 'SMB' };
    if (totalRevenue > 0) return { answer: 2, answerText: 'Small' };
    return { answer: 1, answerText: 'None' };
  }
}
```

### 3. Count-Based Answer

```javascript
{
  question_keywords: ['number of properties'],
  data_field: 'jobsites',
  mapping_function: (account, estimates, jobsites) => {
    const count = jobsites.length;
    if (count >= 10) return { answer: 5, answerText: '10+' };
    if (count >= 5) return { answer: 4, answerText: '5-9' };
    if (count >= 2) return { answer: 3, answerText: '2-4' };
    if (count === 1) return { answer: 2, answerText: '1' };
    return { answer: 1, answerText: '0' };
  }
}
```

### 4. Text Search in Estimates

```javascript
{
  question_keywords: ['has service type'],
  data_field: 'estimates',
  mapping_function: (account, estimates) => {
    const hasService = estimates.some(est => {
      const projectName = (est.project_name || '').toLowerCase();
      return projectName.includes('service keyword');
    });
    return {
      answer: hasService ? 1 : 0,
      answerText: hasService ? 'Yes' : 'No'
    };
  }
}
```

### 5. Location-Based Answer

```javascript
{
  question_keywords: ['in service area'],
  data_field: 'location',
  mapping_function: (account) => {
    const city = (account.city || '').toLowerCase();
    const state = (account.state || '').toLowerCase();
    
    if (city.includes('calgary') || state.includes('ab')) {
      return { answer: 1, answerText: 'Yes' };
    }
    return { answer: 0, answerText: 'No' };
  }
}
```

## Available Account Data Fields

### Account Object
- `account.id`, `account.name`
- `account.account_type`, `account.status`
- `account.city`, `account.state`, `account.address_1`, `account.postal_code`
- `account.tags` (array or string)
- `account.notes`
- `account.annual_revenue`
- `account.revenue_segment`
- `account.organization_score`
- And more...

### Estimates Array
Each estimate has:
- `estimate.status` ('won', 'lost', 'pending', etc.)
- `estimate.project_name`
- `estimate.total_price`, `estimate.total_price_with_tax`
- `estimate.account_id`
- And more...

### Jobsites Array
Each jobsite has:
- `jobsite.name`
- `jobsite.address_1`, `jobsite.city`, `jobsite.state`
- `jobsite.account_id`
- And more...

## Tips

1. **Use Keywords**: Match questions by keywords rather than exact text for flexibility
2. **Handle Missing Data**: Always check if fields exist before accessing them
3. **Normalize Text**: Use `.toLowerCase()` for case-insensitive matching
4. **Log Unmapped Questions**: The system logs warnings for questions without mappings
5. **Test Edge Cases**: Test with accounts that have missing or unusual data

## Example: Adding a New Mapping

Let's say you want to add a question: "Is this an Enterprise account?"

1. **Add the mapping rule**:

```javascript
{
  question_keywords: ['enterprise account', 'is enterprise'],
  data_field: 'account',
  mapping_function: (account) => {
    const segment = (account.revenue_segment || '').toLowerCase();
    const revenue = account.annual_revenue || 0;
    
    if (segment === 'enterprise' || revenue >= 2000000) {
      return { answer: 1, answerText: 'Yes' };
    }
    return { answer: 0, answerText: 'No' };
  }
}
```

2. **The system will automatically**:
   - Match any question containing "enterprise account" or "is enterprise"
   - Use this rule to calculate the answer
   - Apply it when auto-scoring accounts

## Debugging

If a question isn't being mapped correctly:

1. Check the browser console for warnings: `⚠️ No mapping rule found for question: "..."`
2. Verify your keywords match the question text (case-insensitive)
3. Test your mapping function with sample data
4. Check that the data fields you're using actually exist in the account/estimates/jobsites

## Need Help?

- Check existing mappings in `/src/utils/scorecardMappings.js` for examples
- Review the account schema in `SUPABASE_SCHEMA.sql` to see available fields
- Test your mapping with the browser console

