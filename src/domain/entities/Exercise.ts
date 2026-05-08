export type MuscleGroup = "Peito" | "Costas" | "Pernas" | "Ombros" | "Braços";

export class Exercise {
  constructor(
    readonly id: string, 
    public name: string,
    public muscleGroup: MuscleGroup,
    public videoUrl?: string,
    public description?: string,
  ) {
    this.validate();
  }

  private validate() {
    if (!this.name || this.name.length < 3) {
      throw new Error("Nome do exercício muito curto.");
    }
    if (!this.muscleGroup) {
      throw new Error("Grupo Muscular é obrigatório");
    }
  }
}
