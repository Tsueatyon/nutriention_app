import secrets
secret_key = secrets.token_hex(32)  # Generates 64-character hex string
print(f"Generated secret: {secret_key}")