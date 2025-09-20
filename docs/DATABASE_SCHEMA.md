# 🗄️ Database Schema Documentation

## **Core Tables**

### **Users Table**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'citizen',
  phone VARCHAR(20),
  address TEXT,
  state VARCHAR(100),
  district VARCHAR(100),
  village VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE user_role AS ENUM (
  'citizen',
  'village_official',
  'block_official',
  'district_official',
  'state_official',
  'admin'
);
```

### **Claims Table**

```sql
CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),

  -- Claimant Information
  claimant_name VARCHAR(255) NOT NULL,
  father_name VARCHAR(255),
  age INTEGER,
  gender gender_type,
  phone VARCHAR(20),

  -- Location Information
  village_name VARCHAR(255) NOT NULL,
  block_name VARCHAR(255),
  district VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  pin_code VARCHAR(10),

  -- Land Information
  area_requested DECIMAL(10,4) NOT NULL, -- in hectares
  land_type land_type_enum NOT NULL,
  survey_numbers TEXT[], -- Array of survey numbers
  boundaries JSONB, -- GeoJSON polygon

  -- Traditional Use Information
  years_of_use INTEGER,
  traditional_use TEXT,
  family_size INTEGER,
  dependents INTEGER,

  -- Status and Processing
  status claim_status DEFAULT 'submitted',
  priority priority_level DEFAULT 'normal',
  submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_to UUID REFERENCES users(id),

  -- Decision Information
  decision claim_decision,
  decision_date TIMESTAMP,
  decision_reason TEXT,
  decided_by UUID REFERENCES users(id),

  -- AI/ML Information
  ai_recommendation JSONB,
  risk_score DECIMAL(3,2),
  confidence_score DECIMAL(3,2),

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE claim_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'field_verification',
  'committee_review',
  'approved',
  'rejected',
  'requires_info',
  'withdrawn'
);

CREATE TYPE claim_decision AS ENUM (
  'approved',
  'rejected',
  'partially_approved',
  'requires_site_visit',
  'requires_more_info'
);

CREATE TYPE land_type_enum AS ENUM (
  'agricultural',
  'habitation',
  'grazing',
  'water_body',
  'burial_ground',
  'religious_site',
  'community_resource',
  'other'
);

CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE priority_level AS ENUM ('low', 'normal', 'high', 'urgent');
```

### **Documents Table**

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,

  -- File Information
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,

  -- Document Classification
  document_type document_type_enum NOT NULL,
  is_required BOOLEAN DEFAULT false,

  -- OCR Information
  ocr_processed BOOLEAN DEFAULT false,
  ocr_result JSONB,
  extracted_text TEXT,
  ocr_confidence DECIMAL(3,2),

  -- Verification
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES users(id),
  verification_date TIMESTAMP,
  verification_notes TEXT,

  -- Metadata
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE document_type_enum AS ENUM (
  'identity_proof',
  'address_proof',
  'land_records',
  'traditional_use_evidence',
  'community_certificate',
  'survey_settlement_record',
  'revenue_record',
  'forest_clearance',
  'other'
);
```

### **OCR Results Table**

```sql
CREATE TABLE ocr_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,

  -- Processing Information
  extracted_text TEXT NOT NULL,
  confidence DECIMAL(3,2) NOT NULL,
  language VARCHAR(10) NOT NULL,
  processing_time DECIMAL(6,3) NOT NULL, -- in seconds

  -- Bounding Boxes
  bounding_boxes JSONB,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Named Entities Table**

```sql
CREATE TABLE named_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ocr_result_id UUID REFERENCES ocr_results(id) ON DELETE CASCADE,

  -- Entity Information
  entity_type entity_type_enum NOT NULL,
  entity_value TEXT NOT NULL,
  confidence DECIMAL(3,2) NOT NULL,
  start_index INTEGER NOT NULL,
  end_index INTEGER NOT NULL,

  -- Verification
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES users(id),
  verification_date TIMESTAMP,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE entity_type_enum AS ENUM (
  'PERSON',
  'LOCATION',
  'DATE',
  'AREA',
  'PHONE',
  'SURVEY_NUMBER',
  'ORGANIZATION',
  'MONEY',
  'OTHER'
);
```

### **DSS Recommendations Table**

```sql
CREATE TABLE dss_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES claims(id),

  -- Recommendation
  recommended_action recommendation_action NOT NULL,
  confidence DECIMAL(3,2) NOT NULL,
  reasoning TEXT[] NOT NULL,

  -- Risk Assessment
  risk_score DECIMAL(3,2) NOT NULL,
  risk_level risk_level_enum NOT NULL,
  risk_factors JSONB,

  -- Precedent Cases
  precedent_cases JSONB,

  -- Processing Information
  processing_time DECIMAL(6,3) NOT NULL,
  model_version VARCHAR(50) NOT NULL,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE recommendation_action AS ENUM (
  'approve',
  'reject',
  'request_more_info',
  'schedule_site_visit',
  'escalate_to_committee'
);

