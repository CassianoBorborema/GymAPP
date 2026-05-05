import { Exercise } from "../entities/Exercise";

export class Workout {
  private exercise: Exercise[] = [];

  constructor(
    readonly id: string,
    readonly alunoid: string,
    readonly instructorid: string,
    public title: string,
  ) {
    this.validate();
  }
  private validate() {
    if (!this.title || this.title.length < 3) {
      throw new Error("Nome inválido");
    }
  }
}
