// World of Raul Rule Manager
module GP {
    export class RuleManager {

        // Statics
        private experienceRate: number = 0.51;
        private playerDamage: number = 1;

        // Calculate the damage done from the player to the enemy
        calculateDamage(player: Player, enemy: Enemy) {
            var self = this;
            var primaryFired = player.primarySkill.checkFired();
            var playerPos = player.yawObject.position;

            if (primaryFired) {
                // Reduce the energy
                player.viewModel.energy(player.viewModel.energy() - player.primarySkill.energyCost >= 0 ? player.viewModel.energy() - player.primarySkill.energyCost : 0);

                // Check if it's a hit - then decrease enemy health and increase player experience
                if (self.isAliveAndInRange(playerPos, enemy)) {
                    // Decrease enemy health
                    enemy.health -= self.playerDamage;

                    // Increase player experience
                    player.experience += self.playerDamage;
                    self.calculateLevelExperience(player);

                    // Check if enemy has been killed
                    if (enemy.health > 0) {
                        // Damaged the enemy some more ...
                    } else {
                        // You killed the enemy!
                        toastr.success("You killed '" + enemy.name + "'");

                        // TODO: Drop some loot now
                        enemy.dead = true;
                    }
                }
            }
        }

        // Calculate the experience for the player
        calculateLevelExperience(player: Player) {
            var self = this;

            // Calculate the real level
            var calculatedLevel = Math.pow(player.experience, self.experienceRate);

            // Calculate the current and next lvl
            var currentLevel = Math.floor(calculatedLevel);
            var nextLevel = Math.ceil(calculatedLevel);
            var percentageToNextLevel = (calculatedLevel - currentLevel) * 100;
            var roundedPercentage = Math.round(percentageToNextLevel * 100) / 100;

            if (player.viewModel.level() < currentLevel) {
                // Player has leveled up
                self.handleLevelUp(player, currentLevel);
            }

            player.viewModel.experience(roundedPercentage);
        }

        // Handle the player level up logic
        handleLevelUp(player: Player, newLevel: number) {
            player.viewModel.energy(100);
            player.viewModel.health(100);
            player.viewModel.level(newLevel);
        }

        // Check if the given vector3 is in range or if this enemy is dead
        isAliveAndInRange(playerPosition: THREE.Vector3, enemy: Enemy) {
            var self = this;

            if (!playerPosition) {
                return enemy.health > 0;
            }
            else {
                return enemy.health > 0
                    && Math.abs(playerPosition.x - enemy.mesh.position.x) < 4
                    && Math.abs(playerPosition.z - enemy.mesh.position.z) < 4;
            }
        }
    }
} 