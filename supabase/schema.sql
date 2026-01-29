-- Intervention Categories from Guide
CREATE TABLE intervention_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  evidence_level TEXT NOT NULL CHECK (evidence_level IN ('table1', 'table2', 'table3', 'table4')),
  evidence_label TEXT NOT NULL, -- "Mainstream Evidence-Based", "Investigational", etc.
  target_domain TEXT,
  notes TEXT,
  risk_level TEXT, -- "Low", "Moderate", "High", "DANGER"
  created_at TIMESTAMP DEFAULT NOW()
);

-- Maryland Providers
CREATE TABLE providers (
  id SERIAL PRIMARY KEY,
  practice_name TEXT NOT NULL,
  website TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT DEFAULT 'MD',
  zip_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  description TEXT,
  insurance_accepted TEXT[], -- Array of insurance names
  verified BOOLEAN DEFAULT false,
  verified_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Services Offered (Many-to-Many relationship)
CREATE TABLE provider_services (
  id SERIAL PRIMARY KEY,
  provider_id INTEGER REFERENCES providers(id) ON DELETE CASCADE,
  intervention_id INTEGER REFERENCES intervention_categories(id),
  notes TEXT, -- Provider-specific notes about this service
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider_id, intervention_id)
);

-- News Feed (Aggregated from various sources)
CREATE TABLE news_articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL, -- "The Transmitter", "Autism Speaks", "NIH", etc.
  published_date TIMESTAMP,
  summary TEXT,
  full_text TEXT,
  image_url TEXT,
  fetched_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Research Papers (PubMed + translations)
CREATE TABLE research_papers (
  id SERIAL PRIMARY KEY,
  pubmed_id TEXT UNIQUE,
  title TEXT NOT NULL,
  abstract TEXT,
  plain_english_summary TEXT, -- AI-generated translation
  authors TEXT,
  journal TEXT,
  publication_date DATE,
  doi TEXT,
  url TEXT,
  keywords TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Email Subscribers
CREATE TABLE subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  source TEXT DEFAULT 'modal', -- 'modal', 'footer', 'manual'
  active BOOLEAN DEFAULT true,
  unsubscribed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_providers_city ON providers(city);
CREATE INDEX idx_providers_verified ON providers(verified);
CREATE INDEX idx_news_source ON news_articles(source);
CREATE INDEX idx_news_published ON news_articles(published_date DESC);
CREATE INDEX idx_research_pubmed ON research_papers(pubmed_id);

-- Enable Row Level Security
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervention_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Public read access (all tables)
CREATE POLICY "Public read access" ON providers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON provider_services FOR SELECT USING (true);
CREATE POLICY "Public read access" ON intervention_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON news_articles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON research_papers FOR SELECT USING (true);

-- Public insert for subscribers (email capture)
CREATE POLICY "Public insert" ON subscribers FOR INSERT WITH CHECK (true);

-- Insert intervention categories from guide (sample - full list would be populated via script)
INSERT INTO intervention_categories (name, evidence_level, evidence_label, target_domain, risk_level) VALUES
('Discrete Trial Training (DTT)', 'table1', 'Mainstream Evidence-Based', 'Learning readiness, compliance, specific skills', 'Low'),
('ESDM (Early Start Denver Model)', 'table1', 'Mainstream Evidence-Based', 'Language, social engagement', 'Low'),
('Speech-Language Therapy (SLT)', 'table1', 'Mainstream Evidence-Based', 'Communication, apraxia', 'Low'),
('Occupational Therapy (OT)', 'table1', 'Mainstream Evidence-Based', 'Sensory regulation, daily living', 'Low'),
('Physical Therapy (PT)', 'table1', 'Mainstream Evidence-Based', 'Gross motor delays, coordination', 'Low'),
('Folinic Acid (Leucovorin)', 'table2', 'Investigational but Biologically Plausible', 'Methylation support', 'Low'),
('Bumetanide', 'table2', 'Investigational but Biologically Plausible', 'GABA regulation', 'Moderate'),
('Visual Schedules', 'table3', 'Low Cost, Low Risk Adjuncts', 'Transition anxiety reduction', 'Low'),
('Weighted Lap Pads', 'table3', 'Low Cost, Low Risk Adjuncts', 'Sensory regulation', 'Low'),
('CEASE Therapy', 'table4', 'DANGEROUS - Medical Fraud', 'NONE - AVOID', 'DANGER'),
('Chelation Therapy', 'table4', 'DANGEROUS - Has killed children', 'NONE - AVOID', 'DANGER'),
('MMS/Chlorine Dioxide', 'table4', 'DANGEROUS - Industrial bleach', 'NONE - AVOID', 'DANGER');
