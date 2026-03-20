-- Create actions table
CREATE TABLE IF NOT EXISTS actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  risk_id UUID REFERENCES risks(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  responsible TEXT,
  deadline DATE,
  status TEXT DEFAULT 'Pendente',
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read only their own actions
CREATE POLICY "Allow users to read their own actions"
ON actions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own actions
CREATE POLICY "Allow users to insert their own actions"
ON actions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own actions
CREATE POLICY "Allow users to update their own actions"
ON actions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own actions
CREATE POLICY "Allow users to delete their own actions"
ON actions FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE TRIGGER update_actions_updated_at
    BEFORE UPDATE ON actions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
