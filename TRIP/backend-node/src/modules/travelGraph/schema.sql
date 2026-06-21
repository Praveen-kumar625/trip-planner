-- Initialize Extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS postgis;

-- Entities
CREATE TABLE IF NOT EXISTS Users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  travel_dna JSONB,
  persona TEXT,
  user_embedding vector(768),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES Users(id),
  title TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location GEOGRAPHY(Point, 4326),
  embedding vector(768), -- For similarity search
  category TEXT,
  hidden_gem_score FLOAT,
  tourism_pressure FLOAT,
  seasonality JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES Destinations(id),
  name TEXT NOT NULL,
  location GEOGRAPHY(Point, 4326),
  embedding vector(768),
  activity_type TEXT,
  cost NUMERIC,
  duration_minutes INTEGER,
  comfort_score FLOAT,
  popularity FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES Destinations(id),
  name TEXT NOT NULL,
  category TEXT,
  price_range TEXT,
  amenities JSONB,
  sustainability_score FLOAT,
  embedding vector(768),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES Destinations(id),
  name TEXT NOT NULL,
  cuisine TEXT,
  local_economy_score FLOAT,
  authenticity_score FLOAT,
  embedding vector(768),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Edges (Relationships)
CREATE TABLE IF NOT EXISTS UserRelationships (
  user_id UUID REFERENCES Users(id),
  target_id UUID,
  target_type TEXT, -- 'Destination', 'Activity', 'Hotel', 'Restaurant'
  relationship_type TEXT, -- 'VISITED', 'BOOKED', 'LIKED', 'REVIEWED', 'SAVED', 'RATED'
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, target_id, relationship_type)
);

CREATE TABLE IF NOT EXISTS SimilarityEdges (
  source_id UUID,
  target_id UUID,
  entity_type TEXT, -- 'User', 'Destination', 'Activity'
  similarity_type TEXT, -- 'SIMILAR_TO'
  similarity_score FLOAT,
  PRIMARY KEY (source_id, target_id, similarity_type)
);

CREATE TABLE IF NOT EXISTS GraphCorrelations (
  entity_a_id UUID,
  entity_b_id UUID,
  correlation_type TEXT, -- 'FREQUENTLY_COMBINED', 'RECOMMENDED_WITH', 'MATCHES_DNA', 'DISCOVERED_BY'
  frequency_weight INTEGER DEFAULT 1,
  PRIMARY KEY (entity_a_id, entity_b_id, correlation_type)
);
