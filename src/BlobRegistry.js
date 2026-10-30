/**
 * A utility class to manage Browser Object URLs and prevent memory leaks.
 */
class BlobRegistry {
    constructor(instanceName = "Default") {
        this.name = instanceName;
        this._registry = new Map();
    }

    /**
     * Creates a URL from a File/Blob and revokes the previous URL assigned to the same key.
     * @param {File|Blob} file 
     * @param {string} key - Unique identifier for this specific resource.
     * @returns {string|null} The generated Object URL.
     */
    create(file, key) {
        if (!(file instanceof Blob || typeof file === "string")) {
            //console.error(`[${this.name}]: Provided item is not a Blob or File.`);
            return null;
        }

        // Auto-cleanup: Revoke existing URL for this key before creating a new one
        this.revoke(key);

        const url = typeof file === "string" ? file : URL.createObjectURL(file);
        this._registry.set(key, url);

        return url;
    }

    /**
     * Revokes a specific URL by key and removes it from the registry.
     * @param {string} key 
     */
    revoke(key) {
        if (this._registry.has(key)) {
            URL.revokeObjectURL(this._registry.get(key));
            this._registry.delete(key);
        }
    }

    /**
     * Clears all URLs managed by this specific class instance.
     */
    destroy() {
        this._registry.forEach((url) => URL.revokeObjectURL(url));
        this._registry.clear();
        console.log(`[${this.name}]: Registry destroyed and memory cleared.`);
    }

    /**
     * Returns the current number of active URLs in this instance.
     */
    get size() {
        return this._registry.size;
    }
}

export default BlobRegistry;