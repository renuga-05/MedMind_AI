import pandas as pd
import matplotlib.pyplot as plt

# Load dataset
df = pd.read_csv("data/datasets.csv")

# Age Distribution
plt.figure(figsize=(6,4))
plt.hist(df['age'], bins=10)
plt.title('Age Distribution')
plt.xlabel('Age')
plt.ylabel('Count')
plt.show()

# Ejection Fraction Distribution
plt.figure(figsize=(6,4))
plt.hist(df['ejection_fraction'], bins=10)
plt.title('Ejection Fraction Distribution')
plt.xlabel('Ejection Fraction')
plt.ylabel('Count')
plt.show()

# Serum Creatinine Distribution
plt.figure(figsize=(6,4))
plt.hist(df['serum_creatinine'], bins=10)
plt.title('Serum Creatinine Distribution')
plt.xlabel('Serum Creatinine')
plt.ylabel('Count')
plt.show()