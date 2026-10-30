export class User {
    _settings = {};
    _data;
    _history = [];
    _favourites = {};
    _id = "lamp_user";
    state = "active";
    get settings() { return this._settings; }
    get data() { return this._data; }
    get history() { return this._history; }
    get favourites() { return this._favourites; }
    get id() { return this._id; }
    constructor(id, data, settings) {
        this._id = id;
        this._data = data;
        this._settings = settings || {};
    }
    save() {
        try {
            let _storage = {
                history: this.history,
                settings: this.settings,
                favourites: this.favourites,
            };
            localStorage.setItem(this.id, JSON.stringify(_storage));
        }
        catch (ex) {
            throw ex;
        }
    }
    addHistory(item) {
        if (item) {
            this._history.push(item);
            this.save();
        }
    }
    resetHistory() {
        this._history = [];
        this.save();
    }
    goBack() {
        if (this.history.length > 1) {
            this._history.pop();
            this.save();
            return this.history[this.history.length - 1];
        }
        return null;
    }
    removeHistory(key) {
        if (key) {
            let index = this._history.findIndex(h => h.key === key);
            if (index > -1) {
                this._history.splice(index, 1);
                this.save();
            }
        }
    }
    setFavourites(favourite) {
        if (favourite) {
            Object.assign(this._favourites, favourite);
            this.save();
        }
    }
    removeFavourite(key) {
        if (key && this._favourites[key]) {
            delete this._favourites[key];
            this.save();
        }
    }

    static retrive(id, data) {
        try {
            let _storage = localStorage.getItem(id);
            if (_storage) {
                let _obj = JSON.parse(_storage);
                let _user = new User(id, data, _obj.settings);
                _user._history = _obj.history;
                _user._favourites = _obj.favourites;
                return _user;
            }
            return undefined;
        }
        catch (ex) {
            throw ex;
        }
    }
}
