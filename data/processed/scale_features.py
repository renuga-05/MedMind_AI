import pandas as pd
from sklearn.preprocessing import StandardScaler

# Load dataset
df = pd.read_csv("data/processed/final_cleaned_dataset.csv")

# Numerical columns
num_cols = [
    "age",
    "creatinine_phosphokinase",
    "ejection_fraction",
    "platelets",
    "serum_creatinine",
    "serum_sodium"
]

# Scale features
scaler = StandardScaler()
df[num_cols] = scaler.fit_transform(df[num_cols])

# Save dataset
df.to_csv("data/processed/final_cleaned_dataset.csv", index=False)

print("Numerical features scaled successfully!")