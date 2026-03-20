-- Create risks table
CREATE TABLE IF NOT EXISTS risks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  risk_id TEXT UNIQUE NOT NULL, -- e.g., RK-2024-001
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nature TEXT NOT NULL, -- OPERACIONAL, FINANCEIRO, etc.
  risk TEXT NOT NULL,
  cause TEXT,
  consequence TEXT,
  trigger TEXT,
  status TEXT NOT NULL, -- Crítico, Monitorando, etc.
  p INTEGER NOT NULL, -- Probabilidade
  i INTEGER NOT NULL, -- Impacto
  weight NUMERIC(5, 2) NOT NULL,
  severity TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read only their own risks
CREATE POLICY "Allow users to read their own risks"
ON risks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own risks
CREATE POLICY "Allow users to insert their own risks"
ON risks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own risks
CREATE POLICY "Allow users to update their own risks"
ON risks FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own risks
CREATE POLICY "Allow users to delete their own risks"
ON risks FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at
CREATE TRIGGER update_risks_updated_at
    BEFORE UPDATE ON risks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
