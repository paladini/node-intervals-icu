/**
 * Chat and message types from the Intervals.icu API
 */
import type { ChatType, ChatRole, JoinPolicy, MessageType, Plan } from './enums.js';
import type { Activity } from './activity.js';
import type { Folder } from './folder.js';

/** Chat member */
export interface ChatMember {
  athlete_id?: string;
  name?: string;
  profile_medium?: string;
  role?: ChatRole;
  coach?: boolean;
  plan?: Plan;
  accepted_coaching_group?: string;
}

/** Chat */
export interface Chat {
  id?: number;
  type?: ChatType;
  coaching_group?: string;
  updated?: string;
  name?: string;
  picture?: string;
  description?: string;
  url?: string;
  slug?: string;
  pub?: boolean;
  join_policy?: JoinPolicy;
  sidebar_logo?: string;
  sidebar_color?: string;
  sidebar_dark?: boolean;
  sidebar_top_color?: string;
  hide_members?: boolean;
  members_cannot_chat?: boolean;
  primary_group?: boolean;
  coins?: number;
  members?: ChatMember[];
  athlete_id?: string;
  activity_id?: string;
  other_athlete_id?: string;
  other_athlete_sex?: string;
  follows_you?: string;
  you_follow?: string;
  role?: ChatRole;
  new_message_count?: number;
  kicked?: string;
  kicked_by_id?: string;
  last_seen_message_id?: number;
  mute_until?: string;
  sharedFolders?: Folder[];
}

/** Message */
export interface Message {
  id?: number;
  athlete_id?: string;
  name?: string;
  created?: string;
  type?: MessageType;
  content?: string;
  activity_id?: string;
  start_index?: number;
  end_index?: number;
  answer?: string;
  activity?: Activity;
  attachment_url?: string;
  attachment_mime_type?: string;
  deleted?: string;
  deleted_by_id?: string;
  join_group_id?: number;
  accept_coaching_group_id?: number;
  seen?: boolean;
}

/** New message for sending */
export interface NewMessage {
  to_athlete_id?: string;
  to_activity_id?: string;
  chat_id?: number;
  content?: string;
  type?: MessageType;
  askACoach?: boolean;
  attachment_id?: string;
  [key: string]: unknown;
}

/** New activity message */
export interface NewActivityMsg {
  content?: string;
}

/** Send response */
export interface SendResponse {
  id?: number;
  message?: Message;
  new_chat?: Chat;
}

/** New message response */
export interface NewMsg {
  id?: number;
  new_chat?: Chat;
}
