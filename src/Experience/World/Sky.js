import * as THREE from "three";
import Experience from "../Experience.js";

export default class Sky {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;

    this.dayColor = new THREE.Color(0x87ceeb); // Дневной цвет
    this.nightColor = new THREE.Color(0x000033); // Ночной цвет

    this.setSky();
    //this.addLensFlare();
  }

  setSky() {
    // Загрузка изображения
    const environmentMap = this.resources.items.background;

    this.scene.background = environmentMap;
  }
  update() {
    const deltaTime = this.time.delta * 0.001; // Переводим в секунды
  }
}
