-- WanderSync  Travel Intelligence Schema
-- Drop existing tables to ensure a clean schema creation
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.itineraries CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.restaurants CASCADE;
DROP TABLE IF EXISTS public.hotels CASCADE;
DROP TABLE IF EXISTS public.destinations CASCADE;

-- 1. Destinations (Attractions, Landmarks, Hidden Gems)
CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    rating DECIMAL(2, 1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    popularity_score INTEGER DEFAULT 0,
    crowd_level TEXT,
    best_time_to_visit TEXT,
    peak_hours JSONB DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    hero_image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    thumbnail TEXT,
    image_prompts JSONB DEFAULT '[]'::jsonb,
    ai_family_friendly BOOLEAN DEFAULT false,
    ai_couple_friendly BOOLEAN DEFAULT false,
    ai_solo_friendly BOOLEAN DEFAULT false,
    ai_group_friendly BOOLEAN DEFAULT false,
    ai_nature_score INTEGER DEFAULT 0,
    ai_food_score INTEGER DEFAULT 0,
    ai_adventure_score INTEGER DEFAULT 0,
    ai_heritage_score INTEGER DEFAULT 0,
    ai_photography_score INTEGER DEFAULT 0,
    ai_seasonal_suitability TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Hotels (Resorts, Stays, Homestays)
CREATE TABLE IF NOT EXISTS public.hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    rating DECIMAL(2, 1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    price_per_night INTEGER NOT NULL,
    amenities JSONB DEFAULT '[]'::jsonb,
    room_types JSONB DEFAULT '[]'::jsonb,
    popular_for JSONB DEFAULT '[]'::jsonb,
    hero_image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    thumbnail TEXT,
    image_prompts JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Restaurants (Cafes, Dhabas, Fine Dining)
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    cuisine TEXT NOT NULL,
    avg_cost_for_two INTEGER NOT NULL,
    must_try JSONB DEFAULT '[]'::jsonb,
    rating DECIMAL(2, 1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    hero_image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    thumbnail TEXT,
    image_prompts JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Reviews (Google-style)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL, -- 'destination', 'hotel', 'restaurant'
    entity_id UUID NOT NULL,
    user_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    travel_type TEXT, -- 'Family', 'Solo', 'Couple', 'Friends'
    visit_month TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Itineraries
CREATE TABLE IF NOT EXISTS public.itineraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    target_audience TEXT NOT NULL, -- 'Family', 'Couple', 'Budget', 'Luxury', 'Weekend'
    duration_days INTEGER NOT NULL,
    city TEXT NOT NULL,
    schedule JSONB DEFAULT '[]'::jsonb, -- Array of daily schedules
    total_estimated_cost TEXT,
    hero_image TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Activities (Tours, Boat Rides, Treks)
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
    duration TEXT NOT NULL,
    cost TEXT NOT NULL,
    best_time TEXT,
    rating DECIMAL(2, 1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    hero_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance and full-text search
CREATE INDEX IF NOT EXISTS idx_destinations_city ON public.destinations(city);
CREATE INDEX IF NOT EXISTS idx_destinations_category ON public.destinations(category);
CREATE INDEX IF NOT EXISTS idx_destinations_rating ON public.destinations(rating DESC);
CREATE INDEX IF NOT EXISTS idx_destinations_popularity ON public.destinations(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_destinations_search ON public.destinations USING GIN (to_tsvector('english', name || ' ' || description || ' ' || category));

CREATE INDEX IF NOT EXISTS idx_hotels_city ON public.hotels(city);
CREATE INDEX IF NOT EXISTS idx_restaurants_city ON public.restaurants(city);
CREATE INDEX IF NOT EXISTS idx_reviews_entity ON public.reviews(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activities_destination ON public.activities(destination_id);
