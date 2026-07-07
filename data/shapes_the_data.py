import pandas as pd

# Load dataset
df = pd.read_csv("data/datasets.csv")

# Shape
print("Shape:", df.shape)

# Columns
print("\nColumns:")
print(df.columns)

# Data Types
print("\nData Types:")
print(df.dtypes)
# Check missing values
missing_values = df.isnull().sum()

print("Missing Values:")
print(missing_values)