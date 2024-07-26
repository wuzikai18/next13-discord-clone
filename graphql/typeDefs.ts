
import { gql } from '@apollo/client';

export const typeDefs = gql`
  type Profile {
    id: ID!
    userId: String!
    name: String!
    imageUrl: String!
    email: String!
    servers: [Server!]!
    members: [Member!]!
    channels: [Channel!]!
    createdAt: String!
    updatedAt: String!
  }
  
  type Server {
    id: ID!
    name: String!
    imageUrl: String!
    inviteCode: String!
    profileId_Profile: String!
    profile: Profile!
    members: [Member!]!
    channels: [Channel!]!
    createdAt: String!
    updatedAt: String!
  }
  
  enum MemberRole {
    ADMIN
    MODERATOR
    GUEST
  }
  
  type Member {
    id: ID!
    role: MemberRole!
    profileId_Profile: String!
    profile: Profile!
    serverId_Server: String!
    server: Server!
    messages: [Message!]!
    directMessages: [DirectMessage!]!
    conversationsInitiated: [Conversation!]!
    conversationsReceived: [Conversation!]!
    createdAt: String!
    updatedAt: String!
  }
  
  enum ChannelType {
    TEXT
    AUDIO
    VIDEO
  }
  
  type Channel {
    id: ID!
    name: String!
    type: ChannelType!
    profileId: String!
    profile: Profile!
    serverId: String!
    server: Server!
    messages: [Message!]!
    createdAt: String!
    updatedAt: String!
  }
  
  type Message {
    id: ID!
    content: String!
    fileUrl: String
    memberId: String!
    member: Member!
    channelId: String!
    channel: Channel!
    deleted: Boolean!
    createdAt: String!
    updatedAt: String!
  }
  
  type Conversation {
    id: ID!
    memberOneId: String!
    memberOne: Member!
    memberTwoId: String!
    memberTwo: Member!
    directMessages: [DirectMessage!]!
  }
  
  type DirectMessage {
    id: ID!
    content: String!
    fileUrl: String
    memberId: String!
    member: Member!
    conversationId: String!
    conversation: Conversation!
    deleted: Boolean!
    createdAt: String!
    updatedAt: String!
  }
`;