CREATE TYPE risk_level_enum AS ENUM ('very_low', 'low', 'medium', 'high', 'very_high');
```

### **Audit Log Table**

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Action Information
  action audit_action NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,

  -- User Information
  user_id UUID REFERENCES users(id),
  user_role user_role,

  -- Change Information
  old_values JSONB,
  new_values JSONB,

  -- Context
  ip_address INET,
  user_agent TEXT,
  session_id VARCHAR(255),

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE audit_action AS ENUM (
  'create',
  'update',
  'delete',
  'view',
  'approve',
  'reject',
  'upload',
  'download',
  'login',
  'logout'
);
```

## **Indexes for Performance**

```sql
-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_state_district ON users(state, district);

-- Claims table indexes
CREATE INDEX idx_claims_user_id ON claims(user_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_district_state ON claims(district, state);
CREATE INDEX idx_claims_submission_date ON claims(submission_date);
CREATE INDEX idx_claims_assigned_to ON claims(assigned_to);
CREATE INDEX idx_claims_claim_number ON claims(claim_number);

-- Documents table indexes
CREATE INDEX idx_documents_claim_id ON documents(claim_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_ocr_processed ON documents(ocr_processed);

-- OCR results indexes
CREATE INDEX idx_ocr_results_document_id ON ocr_results(document_id);
CREATE INDEX idx_ocr_results_confidence ON ocr_results(confidence);

-- Named entities indexes
CREATE INDEX idx_entities_ocr_result_id ON named_entities(ocr_result_id);
CREATE INDEX idx_entities_type ON named_entities(entity_type);
CREATE INDEX idx_entities_verified ON named_entities(is_verified);

-- DSS recommendations indexes
CREATE INDEX idx_dss_claim_id ON dss_recommendations(claim_id);
CREATE INDEX idx_dss_action ON dss_recommendations(recommended_action);
CREATE INDEX idx_dss_risk_level ON dss_recommendations(risk_level);

-- Audit logs indexes
CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at);
```

## **Views for Common Queries**

```sql
-- Claims with latest status view
CREATE VIEW claims_with_status AS
SELECT
  c.*,
  u.name as claimant_user_name,
  u.email as claimant_email,
  assigned_user.name as assigned_to_name,
  COUNT(d.id) as document_count,
  COUNT(CASE WHEN d.ocr_processed = true THEN 1 END) as processed_documents,
  dss.recommended_action,
  dss.confidence as dss_confidence,
  dss.risk_level
FROM claims c
LEFT JOIN users u ON c.user_id = u.id
LEFT JOIN users assigned_user ON c.assigned_to = assigned_user.id
LEFT JOIN documents d ON c.id = d.claim_id
LEFT JOIN dss_recommendations dss ON c.id = dss.claim_id
GROUP BY c.id, u.id, assigned_user.id, dss.id;

-- Analytics summary view
CREATE VIEW analytics_summary AS
SELECT
  DATE_TRUNC('month', submission_date) as month,
  state,
  district,
  COUNT(*) as total_claims,
  COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_claims,
  COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_claims,
  COUNT(CASE WHEN status IN ('submitted', 'under_review', 'field_verification') THEN 1 END) as pending_claims,
  AVG(CASE WHEN decision_date IS NOT NULL THEN
    EXTRACT(EPOCH FROM (decision_date - submission_date))/86400
  END) as avg_processing_days
FROM claims
GROUP BY DATE_TRUNC('month', submission_date), state, district;
```

## **Triggers for Data Integrity**

```sql
-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON claims
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit log trigger
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    action,
    entity_type,
    entity_id,
    user_id,
    old_values,
    new_values
  ) VALUES (
    TG_OP::audit_action,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    COALESCE(NEW.updated_by, OLD.updated_by),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Apply audit triggers
CREATE TRIGGER audit_claims AFTER INSERT OR UPDATE OR DELETE ON claims
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();
```
