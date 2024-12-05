// World of Raul Skill Class
module GP {
    export class Skill {

        public clock: THREE.Clock;
        public energyCost: number;

        // Constructor
        constructor(public interval: number) {
            var self = this;
            self.clock = new THREE.Clock();
            self.energyCost = 5;
        }

        // Check if the skill has cooldown
        hasCooldown() {
            var self = this, time;

            if (self.clock.running) {
                // Clock is running so get the time
                time = self.clock.getElapsedTime();
                if (time > self.interval) {
                    // Interval is over, reset the clock and allow the skill to fire again.
                    self.clock.elapsedTime = 0;
                    return false;
                } else {
                    // Interval is not over yet, so continue to block the skill
                    return true;
                }
            }
            else {
                // Clock is not running so return a negative result
                time = self.clock.getElapsedTime();
                return false;
            }
        }

        // Fire the skill
        fire(camera: THREE.Camera) {
        }
    }
}