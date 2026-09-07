import crypto from 'node:crypto';

const APPROVAL_REQUIRED = new Set([
  'github.merge',
  'github.write_main',
  'phone.send_message',
  'phone.delete_file',
  'account.change_security',
  'finance.transaction'
]);

export function needsApproval(permission) {
  return APPROVAL_REQUIRED.has(permission);
}

export function constantTimeEqual(a, b) {
  const aa = Buffer.from(String(a ?? ''));
  const bb = Buffer.from(String(b ?? ''));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

export function authorize(agent, permission) {
  if (!agent) return { allowed: false, reason: 'unknown_agent' };
  if (needsApproval(permission)) return { allowed: false, approvalRequired: true, reason: 'explicit_approval_required' };
  if (agent.permissions?.includes(permission)) return { allowed: true };
  if (agent.approvalPermissions?.includes(permission)) return { allowed: false, approvalRequired: true, reason: 'agent_requires_approval' };
  return { allowed: false, reason: 'permission_denied' };
}
