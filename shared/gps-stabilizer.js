/**
 * GPS Coordinate Stabilization Utility
 * Prevents GPS jitter by caching coordinates and only updating when significant movement detected
 */

class GPSStabilizer {
    constructor() {
        this.lastCoords = null;
        this.coordHistory = [];
        this.maxHistorySize = 5;
        this.movementThreshold = 0.05; // ~50 meters in km
    }

    /**
     * Calculate distance between two coordinates using Haversine formula
     * @param {number} lat1 - Latitude 1
     * @param {number} lon1 - Longitude 1
     * @param {number} lat2 - Latitude 2
     * @param {number} lon2 - Longitude 2
     * @returns {number} Distance in kilometers
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    /**
     * Round coordinates to reduce precision noise
     * 5 decimal places = ~1.1m precision (sufficient for farming)
     * @param {number} coord - Coordinate to round
     * @returns {number} Rounded coordinate
     */
    roundCoordinate(coord) {
        return Math.round(coord * 100000) / 100000;
    }

    /**
     * Stabilize coordinates using distance threshold and caching
     * @param {number} lat - New latitude
     * @param {number} lon - New longitude
     * @returns {Object} {lat, lon} Stabilized coordinates
     */
    stabilize(lat, lon) {
        // Round coordinates first
        const roundedLat = this.roundCoordinate(lat);
        const roundedLon = this.roundCoordinate(lon);

        // If no previous coordinates, use current
        if (!this.lastCoords) {
            this.lastCoords = { lat: roundedLat, lon: roundedLon };
            this.coordHistory.push(this.lastCoords);
            return this.lastCoords;
        }

        // Calculate distance from last known position
        const distance = this.calculateDistance(
            this.lastCoords.lat,
            this.lastCoords.lon,
            roundedLat,
            roundedLon
        );

        // Only update if moved significantly
        if (distance > this.movementThreshold) {
            this.lastCoords = { lat: roundedLat, lon: roundedLon };

            // Add to history
            this.coordHistory.push(this.lastCoords);
            if (this.coordHistory.length > this.maxHistorySize) {
                this.coordHistory.shift();
            }
        }

        return this.lastCoords;
    }

    /**
     * Get moving average of recent coordinates for extra smoothing
     * @returns {Object} {lat, lon} Averaged coordinates
     */
    getSmoothed() {
        if (this.coordHistory.length === 0) {
            return this.lastCoords || { lat: 0, lon: 0 };
        }

        const avgLat = this.coordHistory.reduce((sum, coord) => sum + coord.lat, 0) / this.coordHistory.length;
        const avgLon = this.coordHistory.reduce((sum, coord) => sum + coord.lon, 0) / this.coordHistory.length;

        return {
            lat: this.roundCoordinate(avgLat),
            lon: this.roundCoordinate(avgLon)
        };
    }

    /**
     * Force update coordinates (useful for manual location changes)
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     */
    forceUpdate(lat, lon) {
        this.lastCoords = {
            lat: this.roundCoordinate(lat),
            lon: this.roundCoordinate(lon)
        };
        this.coordHistory = [this.lastCoords];
    }

    /**
     * Reset the stabilizer
     */
    reset() {
        this.lastCoords = null;
        this.coordHistory = [];
    }
}

// Create global instance
window.gpsStabilizer = new GPSStabilizer();
