class DataStorage {
    static collector = {};
    constructor() { };
    add(id, dataset) {
        if (id && Array.isArray(dataset)) {
            Reflect.set(DataStorage.collector, id, dataset);
        }
    }

    get(id) {
        if (id in DataStorage.collector) {
            return Reflect.get(DataStorage.collector, id);
        }
        return null;
    }
}
const storage = new DataStorage();

export default { storage }