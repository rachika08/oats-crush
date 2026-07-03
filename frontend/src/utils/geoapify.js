const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

export async function reverseGeocode(lat, lon) {
  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${API_KEY}`
  );

  const data = await response.json();

  if (!data.features || data.features.length === 0) {
    return null;
  }

  const props = data.features[0].properties;

  return {
    addressLine1:
      props.address_line1 ||
      props.formatted ||
      "",

    addressLine2:
      props.address_line2 || "",

    city:
      props.city ||
      props.town ||
      props.village ||
      "",

    state:
      props.state || "",

    pincode:
      props.postcode || "",

    lat,
    lng: lon,
  };
}