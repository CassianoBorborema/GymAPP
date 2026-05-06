export class Aluno {
  private password: string;

  constructor(
    readonly id: string,
    public name: string,
    public email: string,
    public weight: number,
    public CPF: string,
    password: string,
  ) {
    this.password = password;
    this.validate();
  }

  private validate() {
    if (!this.name || this.name.length < 2) {
      throw new Error("Nome do aluno inválido");
    }
    if (!this.email.includes("@")) {
      throw new Error("E-mail inválido");
    }
    if (this.weight <= 0) {
      throw new Error("O peso deve ser maior que zero.");
    }
    if (!this.password || this.password.length < 4) {
      throw new Error("A senha deve ter pelo menos 4 dígitos. ");
    }
  }
}
