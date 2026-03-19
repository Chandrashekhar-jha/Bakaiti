import mongoose, { Schema } from "mongoose";

// STATE SCHEMA
const StateSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  totalAssemblySeats: Number,
  totalLokSabhaSeats: Number,
  currentCM: String,
  quickFacts: [String],
  eras: [{
    year: String,
    title: String,
    desc: String
  }],
  nationalInfluence: String,
});

// PARTY SCHEMA
const PartySchema = new Schema({
  name: { type: String, required: true },
  shortName: { type: String, required: true },
  color: String,
  logo: String,
  ideology: String,
});

// ALLIANCE SCHEMA
const AllianceSchema = new Schema({
  name: { type: String, required: true },
  parties: [{ type: Schema.Types.ObjectId, ref: 'Party' }],
  electionId: { type: Schema.Types.ObjectId, ref: 'Election' },
  isWinner: Boolean,
});

// LEADER SCHEMA
const LeaderSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  partyId: { type: Schema.Types.ObjectId, ref: 'Party' },
  stateId: { type: Schema.Types.ObjectId, ref: 'State' },
  era: String,
  thumbnail: String,
  summary: String,
  description: String,
  achievements: [String],
  controversies: [String],
  relationships: [{
    leaderId: { type: Schema.Types.ObjectId, ref: 'Leader' },
    relationshipType: { type: String, enum: ["Mentorship", "Rivalry", "Alliance", "Party Switch", "Coalition Partner"] },
    context: String,
    year: Number
  }],
  partyHistory: [{
    partyId: { type: Schema.Types.ObjectId, ref: 'Party' },
    from: Number,
    to: Number
  }]
});

// ELECTION SCHEMA
const ElectionSchema = new Schema({
  stateId: { type: Schema.Types.ObjectId, ref: 'State' },
  year: { type: Number, required: true },
  type: { type: String, enum: ["General", "State", "Municipal", "Panchayat", "Ward"] },
  title: String,
  dramaticHook: String,
  summary: String,
  background: String,
  campaignStrategy: {
    digital: String,
    ground: String,
  },
  publicMood: String,
  shockingMoments: [String],
  controversies: [String],
  outcome: {
    winnerAllianceId: { type: Schema.Types.ObjectId, ref: 'Alliance' },
    winnerPartyId: { type: Schema.Types.ObjectId, ref: 'Party' },
    seatsWon: Number,
    totalSeats: Number,
    beforePower: String,
    afterPower: String,
  },
  impact: String,
  relatedStoryIds: [{ type: Schema.Types.ObjectId, ref: 'PoliticalStory' }],
});

// CONSTITUENCY SCHEMA
const ConstituencySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  stateId: { type: Schema.Types.ObjectId, ref: 'State' },
  type: { type: String, enum: ["General", "State", "Municipal", "Panchayat", "Ward"] },
  significance: String,
  notableLeaderIds: [{ type: Schema.Types.ObjectId, ref: 'Leader' }],
  historicalResults: [{
    year: Number,
    winnerName: String,
    winnerPartyId: { type: Schema.Types.ObjectId, ref: 'Party' },
    runnerUpName: String,
    runnerUpPartyId: { type: Schema.Types.ObjectId, ref: 'Party' },
    margin: Number,
    voteTrend: [{
      partyId: { type: Schema.Types.ObjectId, ref: 'Party' },
      percentage: Number
    }]
  }],
  famousContests: [{
    year: Number,
    title: String,
    description: String
  }]
});

// NATIONAL EVENT SCHEMA
const NationalEventSchema = new Schema({
  year: { type: Number, required: true },
  title: { type: String, required: true },
  description: String,
  impactOnStates: [{
    stateId: { type: Schema.Types.ObjectId, ref: 'State' },
    impact: String
  }],
  category: { type: String, enum: ["General Election", "Policy Shift", "Social Movement", "Crisis"] },
});

// STORY SCHEMA
const StorySchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, enum: ["Resort Politics", "Party Split", "Rebellion", "Kingmaker", "Betrayal", "Turning Point"] },
  stateId: { type: Schema.Types.ObjectId, ref: 'State' },
  electionId: { type: Schema.Types.ObjectId, ref: 'Election' },
  leaderIds: [{ type: Schema.Types.ObjectId, ref: 'Leader' }],
  thumbnail: String,
  excerpt: String,
  content: String,
});

export const State = mongoose.models.State || mongoose.model("State", StateSchema);
export const Party = mongoose.models.Party || mongoose.model("Party", PartySchema);
export const Alliance = mongoose.models.Alliance || mongoose.model("Alliance", AllianceSchema);
export const Leader = mongoose.models.Leader || mongoose.model("Leader", LeaderSchema);
export const Election = mongoose.models.Election || mongoose.model("Election", ElectionSchema);
export const Constituency = mongoose.models.Constituency || mongoose.model("Constituency", ConstituencySchema);
export const NationalEvent = mongoose.models.NationalEvent || mongoose.model("NationalEvent", NationalEventSchema);
export const PoliticalStory = mongoose.models.PoliticalStory || mongoose.model("PoliticalStory", StorySchema);
