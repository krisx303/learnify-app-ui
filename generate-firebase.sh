#!/bin/bash

# Path to the firebase template file
TEMPLATE_FILE="firebase-template.js"
# Path where the final output should be saved
OUTPUT_FILE="firebase.js"

# Check if the template file exists
if [ ! -f "$TEMPLATE_FILE" ]; then
  echo "Template file $TEMPLATE_FILE not found!"
  exit 1
fi

# Replace placeholders with actual environment variables
sed -e "s/ENV_VAR_API_KEY/${API_KEY}/g" \
    -e "s/ENV_VAR_AUTH_DOMAIN/${AUTH_DOMAIN}/g" \
    -e "s/ENV_VAR_PROJECT_ID/${PROJECT_ID}/g" \
    -e "s/ENV_VAR_STORAGE_BUCKET/${STORAGE_BUCKET}/g" \
    -e "s/ENV_VAR_MESSAGING_SENDER_ID/${MESSAGING_SENDER_ID}/g" \
    -e "s/ENV_VAR_APP_ID/${APP_ID}/g" \
    "$TEMPLATE_FILE" > "$OUTPUT_FILE"

echo "firebase.js has been created successfully."