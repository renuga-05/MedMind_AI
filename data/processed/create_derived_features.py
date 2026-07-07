import pandas as pd

df = pd.read_csv("data/processed/final_cleaned_dataset.csv")

# Derived Feature 1
df["Age_Group"] = pd.cut(
    df["age"],
    bins=[0, 40, 60, 100],
    labels=["Young", "Middle_Aged", "Senior"]
)

# Derived Feature 2
df["Sodium_Level"] = df["serum_sodium"].apply(
    lambda x: "Low" if x < 135 else "Normal"
)

df.to_csv("data/processed/final_cleaned_dataset.csv", index=False)

print("Derived features created successfully!")