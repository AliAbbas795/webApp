import requests
import json

RESTAURANT_ID = "877829"

# Approximate Lucknow latitude and longitude
LATITUDE = "26.8467"
LONGITUDE = "80.9462"

# Swiggy API Endpoint
SWIGGY_API_URL = f"https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat={LATITUDE}&lng={LONGITUDE}&restaurantId={RESTAURANT_ID}"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.5",
    "Referer": "https://www.swiggy.com/"
}

def scrape_swiggy_menu():
    print("\n Fetching menu data from Swiggy API...")
    
    try:
        response = requests.get(SWIGGY_API_URL, headers=HEADERS)
        print(f"Response Status Code: {response.status_code}")

        if response.status_code != 200:
            print("Failed to retrieve data.")
            return None

        # Load JSON response
        menu_data = response.json()

        # Navigate to the actual menu items
        menu_items = menu_data.get("data", {}).get("cards", [])

        extracted_items = []

        for card in menu_items:
            try:
                if "groupedCard" in card:
                    categories = card["groupedCard"]["cardGroupMap"]["REGULAR"]["cards"]
                    for category in categories:
                        if "itemCards" in category["card"]["card"]:
                            for item in category["card"]["card"]["itemCards"]:
                                item_info = item["card"]["info"]
                                name = item_info.get("name", "Unknown Item")
                                price = item_info.get("price", 0) / 100  # Convert paise to rupees
                                description = item_info.get("description", "No description")
                                rating = item_info.get("ratings", {}).get("aggregatedRating", {}).get("rating", "No Rating")

                                extracted_items.append({
                                    "name": name,
                                    "price": f"₹{price}",
                                    "description": description,
                                    "rating": rating
                                })

                                print(f"{name} - ₹{price}, Rating: {rating}")

            except KeyError:
                continue

        print("\n Total items scraped:", len(extracted_items))

        # Save to JSON file
        with open("swiggy_menu.json", "w", encoding="utf-8") as file:
            json.dump(extracted_items, file, indent=4)

        print("\n Menu data saved to swiggy_menu.json")
        return extracted_items

    except Exception as e:
        print(" Error:", e)
        return None

# Run the scraper
scrape_swiggy_menu()





