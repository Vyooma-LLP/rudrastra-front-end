import { 
  pgTable, 
  uuid, 
  varchar, 
  timestamp, 
  text, 
  boolean,
  integer,
  jsonb,
  primaryKey,
  unique
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// -----------------------------------------------------------------------------
// CONTROL PLANE STATE & SNAPSHOTS (PLATFORM CONFIGURATION)
// -----------------------------------------------------------------------------

export const controlPlaneState = pgTable('control_plane_state', {
  environment: varchar('environment', { length: 50 }).primaryKey(),
  activeVersion: integer('active_version').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  updatedBy: uuid('updated_by').notNull(),
});

export const configurationVersions = pgTable('configuration_versions', {
  version: integer('version').notNull(),
  environment: varchar('environment', { length: 50 }).notNull(),
  
  // Compatibility & Integrity
  configurationSchemaVersion: integer('configuration_schema_version').notNull(),
  registryVersion: varchar('registry_version', { length: 255 }).notNull(),
  registryHash: varchar('registry_hash', { length: 255 }).notNull(),
  applicationCompatibilityVersion: varchar('application_compatibility_version', { length: 255 }).notNull(),
  
  snapshotHash: varchar('snapshot_hash', { length: 255 }).notNull(),
  snapshotData: jsonb('snapshot_data').notNull(),
  
  publishedAt: timestamp('published_at').defaultNow().notNull(),
  publishedBy: uuid('published_by').notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.environment, t.version] }),
}));

// -----------------------------------------------------------------------------
// MUTATIONS & APPROVAL WORKFLOW
// -----------------------------------------------------------------------------

export const configurationDrafts = pgTable('configuration_drafts', {
  id: uuid('id').defaultRandom().primaryKey(),
  environment: varchar('environment', { length: 50 }).notNull(),
  baseVersion: integer('base_version').notNull(),
  revision: integer('revision').default(1).notNull(), // Optimistic locking
  
  status: varchar('status', { length: 50 }).notNull(), // DRAFT, VALIDATED
  
  changesJson: jsonb('changes_json').notNull(),
  validationResultJson: jsonb('validation_result_json'),
  
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const configurationChangeRequests = pgTable('configuration_change_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  environment: varchar('environment', { length: 50 }).notNull(),
  baseVersion: integer('base_version').notNull(),
  
  requestedBy: uuid('requested_by').notNull(),
  approvedBy: uuid('approved_by'),
  
  status: varchar('status', { length: 50 }).notNull(), // REQUESTED, APPROVED, REJECTED, EXPIRED, CANCELLED, EXECUTED
  
  changePayload: jsonb('change_payload').notNull(),
  changePayloadHash: varchar('change_payload_hash', { length: 255 }).notNull(),
  
  riskClass: varchar('risk_class', { length: 50 }).notNull(),
  
  requestedAt: timestamp('requested_at').defaultNow().notNull(),
  approvedAt: timestamp('approved_at'),
  expiresAt: timestamp('expires_at').notNull(),
  rejectionReason: text('rejection_reason'),
});

// -----------------------------------------------------------------------------
// EMERGENCY & SAFETY (HARD BLOCKS)
// -----------------------------------------------------------------------------

export const capabilityEmergencyKills = pgTable('capability_emergency_kills', {
  id: uuid('id').defaultRandom().primaryKey(),
  environment: varchar('environment', { length: 50 }).notNull(),
  featureKey: varchar('feature_key', { length: 255 }).notNull(),
  
  scope: varchar('scope', { length: 50 }).notNull(), // GLOBAL, ORG, ENV
  scopeId: varchar('scope_id', { length: 255 }).notNull(), 
  
  activatedBy: uuid('activated_by').notNull(),
  reason: text('reason').notNull(),
  
  activatedAt: timestamp('activated_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  
  status: varchar('status', { length: 50 }).notNull(), // ACTIVE, EXPIRED, RESOLVED
  resolvedAt: timestamp('resolved_at'),
  resolvedBy: uuid('resolved_by'),
});

export const platformSafeMode = pgTable('platform_safe_mode', {
  environment: varchar('environment', { length: 50 }).primaryKey(),
  active: boolean('active').default(false).notNull(),
  activatedBy: uuid('activated_by'),
  activatedAt: timestamp('activated_at'),
  reason: text('reason'),
});

// -----------------------------------------------------------------------------
// OBSERVABILITY & GOVERNANCE
// -----------------------------------------------------------------------------

export const consumerHealthHeartbeats = pgTable('consumer_health_heartbeats', {
  instanceId: varchar('instance_id', { length: 255 }).notNull(),
  environment: varchar('environment', { length: 50 }).notNull(),
  
  instanceGeneration: integer('instance_generation').notNull(), // Fencing mechanism
  nodeType: varchar('node_type', { length: 50 }).notNull(), // web, worker, webhook
  
  currentConfigVersion: integer('current_config_version').notNull(),
  status: varchar('status', { length: 50 }).notNull(), // HEALTHY, STALE, CRITICAL, INCOMPATIBLE, OFFLINE
  
  startedAt: timestamp('started_at').notNull(),
  lastSeenAt: timestamp('last_seen_at').defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.instanceId, t.environment, t.instanceGeneration] }),
}));

