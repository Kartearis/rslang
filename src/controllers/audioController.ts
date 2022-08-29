

export default class AudioController {
    private audioElement: HTMLAudioElement
    private dataLoaded: boolean = false

    constructor(soundPath: string) {
        this.audioElement = new Audio(soundPath);
        this.audioElement.addEventListener('canplaythrough', () => this.dataLoaded = true)
    }

    // Returns promise, resolving on play start (throwing if impossible)
    async play(): Promise<void> {
        return this.audioElement.play();
    }

    loadPath(soundPath: string): AudioController {
        this.audioElement.src = soundPath;
        this.dataLoaded = false;
        return this;
    }

    // Will not play sound if data is not loaded
    syncPlay(): void {
        if (this.dataLoaded)
            this.audioElement.play();
    }

    pause(): void {
        this.audioElement.pause();
    }

    setMute(state: boolean = true): AudioController {
        this.audioElement.muted = state;
        return this;
    }

    setLoop(): AudioController {
        this.audioElement.loop = true;
        return this;
    }

    toggleMute(): AudioController {
        this.audioElement.muted = !this.audioElement.muted;
        return this;
    }

    setVolume(volume: number = 0.5): AudioController {
        this.audioElement.volume = volume;
        return this;
    }

    reset(): AudioController {
        this.audioElement.currentTime = 0;
        return this;
    }

}