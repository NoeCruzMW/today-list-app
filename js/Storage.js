/**
 * @author Noe Cruz | Zurckz
 *  Status 
 *  0 == not configured
 *  1 == configured
 *  2 == started
 */
class ZStorage {
    constructor(storageName, schema) {
        this.storageName = storageName;
        this.schema = schema;
        this.__read();
    }

    __read() {
        let existSchema = localStorage.getItem(this.storageName);
        let error = 0;

        if (typeof existSchema !== 'undefined') {
            try {
                this.data = JSON.parse(existSchema.toString());
                error = 1;
            } catch (e) {
                error = 0;
            }
        }

        if (error == 0) {
            localStorage.setItem(this.storageName, JSON.stringify(this.schema));
            this.data = this.schema;
        }
    }

    updateAll(schema) {
        localStorage.setItem(storageName, JSON.stringify(schema));
        this.__read();
    }

    update(key, value) {
        this.data[key] = value;
        localStorage.setItem(this.storageName, JSON.stringify(this.data));
        this.__read();
    }

    get(key) {
        return this.data[key];
    }

    get allData() {
        return this.data;
    }
}