export const controlPlaneCommands = pgTable('control_plane_commands', {
  commandId: uuid('command_id').defaultRandom().primaryKey(),
  idempotencyKey: varchar('idempotency_key', { length: 255 }).notNull(),
  environment: varchar('environment', { length: 50 }).notNull(),
  
  actorId: uuid('actor_id').notNull(),
  commandType: varchar('command_type', { length: 100 }).notNull(),
  
  payloadHash: varchar('payload_hash', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(), // SUCCESS, FAILURE
  
  expectedVersion: integer('expected_version'),
  resultVersion: integer('result_version'),
  errorCode: varchar('error_code', { length: 100 }),
  responseJson: jsonb('response_json'), // Cached response for idempotency replays
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
}, (t) => ({
  uniqueIdempotency: unique().on(t.idempotencyKey, t.environment),
}));

export const capabilityAuditLogs = pgTable('capability_audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  environment: varchar('environment', { length: 50 }).notNull(),
  
  actorId: uuid('actor_id').notNull(),
  approverId: uuid('approver_id'),
  
  action: varchar('action', { length: 100 }).notNull(),
  featureKey: varchar('feature_key', { length: 255 }), // Can be null for global actions
  
  oldState: jsonb('old_state'),
  newState: jsonb('new_state'),
  
  reason: text('reason'),
  requestId: varchar('request_id', { length: 255 }),
  commandId: uuid('command_id'),
  
  configurationVersion: integer('configuration_version'),
  
  // Tamper-evident chaining
  previousEventHash: varchar('previous_event_hash', { length: 255 }),
  eventHash: varchar('event_hash', { length: 255 }).notNull(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const controlPlaneOutbox = pgTable('control_plane_outbox', {
  id: uuid('id').defaultRandom().primaryKey(),
  environment: varchar('environment', { length: 50 }).notNull(),
  
  eventType: varchar('event_type', { length: 100 }).notNull(),
  configurationVersion: integer('configuration_version').notNull(),
  aggregateId: varchar('aggregate_id', { length: 255 }),
  
  payload: jsonb('payload').notNull(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
  attemptCount: integer('attempt_count').default(0).notNull(),
}, (t) => ({
  uniqueEventVersion: unique().on(t.eventType, t.configurationVersion, t.environment),
}));

// -----------------------------------------------------------------------------
// COMMERCIAL PACKAGES
// -----------------------------------------------------------------------------

export const entitlementPackages = pgTable('entitlement_packages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const entitlementPackageCapabilities = pgTable('entitlement_package_capabilities', {
  packageId: uuid('package_id').references(() => entitlementPackages.id, { onDelete: 'cascade' }).notNull(),
  featureKey: varchar('feature_key', { length: 255 }).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.packageId, t.featureKey] }),
}));

// -----------------------------------------------------------------------------
// ORGANIZATION ENTITLEMENTS
// -----------------------------------------------------------------------------

export const organizationEntitlements = pgTable('organization_entitlements', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').notNull(),
  packageId: uuid('package_id').references(() => entitlementPackages.id, { onDelete: 'restrict' }).notNull(),
  effectiveFrom: timestamp('effective_from').defaultNow().notNull(),
  effectiveUntil: timestamp('effective_until'),
  status: varchar('status', { length: 50 }).default('ACTIVE').notNull(),
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const organizationCapabilityOverrides = pgTable('organization_capability_overrides', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').notNull(),
  featureKey: varchar('feature_key', { length: 255 }).notNull(),
  overrideType: varchar('override_type', { length: 20 }).$type<'GRANT' | 'DENY'>().notNull(),
  effectiveFrom: timestamp('effective_from').defaultNow().notNull(),
  effectiveUntil: timestamp('effective_until'),
  reason: text('reason').notNull(),
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// -----------------------------------------------------------------------------
// PLATFORM AVAILABILITY & ROLLOUT
// -----------------------------------------------------------------------------
// Kept for commercial continuity (can also be derived from active snapshot in the future)

export const capabilityAvailability = pgTable('capability_availability', {
  featureKey: varchar('feature_key', { length: 255 }).notNull(),
  environment: varchar('environment', { length: 50 }).notNull(),
  globalStatus: varchar('global_status', { length: 50 }).default('ACTIVE').notNull(),
  killSwitchActive: boolean('kill_switch_active').default(false).notNull(),
  rolloutPercentage: integer('rollout_percentage').default(100).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  updatedBy: uuid('updated_by').notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.featureKey, t.environment] }),
}));

// -----------------------------------------------------------------------------
// RELATIONS
// -----------------------------------------------------------------------------

export const entitlementPackageRelations = relations(entitlementPackages, ({ many }) => ({
  capabilities: many(entitlementPackageCapabilities),
}));

export const entitlementPackageCapabilitiesRelations = relations(entitlementPackageCapabilities, ({ one }) => ({
  package: one(entitlementPackages, {
    fields: [entitlementPackageCapabilities.packageId],
    references: [entitlementPackages.id],
  }),
}));
