import pandas as pd

# Load cleaned dataset
df = pd.read_csv("data/cleaned_dataset.csv")

# Count duplicate rows
duplicate_count = df.duplicated().sum()
print("Number of duplicate rows:", duplicate_count)

# Remove duplicates
df = df.drop_duplicates()

# Check shape after removing duplicates
print("Dataset shape after removing duplicates:", df.shape)

# Save updated dataset
df.to_csv("data/cleaned_dataset.csv", index=False)

print("Duplicate rows removed successfully!")