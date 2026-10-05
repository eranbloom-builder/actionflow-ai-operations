// Synthetic evidence and fixed candidate replay. This is NOT a live AI extraction.
export const sources = [
  {id:'teams-001',type:'Teams chat',captured:'2026-10-02',text:'Maya Chen: I need to complete the pipeline hygiene report by October 5, 2026. My address is maya.chen@example.com.'},
  {id:'email-002',type:'Email',captured:'2026-10-01',text:'To do: Daniel Ross will complete the renewal-risk review by October 2, 2026. Contact: daniel.ross@example.com.'},
  {id:'meeting-003',type:'Meeting transcript',captured:'2026-10-05',text:'Action item: Maya Chen will finalize the forecast assumptions by October 9, 2026. Maya can be reached at maya.chen@example.com.'},
  {id:'teams-004',type:'Teams chat',captured:'2026-10-05',text:'The customer handoff checklist needs to be done. We have not assigned an owner or due date.'},
  {id:'email-005',type:'Email',captured:'2026-10-05',text:'For discussion: could we redesign our reporting next quarter? No task has been agreed.'}
];
export const candidates = [
  {action:'Complete the pipeline hygiene report',owner:'Maya Chen',startDate:'2026-10-02',endDate:'2026-10-05',ownerEmail:'maya.chen@example.com',sourceId:'teams-001'},
  {action:'Complete the renewal-risk review',owner:'Daniel Ross',startDate:'2026-10-01',endDate:'2026-10-02',ownerEmail:'daniel.ross@example.com',sourceId:'email-002'},
  {action:'Finalize the forecast assumptions',owner:'Maya Chen',startDate:'2026-10-05',endDate:'2026-10-09',ownerEmail:'maya.chen@example.com',sourceId:'meeting-003'},
  {action:'Complete the customer handoff checklist',owner:'missing information',startDate:'2026-10-05',endDate:'missing information',ownerEmail:'missing information',sourceId:'teams-004'}
];
