import { WorkoutItem } from "./WorkoutItem.js";

export class Workout {
  private items: WorkoutItem[]=[];

  constructor(
    readonly id: string,
    readonly alunoId: string,
    readonly instructorId: string,
    public title: string,
    items: WorkoutItem[],
    public createdAt: Date = new Date()
  ) {
     this.items =  items;
    this.validate();
  }
  private validate() {
    if (!this.title || this.title.length < 3) {
      throw new Error("Nome inválido");
    }
    if(!this.alunoId){
      throw new Error("ID do aluno é obrigatório.");
    }
    if(!this.items || this.items.length ===0){
      throw new Error("O treino deve ter pelo menos um exercício.");
    }

  }

  addItem(item: WorkoutItem): void {
    this.items.push(item);
    this.validate();
  }

  removeItem(itemId: string): void {
    this.items = this.items.filter(item => item.id !== itemId);
    this.validate();
  }

  getItems(): readonly WorkoutItem[] {
    return this.items;
  }
}
