/**
 * TrustGo Global Recruitment Corridors (Bangladesh to International Destinations)
 */

export const COORDINATES = {
  dhaka: { name: 'Dhaka, Bangladesh', lat: 23.8103, lon: 90.4125, isHub: true },
  dubai: { name: 'Dubai, UAE', lat: 25.2048, lon: 55.2708, label: 'GCC Corridor' },
  riyadh: { name: 'Riyadh, Saudi Arabia', lat: 24.7136, lon: 46.6753, label: 'GCC Corridor' },
  warsaw: { name: 'Warsaw, Poland', lat: 52.2297, lon: 21.0122, label: 'EU Corridor' },
  tokyo: { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503, label: 'East Asia Corridor' },
};

export const CORRIDORS = [
  { from: 'dhaka', to: 'dubai', color: '#10B981', workers: 540 },
  { from: 'dhaka', to: 'riyadh', color: '#10B981', workers: 420 },
  { from: 'dhaka', to: 'warsaw', color: '#F59E0B', workers: 280 },
  { from: 'dhaka', to: 'tokyo', color: '#3B82F6', workers: 180 },
];

/**
 * Converts Latitude & Longitude to 3D Cartesian Vector
 */
export function latLonToVector3(lat, lon, radius = 2) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}
