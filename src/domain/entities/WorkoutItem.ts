export class WorkoutItem{
    constructor(
        readonly id: string,
        public exerciseId: string,
        public sets:number,
        public reps:number,
        public restTime: number,
        public observations?: string 
    ) {
        this.validate
    }

    private validate(){
        if (this.sets <= 0 ){
            throw new Error("O número de séries deve ser maior que zero.");
        }
        if (!this.exerciseId){
            throw new Error("O ID do exercíco é obrigatório para vincular ao treino.");
        }
        if (!this.reps){
            throw new Error("As repetições devem ser informadas.");
        }
    }
}