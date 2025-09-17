#!/usr/bin/env python3
"""
Machine Learning Models for FRA Atlas DSS
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib
import os
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ForestRightsMLModels:
    """ML Models for Forest Rights Decision Support System"""
    
    def __init__(self):
        self.decision_model = None
        self.risk_model = None
        self.similarity_model = None
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.tfidf_vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.models_trained = False
        
    def generate_synthetic_training_data(self, n_samples: int = 1000) -> pd.DataFrame:
        """Generate synthetic training data for model training"""
        np.random.seed(42)
        
        # Generate features
        data = {
            'area_claimed': np.random.exponential(2.5, n_samples),  # hectares
            'family_size': np.random.poisson(5, n_samples),
            'years_of_use': np.random.gamma(2, 10, n_samples),
            'documentation_score': np.random.beta(2, 1, n_samples),
            'community_support': np.random.beta(3, 1, n_samples),
            'environmental_impact': np.random.beta(1.5, 2, n_samples),
            'legal_compliance': np.random.beta(4, 1, n_samples),
            'distance_to_forest': np.random.exponential(5, n_samples),  # km
            'previous_violations': np.random.poisson(0.2, n_samples),
            'land_type': np.random.choice(['agricultural', 'grazing', 'mixed'], n_samples),
            'state': np.random.choice(['Jharkhand', 'Odisha', 'Chhattisgarh', 'Maharashtra', 'Madhya Pradesh'], n_samples),
            'season_applied': np.random.choice(['summer', 'monsoon', 'winter'], n_samples)
        }
        
        df = pd.DataFrame(data)
        
        # Generate target variables based on realistic rules
        decision_score = (
            df['documentation_score'] * 0.25 +
            df['community_support'] * 0.20 +
            df['legal_compliance'] * 0.20 +
            (1 - df['environmental_impact']) * 0.15 +
            np.minimum(df['years_of_use'] / 50, 1) * 0.15 +
            (1 - np.minimum(df['previous_violations'] / 3, 1)) * 0.05
        )
        
        # Add some noise
        decision_score += np.random.normal(0, 0.1, n_samples)
        decision_score = np.clip(decision_score, 0, 1)
        
        # Convert to decisions
        df['decision'] = np.where(decision_score > 0.7, 'approved',
                                 np.where(decision_score > 0.4, 'site_visit', 'rejected'))
        
        # Generate risk scores
        risk_score = (
            df['environmental_impact'] * 0.3 +
            np.minimum(df['area_claimed'] / 10, 1) * 0.2 +
            df['previous_violations'] / 5 * 0.2 +
            (1 - df['documentation_score']) * 0.15 +
            (1 - df['legal_compliance']) * 0.15
        )
        
        df['risk_score'] = np.clip(risk_score + np.random.normal(0, 0.1, n_samples), 0, 1)
        
        # Generate processing times (days)
        base_time = 30
        complexity_factor = df['area_claimed'] / 5 + df['previous_violations'] * 10
        df['processing_time'] = np.maximum(
            base_time + complexity_factor + np.random.normal(0, 5, n_samples),
            7
        )
        
        return df
    
    def prepare_features(self, df: pd.DataFrame) -> np.ndarray:
        """Prepare features for ML models"""
        # Define all possible categories for each categorical column
        category_values = {
            'land_type': ['agricultural', 'grazing', 'mixed'],
            'state': ['Jharkhand', 'Odisha', 'Chhattisgarh', 'Maharashtra', 'Madhya Pradesh'],
            'season_applied': ['summer', 'monsoon', 'winter']
        }
        
        # Encode categorical variables
        categorical_cols = ['land_type', 'state', 'season_applied']
        numerical_cols = ['area_claimed', 'family_size', 'years_of_use', 'documentation_score',
                         'community_support', 'environmental_impact', 'legal_compliance',
                         'distance_to_forest', 'previous_violations']
        
        features = df[numerical_cols].copy()
        
        # One-hot encode categorical variables with all possible values
        for col in categorical_cols:
            if col in df.columns:
                # Create dummies with all possible values
                dummies = pd.get_dummies(df[col], prefix=col)
                # Add missing columns with 0s
                for val in category_values[col]:
                    dummy_col = f"{col}_{val}"
                    if dummy_col not in dummies.columns:
                        dummies[dummy_col] = 0
                # Ensure columns are in the same order
                dummies = dummies[sorted(dummies.columns)]
                features = pd.concat([features, dummies], axis=1)
            else:
                # If column is missing, add all dummy columns with 0s
                for val in category_values[col]:
                    features[f"{col}_{val}"] = 0
        
        return features.values
    
    def train_decision_model(self, df: pd.DataFrame):
        """Train the decision prediction model"""
        logger.info("Training decision prediction model...")
        
        X = self.prepare_features(df)
        y = df['decision'].values
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        self.decision_model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            class_weight='balanced'
        )
        self.decision_model.fit(X_scaled, y)
        
        logger.info(f"Decision model trained with accuracy: {self.decision_model.score(X_scaled, y):.3f}")
    
    def train_risk_model(self, df: pd.DataFrame):
        """Train the risk assessment model"""
        logger.info("Training risk assessment model...")
        
        X = self.prepare_features(df)
        y = df['risk_score'].values
        
        # Scale features
        X_scaled = self.scaler.transform(X)
        
        # Train model
        self.risk_model = GradientBoostingRegressor(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=42
        )
        self.risk_model.fit(X_scaled, y)
        
        logger.info(f"Risk model trained with R²: {self.risk_model.score(X_scaled, y):.3f}")
    
    def train_similarity_model(self, df: pd.DataFrame):
        """Train the case similarity model"""
        logger.info("Training case similarity model...")
        
        # Create text descriptions for cases
        descriptions = []
        for _, row in df.iterrows():
            desc = f"Area: {row['area_claimed']:.1f} hectares, Family: {row['family_size']} members, "
            desc += f"Use: {row['years_of_use']:.0f} years, Type: {row['land_type']}, "
            desc += f"State: {row['state']}, Documentation: {row['documentation_score']:.2f}"
            descriptions.append(desc)
        
        # Fit TF-IDF vectorizer
        self.tfidf_vectorizer.fit(descriptions)
        
        logger.info("Similarity model trained successfully")
    
    def train_all_models(self):
        """Train all ML models"""
        logger.info("Starting ML model training...")
        
        # Generate training data
        df = self.generate_synthetic_training_data(2000)
        
        # Train models
        self.train_decision_model(df)
        self.train_risk_model(df)
        self.train_similarity_model(df)
        
        self.models_trained = True
        logger.info("All ML models trained successfully!")
        
        # Save models
        self.save_models()
    
    def save_models(self):
        """Save trained models to disk"""
        models_dir = "models"
        os.makedirs(models_dir, exist_ok=True)
        
        joblib.dump(self.decision_model, f"{models_dir}/decision_model.pkl")
        joblib.dump(self.risk_model, f"{models_dir}/risk_model.pkl")
        joblib.dump(self.scaler, f"{models_dir}/scaler.pkl")
        joblib.dump(self.tfidf_vectorizer, f"{models_dir}/tfidf_vectorizer.pkl")
        
        logger.info("Models saved successfully")
    
    def load_models(self):
        """Load trained models from disk"""
        models_dir = "models"
        
        try:
            self.decision_model = joblib.load(f"{models_dir}/decision_model.pkl")
            self.risk_model = joblib.load(f"{models_dir}/risk_model.pkl")
            self.scaler = joblib.load(f"{models_dir}/scaler.pkl")
            self.tfidf_vectorizer = joblib.load(f"{models_dir}/tfidf_vectorizer.pkl")
            self.models_trained = True
            logger.info("Models loaded successfully")
            return True
        except FileNotFoundError:
            logger.warning("No saved models found. Training new models...")
            return False
    
    def predict_decision(self, claim_data: Dict) -> Dict:
        """Predict decision for a claim"""
        if not self.models_trained:
            if not self.load_models():
                self.train_all_models()
        
        # Convert claim data to DataFrame
        df = pd.DataFrame([claim_data])
        X = self.prepare_features(df)
        X_scaled = self.scaler.transform(X)
        
        # Get prediction and probabilities
        prediction = self.decision_model.predict(X_scaled)[0]
        probabilities = self.decision_model.predict_proba(X_scaled)[0]
        
        # Get class names
        classes = self.decision_model.classes_
        prob_dict = dict(zip(classes, probabilities))
        
        return {
            'recommended_action': prediction,
            'confidence': float(max(probabilities)),
            'probabilities': prob_dict
        }
    
    def assess_risk(self, claim_data: Dict) -> Dict:
        """Assess risk for a claim"""
        if not self.models_trained:
            if not self.load_models():
                self.train_all_models()
        
        # Convert claim data to DataFrame
        df = pd.DataFrame([claim_data])
        X = self.prepare_features(df)
        X_scaled = self.scaler.transform(X)
        
        # Get risk prediction
        risk_score = self.risk_model.predict(X_scaled)[0]
        
        # Categorize risk
        if risk_score < 0.3:
            risk_level = 'low'
        elif risk_score < 0.6:
            risk_level = 'medium'
        elif risk_score < 0.8:
            risk_level = 'high'
        else:
            risk_level = 'critical'
        
        # Generate risk factors based on data
        risk_factors = []
        
        if claim_data.get('environmental_impact', 0) > 0.7:
            risk_factors.append({
                'type': 'Environmental Impact',
                'severity': 'high' if claim_data['environmental_impact'] > 0.8 else 'medium',
                'description': 'High environmental impact in ecologically sensitive area',
                'mitigation': 'Implement sustainable land use practices and regular monitoring'
            })
        
        if claim_data.get('area_claimed', 0) > 5:
            risk_factors.append({
                'type': 'Large Area Claim',
                'severity': 'medium',
                'description': f"Large area claim of {claim_data['area_claimed']:.1f} hectares",
                'mitigation': 'Conduct detailed survey and phased implementation'
            })
        
        if claim_data.get('previous_violations', 0) > 0:
            risk_factors.append({
                'type': 'Compliance History',
                'severity': 'high',
                'description': f"Previous violations: {claim_data['previous_violations']}",
                'mitigation': 'Enhanced monitoring and compliance checks required'
            })
        
        return {
            'risk_score': float(risk_score),
            'risk_level': risk_level,
            'risk_factors': risk_factors
        }
    
    def find_similar_cases(self, claim_data: Dict, n_similar: int = 5) -> List[Dict]:
        """Find similar historical cases"""
        if not self.models_trained:
            if not self.load_models():
                self.train_all_models()
        
        # Generate synthetic historical cases for demonstration
        historical_df = self.generate_synthetic_training_data(100)
        
        # Create description for current claim
        current_desc = f"Area: {claim_data.get('area_claimed', 0):.1f} hectares, "
        current_desc += f"Family: {claim_data.get('family_size', 0)} members, "
        current_desc += f"Use: {claim_data.get('years_of_use', 0):.0f} years, "
        current_desc += f"Type: {claim_data.get('land_type', 'unknown')}, "
        current_desc += f"State: {claim_data.get('state', 'unknown')}, "
        current_desc += f"Documentation: {claim_data.get('documentation_score', 0):.2f}"
        
        # Create descriptions for historical cases
        historical_descs = []
        for _, row in historical_df.iterrows():
            desc = f"Area: {row['area_claimed']:.1f} hectares, Family: {row['family_size']} members, "
            desc += f"Use: {row['years_of_use']:.0f} years, Type: {row['land_type']}, "
            desc += f"State: {row['state']}, Documentation: {row['documentation_score']:.2f}"
            historical_descs.append(desc)
        
        # Vectorize descriptions
        all_descs = [current_desc] + historical_descs
        tfidf_matrix = self.tfidf_vectorizer.transform(all_descs)
        
        # Calculate similarities
        similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
        
        # Get top similar cases
        top_indices = similarities.argsort()[-n_similar:][::-1]
        
        similar_cases = []
        for idx in top_indices:
            case = historical_df.iloc[idx]
            similar_cases.append({
                'id': f"case-{idx:03d}",
                'similarity': float(similarities[idx]),
                'outcome': case['decision'],
                'area_claimed': float(case['area_claimed']),
                'years_of_use': int(case['years_of_use']),
                'state': case['state'],
                'summary': f"Similar {case['land_type']} claim in {case['state']} for {case['area_claimed']:.1f} hectares",
                'date': (datetime.now() - timedelta(days=np.random.randint(30, 365))).isoformat()
            })
        
        return similar_cases
    
    def generate_reasoning(self, claim_data: Dict, prediction: Dict, risk_assessment: Dict) -> List[str]:
        """Generate reasoning for the decision"""
        reasoning = []
        
        # Documentation reasoning
        doc_score = claim_data.get('documentation_score', 0)
        if doc_score > 0.8:
            reasoning.append(f"Strong documentation provided (score: {doc_score:.2f}) with all required documents")
        elif doc_score > 0.6:
            reasoning.append(f"Adequate documentation (score: {doc_score:.2f}) but some improvements needed")
        else:
            reasoning.append(f"Insufficient documentation (score: {doc_score:.2f}) - additional documents required")
        
        # Community support reasoning
        community_score = claim_data.get('community_support', 0)
        if community_score > 0.8:
            reasoning.append(f"Strong community support (score: {community_score:.2f}) with gram sabha approval")
        elif community_score > 0.6:
            reasoning.append(f"Moderate community support (score: {community_score:.2f})")
        else:
            reasoning.append(f"Limited community support (score: {community_score:.2f}) - community consultation needed")
        
        # Traditional use reasoning
        years_use = claim_data.get('years_of_use', 0)
        if years_use >= 25:
            reasoning.append(f"Well-established traditional use for {years_use:.0f} years meets FRA requirements")
        elif years_use >= 10:
            reasoning.append(f"Moderate traditional use history of {years_use:.0f} years")
        else:
            reasoning.append(f"Limited traditional use history of {years_use:.0f} years - requires verification")
        
        # Risk-based reasoning
        risk_level = risk_assessment.get('risk_level', 'unknown')
        if risk_level == 'low':
            reasoning.append("Low risk assessment indicates minimal environmental and legal concerns")
        elif risk_level == 'medium':
            reasoning.append("Medium risk level requires additional safeguards and monitoring")
        else:
            reasoning.append("High risk level necessitates comprehensive mitigation measures")
        
        # Area-based reasoning
        area = claim_data.get('area_claimed', 0)
        if area > 10:
            reasoning.append(f"Large area claim of {area:.1f} hectares requires detailed survey and phased implementation")
        elif area > 5:
            reasoning.append(f"Moderate area claim of {area:.1f} hectares within acceptable limits")
        else:
            reasoning.append(f"Small area claim of {area:.1f} hectares suitable for individual forest rights")
        
        return reasoning

# Global instance
ml_models = ForestRightsMLModels()

def initialize_models():
    """Initialize ML models"""
    if not ml_models.load_models():
        ml_models.train_all_models()

if __name__ == "__main__":
    # Train models if run directly
    ml_models.train_all_models()
    print("ML models trained and saved successfully!")