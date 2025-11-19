# Complete User Guide: CRM System

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Core Concepts](#core-concepts)
4. [Features & How to Use Them](#features--how-to-use-them)
5. [Data Flow: Google Sheets Integration](#data-flow-google-sheets-integration)
6. [Workflows & Best Practices](#workflows--best-practices)
7. [Tips & Tricks](#tips--tricks)

---

## Overview

This CRM system helps you manage customer relationships, track interactions, automate follow-ups, and score potential accounts. It integrates with your Google Sheet to keep data in sync.

### Key Capabilities
- **Account Management**: Track companies/organizations with scores, revenue segments, and status
- **Contact Management**: Manage contacts linked to accounts with roles and preferences
- **Interaction Tracking**: Log emails, calls, meetings, notes, and LinkedIn messages
- **Task Management**: Create and manage tasks with priorities and due dates
- **Sequence Automation**: Create multi-step outreach sequences for different account types
- **Scoring System**: Generate organization scores (0-100) using weighted questionnaires
- **Sales Insights**: Track pain points, opportunities, and buying motivations
- **Research Notes**: Store research findings and source URLs

---

## Getting Started

### First Time Setup

1. **Make Your Google Sheet Public** (if not already)
   - Open your Google Sheet
   - Click "Share" → "Change to anyone with the link"
   - Set permission to "Viewer"
   - The CRM will automatically read from it

2. **Access the CRM**
   - Open `http://localhost:5173` (or your deployment URL)
   - You'll see the Dashboard

3. **Familiarize Yourself with Navigation**
   - **Dashboard** (`/`) - Overview and alerts
   - **Accounts** (`/accounts`) - All accounts
   - **Contacts** (`/contacts`) - All contacts
   - **Tasks** (`/tasks`) - All tasks
   - **Sequences** (`/sequences`) - Automation sequences
   - **Scoring** (`/scoring`) - Manage scorecard templates

---

## Core Concepts

### Accounts
An **Account** represents a company/organization you're doing business with or pursuing. Each account has:
- Basic info (name, type, status)
- Revenue segment (smb, mid-market, enterprise)
- Organization score (0-100)
- Last interaction date
- Renewal date

**Accounts are the center of your CRM** - everything else links to them.

### Contacts
**Contacts** are people within accounts. They:
- Belong to an account
- Have roles (decision maker, influencer, user, etc.)
- Include contact info (email, phone, LinkedIn)
- Track preferences and interests

### Scorecards
**Scorecards** are questionnaires that generate organization scores. They:
- Have weighted questions grouped by sections
- Calculate section sub-totals
- Determine pass/fail based on a threshold
- Track historical scores over time

### Sequences
**Sequences** automate outreach with timed steps (emails, calls, meetings). They:
- Support different cadences for different account types
- Can enroll accounts automatically
- Track step completion

---

## Features & How to Use Them

### 1. Dashboard (`/` or `/dashboard`)

**Purpose**: Get an overview of your CRM health and priorities.

**What You'll See**:
- **Stats Cards**: Active accounts, total contacts, open tasks, at-risk accounts
- **Alerts**: 
  - Neglected accounts (no interaction in 90+ days)
  - Upcoming renewals (within 30 days)
  - Overdue tasks
- **Active Sequences**: Sequences currently running

**How to Use**:
- Start your day here to see what needs attention
- Click on alerts to jump to relevant accounts/tasks
- Use stats to track progress

---

### 2. Accounts (`/accounts`)

**Purpose**: View and manage all accounts.

**What You'll See**:
- List of all accounts with key info
- Search bar (search by name)
- Filters (Type, Status, Revenue Segment)
- Sort options

**How to Use**:
1. **Search**: Type in search bar to find specific accounts
2. **Filter**: Use dropdowns to filter by type/status/segment
3. **Sort**: Click column headers to sort
4. **View Details**: Click any account to see full details
5. **Create Account**: Click "New Account" button

**Account Card Shows**:
- Account name
- Type (prospect, customer, partner)
- Status (active, inactive, archived)
- Revenue segment
- Organization score (0-100)
- Last interaction date

---

### 3. Account Detail (`/account-detail?id=X`)

**Purpose**: Deep dive into a specific account.

**What You'll See**:
- **Quick Stats**: Score, contacts count, last interaction
- **Account Info**: All account details (editable)
- **Tabs**:
  - **Interactions**: Timeline of all interactions
  - **Contacts**: People at this account
  - **Scoring**: Organization scores and history
  - **Sales Insights**: Pain points, opportunities, risks
  - **Research Notes**: Research findings and sources

**How to Use Each Tab**:

#### Interactions Tab
- View chronological timeline of emails, calls, meetings
- **Add Interaction**: Click "Log Interaction" button
- Filter by type (email, call, meeting, note)
- See sentiment (positive, neutral, negative)

#### Contacts Tab
- View all contacts at this account
- **Add Contact**: Click "Add Contact" button
- See roles and preferences
- Quick access to email/phone/LinkedIn

#### Scoring Tab
- **Current Score**: Prominently displayed (works for both prospects and customers)
- **Available Templates**: List of scorecard templates
- **Complete Scorecard**: Click "Complete Scorecard" to fill out
  - **For Prospects**: Scorecards help evaluate fit before becoming a customer (no revenue required)
  - **For Customers**: Scorecards track ongoing account health (with revenue data)
- **History**: All historical scorecards with:
  - Date
  - Score
  - Pass/Fail status
  - Download CSV button
- **Note**: Both prospects and customers can have scorecards. The only difference is prospects won't have revenue data yet.

#### Sales Insights Tab
- View insights by type (need, pain_point, opportunity, risk)
- **Add Insight**: Click "Add Insight" button
- Filter by insight type
- See tags for categorization
- Link to related interactions

#### Research Notes Tab
- View research findings with dates
- **Add Note**: Click "Add Research Note" button
- Filter by note type
- Click source URLs to open
- See who recorded each note

**Quick Actions**:
- **Edit Account**: Click "Edit" button at top
- **Log Interaction**: Quick button to add interaction
- **Complete Scorecard**: Quick access to scoring

---

### 4. Contacts (`/contacts`)

**Purpose**: View all contacts across all accounts.

**What You'll See**:
- List of all contacts
- Search bar
- Filter by role

**How to Use**:
1. **Search**: Find contacts by name or email
2. **Filter**: Show only specific roles (e.g., decision makers)
3. **View Account**: Click account name to go to account detail
4. **Create Contact**: Click "New Contact" button

---

### 5. Tasks (`/tasks`)

**Purpose**: Manage your to-do list.

**What You'll See**:
- List of all tasks
- Search bar
- Filters (Status, Priority)
- Color-coded priority badges

**Task States**:
- **To Do** (gray)
- **In Progress** (blue)
- **Completed** (green)
- **Blocked** (red)

**Task Priorities**:
- **Low** (gray)
- **Medium** (yellow)
- **High** (orange)
- **Urgent** (red)

**How to Use**:
1. **Create Task**: Click "New Task" button
2. **Quick Status Change**: Click status badge to cycle through states
3. **View Details**: Click task to see/edit full details
4. **Filter**: Use filters to see only what you need (e.g., urgent tasks)

**Best Practices**:
- Link tasks to accounts for context
- Use priorities to focus on what matters
- Set due dates for time-sensitive tasks
- Update status regularly

---

### 6. Sequences (`/sequences`)

**Purpose**: Automate outreach with timed steps.

**What You'll See**:
- List of all sequences
- Sequence details (name, client type, steps)
- Enrollments (which accounts are in sequence)

**How to Use**:

1. **Create Sequence**:
   - Click "New Sequence" button
   - Enter name and description
   - Select client type (prospect, high-value, renewal)
   - Add steps:
     - Step type (email, call, LinkedIn, meeting)
     - Delay (days from previous step)
     - Instructions/template
   - Set as active/inactive

2. **Enroll Account**:
   - Go to account detail
   - Click "Enroll in Sequence"
   - Select sequence
   - Account will receive steps on schedule

3. **Monitor**:
   - View active enrollments
   - See step completion status
   - Track next actions

**Sequence Types**:
- **Prospect**: Initial outreach cadence
- **High-Value**: VIP customer touchpoints
- **Renewal**: Renewal-focused sequences

**Best Practices**:
- Start with 3-5 steps
- Space steps 3-7 days apart
- Personalize templates per account type
- Monitor and adjust based on response rates

---

### 7. Scoring (`/scoring`)

**Purpose**: Create and manage scorecard templates.

**What You'll See**:
- List of scorecard templates
- Template details (questions, weights, sections)

**How to Use**:

1. **Create Template**:
   - Click "New Template" button
   - Enter name and description
   - Set pass threshold (e.g., 70 out of 100)
   - Add questions:
     - Question text
     - Answer type (Yes/No, Scale 1-5, Text, etc.)
     - Weight (points for answer)
     - Category (for grouping)
     - Section (e.g., "Corporate Demographics")
   - Save template

2. **Edit Template**:
   - Click on template to edit
   - Add/remove/reorder questions
   - Adjust weights
   - Update pass threshold

3. **Use Template**:
   - Go to Account Detail → Scoring tab
   - Click "Complete Scorecard" on template
   - Fill out questions
   - See section sub-totals
   - Get total score and pass/fail
   - Export to CSV or save

**Question Types**:
- **Yes/No**: Simple yes/no answer (e.g., 1 for yes, 0 for no)
- **Scale 1-5**: Rating scale (e.g., 1-5 points)
- **Text**: Free text (scored manually or via rules)
- **Multiple Choice**: Select one option (each option has points)

**Best Practices**:
- Group related questions into sections
- Use consistent weight ranges
- Set realistic pass thresholds
- Test templates before using

---

### 8. Take Scorecard (`/take-scorecard?accountId=X&templateId=Y`)

**Purpose**: Complete a scorecard for an account.

**What You'll See**:
- Date input (when scorecard was completed)
- Questions grouped by section
- Section headers and sub-totals
- Total score calculation
- Pass/Fail status
- Export to CSV button

**How to Use**:
1. **Select Date**: Choose when scorecard was completed
2. **Answer Questions**: 
   - Answer each question based on account
   - See points update as you answer
3. **Review Sections**: 
   - See sub-totals for each section
   - Identify weak areas
4. **Check Score**:
   - Total score appears at bottom
   - Normalized score (out of 100)
   - Pass/Fail status (green/red)
5. **Export or Save**:
   - Click "Export to CSV" to download
   - Click "Submit" to save to CRM
   - CSV matches Google Sheet format

**Score Calculation**:
- Each question has a weight (points)
- Answer determines points earned
- Section sub-totals sum questions in section
- Total score sums all section sub-totals
- Normalized score = (total / max possible) × 100
- Pass if normalized score ≥ threshold

---

## Data Flow: Google Sheets Integration

### How Data Flows

1. **Google Sheet** (Source of Truth)
   - You manage data in Google Sheet
   - Sheet has tabs: Scorecard, Company Contacts, Sales Insights, Research Notes, Contact Cadence, Lookup Legend

2. **CRM System** (Reads from Sheet)
   - CRM automatically fetches data from your public sheet
   - Data is parsed and converted to CRM entities
   - Cached for 5 minutes (then refreshes)

3. **CRM UI** (Displays Data)
   - You interact with data in CRM
   - View, filter, search, organize
   - Complete scorecards, add insights, etc.

### Sheet Tab Structure

#### Scorecard Tab
- **Format**: Date rows → Questions → Sections → Sub-totals
- **Example**:
  ```
  Date: | January 1, 2025 | 90 | PASS
  Corporate Demographic Information
  Client Operations Region | Calgary/Surrounding | 2
  Sub-total | 3
  ```
- **Multiple Entries**: Each dated entry becomes a historical scorecard

#### Company Contacts Tab
- **Format**: Template with columns for Contact 1, Contact 2, etc.
- **Rows**: Position, Phone, Email, Personal details, etc.
- **Currently Empty**: Fill in to see contacts in CRM

#### Sales Insights Tab
- **Format**: Matrix with Needs/Pain Points/Buying Motivations/Obstacles columns
- **Rows**: Specific items (e.g., "Consistency & Reliability")
- **Yes/No**: Only "Yes" items become insights

#### Research Notes Tab
- **Format**: Date | Person | Note
- **Simple**: One note per row

#### Contact Cadence Tab
- **Format**: Quarterly contacts + Connection Ideas
- **Rows**: Q1 contact 1, Q2 contact 1, etc.
- **Activities**: Emails, Site Visit, Coffee/Lunch, etc.

#### Lookup Legend Tab
- **Format**: Criterion | Attribute | Score
- **Example**: "Client Operations Region" | "Calgary/Surrounding" | "2"
- **Used For**: Scorecard question options and point values

### Data Sync

- **Automatic**: Data loads when you open the CRM
- **Cache**: Data cached for 5 minutes
- **Manual Refresh**: Refresh browser to reload data
- **Real-time**: Updates in Google Sheet appear after refresh (within 5 min cache window)

---

## Workflows & Best Practices

### 1. New Account Workflow

1. **Add Account** (`/accounts` → "New Account")
   - Enter basic info
   - Set type (prospect/customer)
   - Set status (active)
   - Set revenue segment

2. **Add Contacts** (Account Detail → Contacts tab)
   - Add decision maker first
   - Add other key contacts
   - Include roles and preferences

3. **Complete Scorecard** (Account Detail → Scoring tab)
   - Select template
   - Fill out questions
   - Review score
   - Export CSV (matches Google Sheet)

4. **Add Research Notes** (Account Detail → Research Notes tab)
   - Research company online
   - Add findings with source URLs
   - Note key decision makers

5. **Log Initial Interaction** (Account Detail → Interactions tab)
   - Log first call/email/meeting
   - Include notes and sentiment
   - Link to contacts involved

6. **Add Sales Insights** (Account Detail → Sales Insights tab)
   - Document pain points
   - Note opportunities
   - Track buying motivations

7. **Create Tasks** (`/tasks`)
   - Set follow-up tasks
   - Link to account
   - Set due dates

8. **Enroll in Sequence** (Account Detail)
   - Choose appropriate sequence
   - Set start date
   - Monitor progress

### 2. Quarterly Scorecard Review Workflow

1. **Identify Accounts** (`/accounts`)
   - Filter by active accounts
   - Check last scorecard date
   - Create list of accounts to review

2. **Complete Scorecards** (Account Detail → Scoring)
   - Open scorecard template
   - Review each question with current account info
   - Answer honestly based on current state
   - Note changes from last scorecard

3. **Review Trends** (Account Detail → Scoring)
   - View score history
   - See if score improved/declined
   - Identify what changed

4. **Update Account Info** (Account Detail → Edit)
   - Update organization score
   - Update last interaction date
   - Update status if needed

5. **Take Action** (Based on Score)
   - **Score Improved**: Increase engagement, upsell
   - **Score Declined**: Investigate, address concerns
   - **Score Below Threshold**: Consider if account is right fit

### 3. Weekly Account Review Workflow

1. **Start at Dashboard**
   - Check neglected accounts alert
   - Review overdue tasks
   - Note upcoming renewals

2. **Review Neglected Accounts**
   - Click on account
   - Check last interaction date
   - Review recent interactions
   - Plan next outreach

3. **Update Interactions** (Account Detail → Interactions)
   - Log all calls/emails/meetings from week
   - Update sentiment
   - Link to related contacts

4. **Update Sales Insights** (Account Detail → Sales Insights)
   - Add new pain points discovered
   - Note opportunities mentioned
   - Update buying motivations

5. **Update Tasks** (`/tasks`)
   - Complete finished tasks
   - Create new follow-up tasks
   - Update task statuses

6. **Check Sequences** (`/sequences`)
   - Review active enrollments
   - Ensure steps are completing
   - Adjust sequences if needed

### 4. Monthly Planning Workflow

1. **Review Scorecard Trends** (Account Detail → Scoring)
   - See which accounts improved
   - Identify declining accounts
   - Plan interventions

2. **Segment Analysis** (`/accounts`)
   - Filter by revenue segment
   - Review scores by segment
   - Identify patterns

3. **Sequence Performance** (`/sequences`)
   - Review completion rates
   - Analyze response rates
   - Optimize sequences

4. **Contact Quality** (`/contacts`)
   - Review contact coverage
   - Ensure decision makers identified
   - Fill gaps in contact info

5. **Set Goals** (Tasks)
   - Create monthly goal tasks
   - Link to strategic accounts
   - Track progress

---

## Tips & Tricks

### Navigation
- **Quick Search**: Use search bars on every page to quickly find accounts/contacts/tasks
- **Keyboard Shortcuts**: Browser back/forward buttons work naturally
- **Deep Links**: Bookmark specific account detail pages

### Scorecards
- **Export First**: Always export CSV to Google Sheet before submitting
- **Regular Reviews**: Complete scorecards quarterly to track trends
- **Be Honest**: Accurate scores help make better decisions

### Tasks
- **Link Everything**: Always link tasks to accounts for context
- **Use Priorities**: Don't mark everything urgent - be realistic
- **Quick Status**: Click status badge to quickly update without opening task

### Sequences
- **Start Small**: Test with 3-step sequences first
- **Monitor**: Watch first few enrollments closely
- **Personalize**: Adjust sequences per account type

### Sales Insights
- **Be Specific**: Clear, actionable insights are more valuable
- **Link Context**: Link insights to interactions when possible
- **Update Regularly**: Add insights as you discover them

### Research Notes
- **Source Everything**: Always include source URLs
- **Date Matters**: Track when you learned something
- **Concise**: Keep notes scannable

### Google Sheet Sync
- **Fill Templates**: Fill in Company Contacts tab to see contacts
- **Keep Updated**: Update sheet regularly for accurate CRM data
- **CSV Export**: Scorecard CSV exports match sheet format exactly

---

## Common Scenarios

### "I want to find all high-value accounts with low scores"
1. Go to `/accounts`
2. Filter by Revenue Segment = "enterprise" (or high-value)
3. Sort by Organization Score (ascending)
4. Review accounts with scores below threshold

### "I need to follow up with accounts I haven't talked to in 90 days"
1. Go to Dashboard
2. Click "Neglected Accounts" alert
3. Review each account
4. Log interaction or create follow-up task

### "I want to see the score history for an account"
1. Go to Account Detail
2. Click "Scoring" tab
3. Scroll to "Scorecard History" section
4. See all historical scorecards with dates and scores

### "I need to export a scorecard to Google Sheet"
1. Complete scorecard (`/take-scorecard`)
2. Click "Export to CSV" button
3. Open downloaded CSV
4. Copy/paste into Google Sheet Scorecard tab

### "I want to track all opportunities mentioned this month"
1. Go to Account Detail → Sales Insights tab
2. Filter by Insight Type = "opportunity"
3. Review all opportunities
4. Create follow-up tasks for each

---

## Troubleshooting

### Data Not Showing
- **Check**: Is Google Sheet public?
- **Check**: Browser console for errors
- **Try**: Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
- **Check**: Sheet tab names match exactly (case-sensitive)

### Scorecard Not Calculating
- **Check**: All questions answered
- **Check**: Template has questions configured
- **Check**: Weights are set correctly

### Contacts Not Appearing
- **Check**: Company Contacts tab has data filled in
- **Check**: Data is in correct columns
- **Check**: Browser console for parsing errors

### Sequence Not Sending
- **Check**: Sequence is active
- **Check**: Account is enrolled
- **Check**: Steps are configured correctly

---

## Getting Help

If you encounter issues:
1. Check browser console (F12) for errors
2. Verify Google Sheet is public and accessible
3. Check that tab names match exactly
4. Review this guide for workflows
5. Check data format in Google Sheet matches expected structure

---

## Next Steps

1. **Fill Company Contacts tab** in Google Sheet to see contacts
2. **Complete your first scorecard** for an account
3. **Set up your first sequence** for a prospect
4. **Log your first interaction** to see the timeline
5. **Explore all tabs** in Account Detail to see full capabilities

Happy CRM-ing! 🚀

