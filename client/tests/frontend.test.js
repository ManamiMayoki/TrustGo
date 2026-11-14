import { describe, it, expect } from 'vitest';
import { COORDINATES, CORRIDORS, latLonToVector3 } from '../src/constants/corridors';

describe('Frontend Corridor & Geometry Calculations', () => {
  it('should define all 4 required recruitment corridors from Dhaka', () => {
    expect(COORDINATES.dhaka).toBeDefined();
    expect(COORDINATES.dhaka.isHub).toBe(true);

    expect(COORDINATES.dubai).toBeDefined();
    expect(COORDINATES.riyadh).toBeDefined();
    expect(COORDINATES.warsaw).toBeDefined();
    expect(COORDINATES.tokyo).toBeDefined();
  });

  it('should calculate 3D Cartesian coordinates correctly from lat/lon', () => {
    const radius = 2;
    const [x, y, z] = latLonToVector3(COORDINATES.dhaka.lat, COORDINATES.dhaka.lon, radius);

    expect(typeof x).toBe('number');
    expect(typeof y).toBe('number');
    expect(typeof z).toBe('number');

    // Vector magnitude should approximately equal sphere radius
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    expect(Math.abs(magnitude - radius)).toBeLessThan(0.001);
  });

  it('should ensure all corridors originate from Dhaka hub', () => {
    CORRIDORS.forEach((corridor) => {
      expect(corridor.from).toBe('dhaka');
      expect(['dubai', 'riyadh', 'warsaw', 'tokyo']).toContain(corridor.to);
      expect(corridor.color).toBeDefined();
      expect(corridor.workers).toBeGreaterThan(0);
    });
  });
});
