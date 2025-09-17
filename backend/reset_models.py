"""
Script to reset and retrain ML models
"""
import os
import shutil
from ml_models import ml_models

def reset_and_train_models():
    """Reset and retrain all ML models"""
    print("🔄 Resetting and retraining ML models...")
    
    # Delete existing models
    models_dir = "models"
    if os.path.exists(models_dir):
        print("📦 Removing existing models...")
        shutil.rmtree(models_dir)
    
    # Create models directory
    os.makedirs(models_dir, exist_ok=True)
    
    # Train new models
    print("🏃 Training new models...")
    ml_models.train_all_models()
    print("✅ Models retrained successfully!")

if __name__ == "__main__":
    reset_and_train_models()