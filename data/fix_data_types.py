import pandas as pd

# Load dataset
df = pd.read_csv("data/cleaned_dataset.csv")

print("Data Types Before Fixing:")
print(df.dtypes)

# Convert columns to correct data types

# Integer columns
int_columns = [
    "age",
    "anaemia",
    "diabetes",
    "high_blood_pressure",
    "sex",
    "DEATH_EVENT"
]

for col in int_columns:
    df[col] = df[col].astype(int)

# Float columns
float_columns = [
    "creatinine_phosphokinase",
    "ejection_fraction",
    "platelets",
    "serum_creatinine",
    "serum_sodium"
]

for col in float_columns:
    df[col] = df[col].astype(float)

print("\nData Types After Fixing:")
print(df.dtypes)

# Save dataset
df.to_csv("data/cleaned_dataset.csv", index=False)

print("\nData types fixed successfully!")