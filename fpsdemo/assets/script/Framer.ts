export class Framer {
    public isStart = false;
    public routine: (framer: Framer) => {} = null!;

    constructor(routine: (framer: Framer) => {}) {
        this.routine = routine;
    }

    start() {
        this.isStart = true;
    }

    stop() {
        this.isStart = false;
    }

    next() {
        if (this.isStart) {
            this.routine(this);
        }
    }
}