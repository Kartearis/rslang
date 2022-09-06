export default class StorageController {
    private storage: Storage;
    private prefix: string;

    constructor(prefix: string) {
        this.storage = window.localStorage;
        this.prefix = prefix;
    }

    protected buildLabel(label: string) {
        return `${this.prefix}--${label}`;
    }

    write(label: string, data: unknown) {
        this.storage.setItem(this.buildLabel(label), JSON.stringify(data));
    }

    read(label: string): unknown {
        return JSON.parse(this.storage.getItem(this.buildLabel(label)) || '""');
    }

    check(label: string): boolean {
        return this.storage.getItem(this.buildLabel(label)) !== null;
    }

    remove(label: string): void {
        this.storage.removeItem(this.buildLabel(label));
    }

    clear(): void {
        Object.keys(this.storage)
            .filter((key) => key.startsWith(this.prefix))
            .forEach((key) => {
                this.storage.removeItem(key);
            });
    }
}
