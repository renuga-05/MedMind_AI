import pandas as pd

# Load dataset
df = pd.read_csv("data/datasets.csv")

# Display missing values before cleaning
print("Missing Values Before Cleaning:")
print(df.isnull().sum())

# Handle missing values
for column in df.columns:

    # Numeric columns
    if df[column].dtype in ["int64", "float64"]:
        df[column].fillna(df[column].median(), inplace=True)

    # Categorical/Text columns
    else:
        df[column].fillna(df[column].mode()[0], inplace=True)

# Remove rows that are completely empty
df.dropna(how="all", inplace=True)

# Display missing values after cleaning
print("\nMissing Values After Cleaning:")
print(df.isnull().sum())

# Save cleaned dataset
df.to_csv("data/cleaned_dataset.csv", index=False)

print("\nData cleaning completed successfully!")
print("Cleaned dataset saved as cleaned_dataset.csv")