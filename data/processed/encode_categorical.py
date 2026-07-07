import pandas as pd

df = pd.read_csv("data/processed/final_cleaned_dataset.csv")

df = pd.get_dummies(
    df,
    columns=["Age_Group", "Sodium_Level"]
)

df.to_csv("data/processed/final_cleaned_dataset.csv", index=False)

print("One-hot encoding completed!")