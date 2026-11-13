"""Check that the Warsaw open data resource IDs used in src/api.js still work.

Fetches one record from each resource and prints its field names, so a renamed
field shows up before it breaks normalization in the app.

Usage: python scripts/verify_ids.py
"""

import json
import urllib.request

RESOURCES = {
    "TREES": "ed6217dd-c8d0-4f7b-8bed-3b7eb81a95ba",
    "GROUPS": "913856f7-f71b-4638-abe2-12df14334e1a",
    "SHRUBS": "0b1af81f-247d-4266-9823-693858ad5b5d",
    "FORESTS": "75bedfd5-6c83-426b-9ae5-f03651857a48",
}

API_URL = "https://api.um.warszawa.pl/api/action/datastore_search/"

for name, res_id in RESOURCES.items():
    url = f"{API_URL}?resource_id={res_id}&limit=1"
    try:
        with urllib.request.urlopen(url, timeout=30) as response:
            data = json.loads(response.read().decode())
    except Exception as e:
        print(f"{name} ({res_id}): error: {e}")
        continue

    # The API omits "success" on success, so only an explicit False counts as failure.
    if data.get("success") is not False and "result" in data:
        result = data["result"]
        fields = [f["id"] for f in result["fields"]]
        print(f"{name} ({res_id}): {result.get('total')} records")
        print(f"  fields: {fields}")
    else:
        print(f"{name} ({res_id}): failed: {data}")
