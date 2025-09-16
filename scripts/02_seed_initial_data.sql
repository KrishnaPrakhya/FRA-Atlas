-- Seed initial data for FRA Atlas system

-- Insert sample forest rights claims
INSERT INTO forest_rights_claims (
    claim_number, claimant_name, claimant_contact, village_name, 
    district, state, forest_area_hectares, claim_type, status
) VALUES 
('FRA2024001', 'Ramesh Kumar', '9876543210', 'Jhilmil Village', 'Dehradun', 'Uttarakhand', 2.5, 'Individual', 'Under Review'),
('FRA2024002', 'Sunita Devi', '9876543211', 'Kalsi Village', 'Dehradun', 'Uttarakhand', 1.8, 'Individual', 'Pending'),
('FRA2024003', 'Village Forest Committee', '9876543212', 'Mussoorie', 'Dehradun', 'Uttarakhand', 15.0, 'Community', 'Approved'),
('FRA2024004', 'Tribal Cooperative', '9876543213', 'Chakrata', 'Dehradun', 'Uttarakhand', 8.5, 'Community', 'Under Review');

-- Insert sample officials
INSERT INTO officials (
    name, designation, department, district, state, contact_number
) VALUES 
('Dr. Priya Sharma', 'Forest Officer', 'Forest Department', 'Dehradun', 'Uttarakhand', '9876543220'),
('Rajesh Singh', 'District Collector', 'Revenue Department', 'Dehradun', 'Uttarakhand', '9876543221'),
('Meera Joshi', 'Sub-Divisional Magistrate', 'Administration', 'Dehradun', 'Uttarakhand', '9876543222');

-- Insert sample workflow stages
INSERT INTO claim_workflow (claim_id, stage, assigned_official_id, status, comments) VALUES 
(1, 'Document Verification', 1, 'In Progress', 'Verifying identity and land documents'),
(1, 'Field Survey', 1, 'Pending', 'Awaiting field verification team'),
(3, 'Final Approval', 2, 'Completed', 'All requirements met, claim approved'),
(4, 'Environmental Assessment', 1, 'In Progress', 'Assessing environmental impact');

-- Insert sample decision factors
INSERT INTO decision_factors (claim_id, factor_type, factor_name, factor_value, weight) VALUES 
(1, 'Environmental', 'Forest Density', 0.75, 0.3),
(1, 'Social', 'Community Dependency', 0.85, 0.4),
(1, 'Legal', 'Document Completeness', 0.90, 0.3),
(3, 'Environmental', 'Biodiversity Impact', 0.60, 0.25),
(3, 'Social', 'Livelihood Dependency', 0.95, 0.45),
(3, 'Legal', 'Traditional Rights Evidence', 0.88, 0.30);
