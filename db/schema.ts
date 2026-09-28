import { sqliteTable, text, integer, primaryKey, index } from 'drizzle-orm/sqlite-core';
export const users = sqliteTable('users', {
  id:text('id').primaryKey(), username:text('username').notNull().unique(), nickname:text('nickname').notNull(),
  password:text('password').notNull(), recovery:text('recovery').notNull(), created:integer('created').notNull(),
});
export const sessions = sqliteTable('sessions', {
  token:text('token').primaryKey(), userId:text('user_id').notNull().references(()=>users.id), expires:integer('expires').notNull(),
},t=>[index('sessions_user').on(t.userId)]);
export const trips = sqliteTable('trips', {
  id:text('id').primaryKey(), owner:text('owner').notNull().references(()=>users.id), state:text('state').notNull(),
  revision:integer('revision').notNull().default(0), lastOp:text('last_op').notNull().default(''), updated:integer('updated').notNull(),
});
export const members = sqliteTable('members', {
  tripId:text('trip_id').notNull().references(()=>trips.id), userId:text('user_id').notNull().references(()=>users.id), joined:integer('joined').notNull(),
},t=>[primaryKey({columns:[t.tripId,t.userId]}),index('members_user').on(t.userId)]);
export const invites = sqliteTable('invites', {
  token:text('token').primaryKey(), tripId:text('trip_id').notNull().references(()=>trips.id), expires:integer('expires').notNull(),
},t=>[index('invites_trip').on(t.tripId)]);
export const operations = sqliteTable('operations', {
  id:text('id').primaryKey(), tripId:text('trip_id').notNull().references(()=>trips.id), userId:text('user_id').notNull(),
  label:text('label').notNull(), target:text('target').notNull(), before:text('before'), after:text('after'), created:integer('created').notNull(), revision:integer('revision').notNull(),
},t=>[index('operations_trip_created').on(t.tripId,t.created)]);
export const limits = sqliteTable('limits', {key:text('key').primaryKey(), count:integer('count').notNull(), expires:integer('expires').notNull()});
export const presence = sqliteTable('presence', {
  tripId:text('trip_id').notNull(),userId:text('user_id').notNull(),view:text('view').notNull(),seen:integer('seen').notNull(),
},t=>[primaryKey({columns:[t.tripId,t.userId]})]);
