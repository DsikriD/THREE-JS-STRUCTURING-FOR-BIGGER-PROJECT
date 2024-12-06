import * as THREE from "three";
import Experience from "../Experience.js";

let position = new THREE.Vector3(0, 0, 0);
let velocity = new THREE.Vector3(0, 0, 0);

export default class Fox {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("fox");
    }

    this.initControls();

    // Resource
    this.resource = this.resources.items.foxModel;

    this.setModel();
    this.setAnimation();
  }

  initControls() {
    window.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "KeyW":
          this.animation.play("running");
          console.log("Вперед", position);
          break;
        case "KeyS":
          this.animation.play("idle");
          console.log("Назад");
          break;
        case "KeyA":
          this.model.rotation.y += 0.3; // Увеличиваем угол вращения
          console.log("Влево");
          break;
        case "KeyD":
          this.model.rotation.y -= 0.3; // Увеличиваем угол вращения
          console.log("Вправо");
          break;
        default:
          break;
      }
    });
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.02, 0.02, 0.02);
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
  }

  setAnimation() {
    this.animation = {};

    // Mixer
    this.animation.mixer = new THREE.AnimationMixer(this.model);

    // Actions
    this.animation.actions = {};

    this.animation.actions.idle = this.animation.mixer.clipAction(
      this.resource.animations[0]
    );
    this.animation.actions.walking = this.animation.mixer.clipAction(
      this.resource.animations[1]
    );
    this.animation.actions.running = this.animation.mixer.clipAction(
      this.resource.animations[2]
    );

    this.animation.actions.current = this.animation.actions.idle;
    this.animation.actions.current.play();

    // Play the action
    this.animation.play = (name) => {
      const newAction = this.animation.actions[name];
      const oldAction = this.animation.actions.current;

      newAction.reset();
      newAction.play();
      newAction.crossFadeFrom(oldAction, 1);

      this.animation.actions.current = newAction;
    };

    // Debug
    if (this.debug.active) {
      const debugObject = {
        playIdle: () => {
          this.animation.play("idle");
        },
        playWalking: () => {
          this.animation.play("walking");
        },
        playRunning: () => {
          this.animation.play("running");
        },
      };
      this.debugFolder.add(debugObject, "playIdle");
      this.debugFolder.add(debugObject, "playWalking");
      this.debugFolder.add(debugObject, "playRunning");
    }
  }

  update() {
    const deltaTime = this.time.delta * 0.001; // Переводим в секунды

    // Рассчитываем скорость
    velocity.set(0, 0, 0);
    // Обновляем позицию
    //position.addScaledVector(velocity, deltaTime * 10); // Ускорение * deltaTime
    this.model.position.copy(position);

    // Обновляем миксер анимации
    this.animation.mixer.update(deltaTime * 2);
  }
}
