-- FRA Atlas Database Schema
-- Create tables for Forest Rights Act management system

-- Forest Rights Claims table
CREATE TABLE IF NOT EXISTS forest_rights_claims (
    id SERIAL PRIMARY KEY,
    claim_number VARCHAR(50) UNIQUE NOT NULL,
    claimant_name VARCHAR(255) NOT NULL,
    claimant_contact VARCHAR(20),
    village_name VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    forest_area_hectares DECIMAL(10,4),
    claim_type VARCHAR(50) NOT NULL, -- Individual, Community, etc.
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Approved, Rejected, Under Review
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verification_date TIMESTAMP,
    approval_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table for storing claim documents
CREATE TABLE IF NOT EXISTS claim_documents (
    id SERIAL PRIMARY KEY,
    claim_id INTEGER REFERENCES forest_rights_claims(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- Identity Proof, Land Records, etc.
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    ocr_text TEXT, -- Extracted text from OCR
    entities_extracted JSONB, -- NER extracted entities
    verification_status VARCHAR(50) DEFAULT 'Pending',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spatial data for forest boundaries and claims
CREATE TABLE IF NOT EXISTS spatial_boundaries (
    id SERIAL PRIMARY KEY,
    claim_id INTEGER REFERENCES forest_rights_claims(id) ON DELETE CASCADE,
    boundary_type VARCHAR(50) NOT NULL, -- Claim Area, Forest Boundary, etc.
    geometry_data JSONB NOT NULL, -- GeoJSON format
    area_hectares DECIMAL(10,4),
    perimeter_meters DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Government officials and roles
CREATE TABLE IF NOT EXISTS officials (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES neon_auth.users_sync(id),
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    state VARCHAR(100),
    contact_number VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Claim processing workflow
CREATE TABLE IF NOT EXISTS claim_workflow (
    id SERIAL PRIMARY KEY,
    claim_id INTEGER REFERENCES forest_rights_claims(id) ON DELETE CASCADE,
    stage VARCHAR(100) NOT NULL, -- Document Verification, Field Survey, etc.
    assigned_official_id INTEGER REFERENCES officials(id),
    status VARCHAR(50) NOT NULL,
    comments TEXT,
    stage_started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stage_completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit trail for all changes
CREATE TABLE IF NOT EXISTS audit_trail (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(50) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_by TEXT REFERENCES neon_auth.users_sync(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Decision support system data
CREATE TABLE IF NOT EXISTS decision_factors (
    id SERIAL PRIMARY KEY,
    claim_id INTEGER REFERENCES forest_rights_claims(id) ON DELETE CASCADE,
    factor_type VARCHAR(100) NOT NULL, -- Environmental, Social, Legal
    factor_name VARCHAR(255) NOT NULL,
    factor_value DECIMAL(10,4),
    weight DECIMAL(5,4) DEFAULT 1.0,
    source VARCHAR(255),
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blockchain transaction records
CREATE TABLE IF NOT EXISTS blockchain_records (
    id SERIAL PRIMARY KEY,
    claim_id INTEGER REFERENCES forest_rights_claims(id) ON DELETE CASCADE,
    transaction_hash VARCHAR(255) UNIQUE NOT NULL,
    block_number BIGINT,
    contract_address VARCHAR(255),
    event_type VARCHAR(100) NOT NULL, -- Claim Submitted, Approved, etc.
    transaction_data JSONB,
    gas_used INTEGER,
    transaction_fee DECIMAL(20,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_claims_status ON forest_rights_claims(status);
CREATE INDEX IF NOT EXISTS idx_claims_district ON forest_rights_claims(district);
CREATE INDEX IF NOT EXISTS idx_claims_submission_date ON forest_rights_claims(submission_date);
CREATE INDEX IF NOT EXISTS idx_documents_claim_id ON claim_documents(claim_id);
CREATE INDEX IF NOT EXISTS idx_workflow_claim_id ON claim_workflow(claim_id);
CREATE INDEX IF NOT EXISTS idx_spatial_claim_id ON spatial_boundaries(claim_id);
CREATE INDEX IF NOT EXISTS idx_audit_table_record ON audit_trail(table_name, record_id);
