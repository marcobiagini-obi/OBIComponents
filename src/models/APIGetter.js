import { initClass } from "../../core.js";
/**
 * Class representing parameters for API data retrieval, including filtering, sorting, and pagination.
 *
 * @export
 * @class APIGetter
 */
export default class APIGetter {
    /**
     * Filters to apply when retrieving data.
     * Example: key-value pairs for filtering { "status": "active", "category": "books" }
     * @type {Object}
     * @memberof APIGetter
     */
    filters = {};
    /**
     * Sorting options for the data retrieval.
     * 
     * @type {string}
     * @memberof APIGetter
     */
    sort = "";
    /**
     * Sort order: true for descending, false for ascending.
     *
     * @type {boolean}
     * @memberof APIGetter
     */
    desc = false;
    /**
     * Page number for pagination (1-based index).
     *
     * @default 1
     * @type {number}
     * @memberof APIGetter
     */
    page = 1;
    /**
     * Number of rows per page for pagination.
     * 
     * @default 1000
     * @type {number}
     * @memberof APIGetter
     */
    rows = 1000;

    constructor(init) {
        if (init) initClass.call(this, init);
    }
}